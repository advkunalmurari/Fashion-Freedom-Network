-- Fashion Freedom Network (FFN) - Consolidated Production Migration
-- This script prepares the database for public launch with RLS, Security, and Core Features.

-- 1. JOB SYSTEM
CREATE TABLE IF NOT EXISTS public.job_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  location text,
  salary_range text,
  type text CHECK (type IN ('full-time', 'part-time', 'contract', 'freelance')),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid REFERENCES public.job_posts(id) ON DELETE CASCADE,
  applicant_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  resume_url text,
  cover_letter text,
  created_at timestamptz DEFAULT now()
);

-- 2. STORIES SYSTEM
CREATE TABLE IF NOT EXISTS public.stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  media_url text NOT NULL,
  media_type text CHECK (media_type IN ('image', 'video')),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

-- 3. NETWORK & CONNECTIONS
CREATE TABLE IF NOT EXISTS public.follows (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS public.connection_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS public.connections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- 4. SOCIAL INFRASTRUCTURE (SAVED POSTS & REPORTS)
CREATE TABLE IF NOT EXISTS public.saved_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

CREATE TABLE IF NOT EXISTS public.content_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text NOT NULL, -- 'post', 'comment', 'profile'
  content_id uuid NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  created_at timestamptz DEFAULT now()
);

-- 5. CHAT SYSTEM
CREATE TABLE IF NOT EXISTS public.chats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_participants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id uuid REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(chat_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id uuid REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 6. INVESTOR GRADE FEATURES (TALENT MARKETPLACE)
CREATE TABLE IF NOT EXISTS public.work_credits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  talent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id uuid, -- Reference to profiles table handled via application logic
  project_name text NOT NULL,
  role text,
  media_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hire_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_type text,
  budget numeric,
  details text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- 7. ENABLE RLS ON ALL TABLES
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hire_requests ENABLE ROW LEVEL SECURITY;

-- 8. SECURITY HARDENING POLICIES

-- Job Posts: Anyone can view, only author can manage
CREATE POLICY "Anyone can view job posts" ON public.job_posts FOR SELECT USING (true);
CREATE POLICY "Users can create job posts" ON public.job_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update their job posts" ON public.job_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete their job posts" ON public.job_posts FOR DELETE USING (auth.uid() = author_id);

-- Job Applications: Only applicant and job author can view
CREATE POLICY "Applicants and job authors can view applications" ON public.job_applications FOR SELECT 
USING (
  auth.uid() = applicant_id OR 
  EXISTS (SELECT 1 FROM public.job_posts WHERE id = job_id AND author_id = auth.uid())
);
CREATE POLICY "Users can apply for jobs" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- Stories: Followers can view, author can manage
CREATE POLICY "Followers can view stories" ON public.stories FOR SELECT 
USING (
  auth.uid() = author_id OR 
  EXISTS (SELECT 1 FROM public.follows WHERE follower_id = auth.uid() AND following_id = author_id)
);
CREATE POLICY "Users can create stories" ON public.stories FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete their own stories" ON public.stories FOR DELETE USING (auth.uid() = author_id);

-- Chat System Hardening
CREATE POLICY "Users can view their chat memberships" ON public.chat_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can see messages in their chats" ON public.messages FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.chat_participants WHERE chat_id = messages.chat_id AND user_id = auth.uid()));
CREATE POLICY "Users can send messages to their chats" ON public.messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND 
  EXISTS (SELECT 1 FROM public.chat_participants WHERE chat_id = messages.chat_id AND user_id = auth.uid())
);

-- 9. STORAGE BUCKET POLICIES (Assuming buckets exist)
-- Replace 'avatars', 'posts', 'messages' with your actual bucket names if different.
-- Ensure these buckets are created in the Supabase Storage dashboard.

-- Note: Storage policies are applied to storage.objects
-- Example for 'posts' bucket
-- CREATE POLICY "Anyone can view posts" ON storage.objects FOR SELECT USING (bucket_id = 'posts');
-- CREATE POLICY "Users can upload their own posts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'posts' AND auth.uid() = owner);
