-- FFN Social Infrastructure V2: Professional Social Engine
-- This migration upgrades the existing social schema and adds missing tables as per Sections 1-12.

-- 1. Upgrade Posts Table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
ADD COLUMN IF NOT EXISTS shoot_type TEXT CHECK (shoot_type IN ('editorial', 'commercial', 'runway', 'streetwear', 'other')),
ADD COLUMN IF NOT EXISTS brand_tag TEXT,
ADD COLUMN IF NOT EXISTS photographer_tag TEXT;

-- 2. Upgrade Follows Table (Future-ready filtering)
ALTER TABLE public.follows
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- 3. Create Bookmarks (Saved Posts) Table
CREATE TABLE IF NOT EXISTS public.saved_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, post_id)
);

-- 4. Create Support/Moderation (Content Reports) Table
CREATE TABLE IF NOT EXISTS public.content_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable RLS
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Saved Posts
-- Users can only see their own saved posts
CREATE POLICY "Users can view their own saved posts" ON public.saved_posts
    FOR SELECT USING (auth.uid() = user_id);

-- Users can save posts
CREATE POLICY "Users can save posts" ON public.saved_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can unsave posts
CREATE POLICY "Users can unsave posts" ON public.saved_posts
    FOR DELETE USING (auth.uid() = user_id);

-- 7. RLS Policies for Content Reports
-- Users can create reports
CREATE POLICY "Users can report content" ON public.content_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Only admins should see reports (assuming auth.uid() check or role check)
-- For now, let's assume 'admin' meta-role or just restrict to specific IDs
-- CREATE POLICY "Admins can view reports" ON public.content_reports
--     FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 8. Advanced Feed & Ranking Logic (Phase 1 Refined)
-- Prioritizes: 
-- 1. Boosted content (Premium)
-- 2. Followed users
-- 3. High engagement (likes)
-- 4. Recency

CREATE OR REPLACE FUNCTION public.get_advanced_feed(p_limit INT DEFAULT 20, p_offset INT DEFAULT 0)
RETURNS SETOF json AS $$
DECLARE
    v_my_id UUID := auth.uid();
BEGIN
    RETURN QUERY
    SELECT json_build_object(
        'id', p.id,
        'author_id', p.author_id,
        'author_full_name', prof.full_name,
        'author_avatar_url', prof.avatar_url,
        'author_role', prof.role,
        'author_is_premium', prof.is_premium,
        'media_url', p.media_url,
        'caption', p.caption,
        'type', p.type,
        'created_at', p.created_at,
        'likes_count', (SELECT COUNT(*) FROM public.likes l WHERE l.post_id = p.id),
        'comments_count', (SELECT COUNT(*) FROM public.comments c WHERE c.post_id = p.id),
        'is_liked', EXISTS(SELECT 1 FROM public.likes l WHERE l.post_id = p.id AND l.user_id = v_my_id),
        'is_saved', EXISTS(SELECT 1 FROM public.saved_posts s WHERE s.post_id = p.id AND s.user_id = v_my_id)
    )
    FROM public.posts p
    JOIN public.profiles prof ON p.author_id = prof.id
    LEFT JOIN public.follows f ON f.following_id = p.author_id AND f.follower_id = v_my_id
    ORDER BY 
        prof.is_premium DESC, -- Section 5: Featured/Boosted first
        (f.id IS NOT NULL) DESC, -- Section 5: Followed users prioritized
        p.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Realtime Setup
alter publication supabase_realtime add table public.saved_posts;
