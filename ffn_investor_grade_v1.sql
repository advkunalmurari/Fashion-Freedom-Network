-- FFN Marketplace Infrastructure Upgrade Scripts (Phases 1-11)

-- =========================================================================
-- PHASE 1: VERIFIED PROFESSIONAL GRAPH & CORE PROFILES UPDATE
-- =========================================================================

-- ENUM for Experience Level (already existing or to be created)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_level_enum') THEN
        CREATE TYPE experience_level_enum AS ENUM ('beginner', 'intermediate', 'pro');
    END IF;
END $$;

-- 1. Extend profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS experience_level experience_level_enum DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS agency_affiliation TEXT,
ADD COLUMN IF NOT EXISTS work_history_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS brand_collaborations_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS portfolio_quality_score FLOAT DEFAULT 0.0,
-- Phase 2 Overlaps:
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available', -- available/busy
ADD COLUMN IF NOT EXISTS daily_rate NUMERIC DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
-- Phase 3 Overlaps:
ADD COLUMN IF NOT EXISTS reliability_score FLOAT DEFAULT 100.0,
ADD COLUMN IF NOT EXISTS avg_rating FLOAT DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS completed_jobs INTEGER DEFAULT 0;

-- 2. Work Credits Table
CREATE TABLE IF NOT EXISTS public.work_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    role TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    year INTEGER NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.work_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Work credits are viewable by everyone" ON public.work_credits
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own work credits" ON public.work_credits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work credits" ON public.work_credits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work credits" ON public.work_credits
    FOR DELETE USING (auth.uid() = user_id);


-- =========================================================================
-- PHASE 2: HIRING & BOOKING INFRASTRUCTURE
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.hire_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Using auth.users as placeholder for brand_id until Phase 5
    talent_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    project_title TEXT NOT NULL,
    budget NUMERIC NOT NULL,
    start_date DATE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending/accepted/rejected/completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.hire_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view hire requests involving them" ON public.hire_requests
    FOR SELECT USING (auth.uid() = brand_id OR auth.uid() = talent_id);

CREATE POLICY "Brands can insert hire requests" ON public.hire_requests
    FOR INSERT WITH CHECK (auth.uid() = brand_id);

CREATE POLICY "Involved parties can update hire requests" ON public.hire_requests
    FOR UPDATE USING (auth.uid() = brand_id OR auth.uid() = talent_id);


-- =========================================================================
-- PHASE 3: TALENT REPUTATION ENGINE
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.talent_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_brand_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    talent_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    professionalism_score INTEGER CHECK (professionalism_score BETWEEN 1 AND 5),
    punctuality_score INTEGER CHECK (punctuality_score BETWEEN 1 AND 5),
    quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 5),
    communication_score INTEGER CHECK (communication_score BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.talent_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON public.talent_reviews
    FOR SELECT USING (true);

CREATE POLICY "Brands can insert reviews" ON public.talent_reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_brand_id);

-- Trigger to recalculate profile avg rating
CREATE OR REPLACE FUNCTION update_profile_reputation()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET 
        avg_rating = (
            SELECT ROUND(AVG(
                (professionalism_score + punctuality_score + quality_score + communication_score) / 4.0
            )::numeric, 1)
            FROM public.talent_reviews
            WHERE talent_id = NEW.talent_id
        ),
        completed_jobs = completed_jobs + 1
    WHERE user_id = NEW.talent_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_created ON public.talent_reviews;
CREATE TRIGGER on_review_created
    AFTER INSERT ON public.talent_reviews
    FOR EACH ROW EXECUTE FUNCTION update_profile_reputation();


-- =========================================================================
-- PHASE 4: RECURRING SUBSCRIPTION ENGINE
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL, -- Free, Professional, Elite
    status TEXT NOT NULL DEFAULT 'active',
    paypal_subscription_id TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);


-- =========================================================================
-- PHASE 5: BRAND PRO DASHBOARD
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.brands (
    id UUID REFERENCES auth.users(id) PRIMARY KEY ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    verified_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands are viewable by everyone" ON public.brands
    FOR SELECT USING (true);

CREATE POLICY "Brands can update their own profile" ON public.brands
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Brands can insert their own profile" ON public.brands
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =========================================================================
-- PHASE 6: MANAGED PHOTOSHOOT MARKETPLACE
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.photographers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    portfolio_url TEXT,
    rating FLOAT DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.shoot_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    duration TEXT NOT NULL,
    deliverables TEXT NOT NULL,
    city TEXT NOT NULL,
    photographer_id UUID REFERENCES public.photographers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoot_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photographers viewable by everyone" ON public.photographers FOR SELECT USING (true);
CREATE POLICY "Packages viewable by everyone" ON public.shoot_packages FOR SELECT USING (true);

-- =========================================================================
-- PHASE 7 & 9 & 10: MATCHES, COLLABORATIONS, AGENCIES
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.match_scores (
    brand_id UUID NOT NULL,
    talent_id UUID NOT NULL,
    score FLOAT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (brand_id, talent_id)
);

CREATE TABLE IF NOT EXISTS public.collaborations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    talent_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    collaborator_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    project_name TEXT NOT NULL, -- Replaced project_id with name for simplicity initially
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_name TEXT NOT NULL,
    city TEXT NOT NULL,
    verified_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match scores viewable by brand" ON public.match_scores FOR SELECT USING (auth.uid() = brand_id);
CREATE POLICY "Collaborations viewable by everyone" ON public.collaborations FOR SELECT USING (true);
CREATE POLICY "Agencies viewable by everyone" ON public.agencies FOR SELECT USING (true);

-- =========================================================================
-- PHASE 8: PLATFORM METRICS
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.platform_metrics_daily (
    date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
    active_talent INTEGER DEFAULT 0,
    active_brands INTEGER DEFAULT 0,
    hires_completed INTEGER DEFAULT 0,
    time_to_hire_hours NUMERIC DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    new_signups INTEGER DEFAULT 0
);

ALTER TABLE public.platform_metrics_daily ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Metrics viewable by everyone" ON public.platform_metrics_daily FOR SELECT USING (true);
