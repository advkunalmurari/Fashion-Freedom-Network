-- FFN Upgrade Phase 2: Stories System
-- 1. Create stories table
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT CHECK (media_type IN ('image', 'video')) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: To auto-cleanup stories after 24 hours, you can create a cron job via pg_cron, e.g.:
-- select cron.schedule('cleanup-expired-stories', '0 * * * *', $$ DELETE FROM public.stories WHERE expires_at < now(); $$);

-- 2. Add professional tags and hiring boolean to stories
ALTER TABLE public.stories
ADD COLUMN IF NOT EXISTS story_tag TEXT CHECK (story_tag IN ('Behind the Shoot', 'Casting Alert', 'Designer Drop', 'Reel Preview', 'None')) DEFAULT 'None';

-- 3. Enable RLS
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for stories
CREATE POLICY "Stories are public to view" ON public.stories
    FOR SELECT USING (true); -- assuming anyone can view stories for now

CREATE POLICY "Users can create their own stories" ON public.stories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories" ON public.stories
    FOR DELETE USING (auth.uid() = user_id);


-- FFN Upgrade Phase 4: Pro-Grade Post Composer additions
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS is_open_for_hire BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS shoot_type TEXT CHECK (shoot_type IN ('editorial', 'commercial', 'runway', 'streetwear', 'other')),
ADD COLUMN IF NOT EXISTS brand_tag TEXT,
ADD COLUMN IF NOT EXISTS photographer_tag TEXT;


-- FFN Upgrade Phase 8: Profile Authority Boost additions
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS response_rate INTEGER DEFAULT 100, -- 0 to 100 representing percentage
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS availability_status BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS total_shoots INTEGER DEFAULT 0;
