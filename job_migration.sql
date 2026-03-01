-- job_migration.sql
-- Subsystem: Casting Calls & Job Board (Social Pivot Phase 4)

-- 1. Create Job Posts Table
CREATE TABLE IF NOT EXISTS public.job_posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.users(id) on delete cascade not null,
  company_name text not null,
  title text not null,
  talent_category text not null,
  location text not null,
  shoot_date date not null,
  budget text not null,
  description text not null,
  contact_email text not null,
  created_at timestamptz default now() not null
);

-- 2. Create Job Applications Table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.job_posts(id) on delete cascade not null,
  applicant_id uuid references public.users(id) on delete cascade not null,
  pitch text not null,
  status text default 'pending' not null,
  created_at timestamptz default now() not null,
  unique(job_id, applicant_id) -- Prevent double applications
);

-- Enable RLS
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Job Posts Policies
-- 1. Anyone authenticated can READ job posts
CREATE POLICY "Anyone can read job posts" 
ON public.job_posts FOR SELECT 
TO authenticated 
USING (true);

-- 2. Authenticated users can CREATE job posts
CREATE POLICY "Authenticated users can create job posts" 
ON public.job_posts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = author_id);

-- Job Applications Policies
-- 1. Authors of the Job Post can READ applications for their jobs
CREATE POLICY "Job authors can read applications" 
ON public.job_applications FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.job_posts jp 
    WHERE jp.id = job_applications.job_id 
    AND jp.author_id = auth.uid()
  )
);

-- 2. Applicants can READ their own applications
CREATE POLICY "Applicants can read own applications" 
ON public.job_applications FOR SELECT 
TO authenticated 
USING (auth.uid() = applicant_id);

-- 3. Authenticated users can CREATE applications
CREATE POLICY "Users can apply to jobs" 
ON public.job_applications FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = applicant_id);
