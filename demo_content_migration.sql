-- Add demo content tracking flags
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_demo_content BOOLEAN DEFAULT FALSE;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_demo_content BOOLEAN DEFAULT FALSE;
ALTER TABLE public.job_posts ADD COLUMN IF NOT EXISTS is_demo_content BOOLEAN DEFAULT FALSE;
