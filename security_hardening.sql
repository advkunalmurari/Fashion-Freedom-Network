-- FFN Security Hardening (General)
-- This script tightens RLS policies across the platform

-- 1. Tighten Chat Participants
-- Previous policy allowed anyone to add anyone.
-- New Policy: Users can only add themselves, OR they must be part of the chat being created.
DROP POLICY IF EXISTS "Users can add participants to chats" ON public.chat_participants;

CREATE POLICY "Users can add themselves or others to chats they initiate"
ON public.chat_participants
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  (
    user_id = auth.uid() -- Can always add yourself
    OR
    EXISTS (
      SELECT 1 FROM public.chat_participants cp
      WHERE cp.chat_id = chat_participants.chat_id
      AND cp.user_id = auth.uid() -- Can add others if you are already in it
    )
  )
);

-- 2. Profiles Privacy
-- Ensure sensitive data in profiles isn't public (if any)
-- Assuming columns like 'phone' or 'address' should be private.
-- For this project, we'll ensure only the owner can update their profile.
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (id = auth.uid());

-- 3. Job Applications Privacy
-- Ensure applicants can't see other people's pitches unless they are the job author.
-- (This is already mostly handled in job_migration.sql, but we reinforce it here).
DROP POLICY IF EXISTS "Job authors can read applications" ON public.job_applications;
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
