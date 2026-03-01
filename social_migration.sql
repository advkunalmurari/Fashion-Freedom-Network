-- FFN Phase 2: Social Feed Infrastructure

-- 1. Create the Posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT,
    caption TEXT,
    type TEXT DEFAULT 'image' NOT NULL, -- 'image' or 'video'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Likes table
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id)
);

-- 3. Create the Comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Set up RLS Policies for Posts
-- Anyone can view posts
CREATE POLICY "Anyone can view posts" ON public.posts
    FOR SELECT
    USING (true);

-- Authenticated users can create posts
CREATE POLICY "Users can create posts" ON public.posts
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND author_id = auth.uid());

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts" ON public.posts
    FOR DELETE
    USING (author_id = auth.uid());


-- Set up RLS Policies for Likes
-- Anyone can view likes
CREATE POLICY "Anyone can view likes" ON public.likes
    FOR SELECT
    USING (true);

-- Authenticated users can like a post
CREATE POLICY "Users can like posts" ON public.likes
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Users can unlike (delete) their own likes
CREATE POLICY "Users can unlike their own likes" ON public.likes
    FOR DELETE
    USING (user_id = auth.uid());


-- Set up RLS Policies for Comments
-- Anyone can view comments
CREATE POLICY "Anyone can view comments" ON public.comments
    FOR SELECT
    USING (true);

-- Authenticated users can comment on a post
CREATE POLICY "Users can create comments" ON public.comments
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments" ON public.comments
    FOR DELETE
    USING (user_id = auth.uid());

-- Realtime Setup: Enable realtime for posts, likes, and comments
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.likes;
alter publication supabase_realtime add table public.comments;
