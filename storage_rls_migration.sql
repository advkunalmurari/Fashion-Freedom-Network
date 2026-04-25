-- FFN Storage RLS Hardening
-- This script sets up secure access for Supabase Storage buckets

-- 1. Ensure buckets exist (Social Pivot)
-- Note: Buckets are usually created in the Supabase Dashboard, 
-- but we define the policies here.

-- 2. Avatars Bucket Policies
-- Anyone can view avatars
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Users can only upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can only update/delete their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );


-- 3. Posts/Media Bucket Policies
-- Public posts are viewable by anyone
CREATE POLICY "Public Posts Viewable"
ON storage.objects FOR SELECT
USING ( bucket_id = 'posts' );

-- Users can only upload to their own folder in 'posts'
CREATE POLICY "Users can upload own media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'posts' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can only update/delete their own media in 'posts'
CREATE POLICY "Users can update own media"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'posts' AND (storage.foldername(name))[1] = auth.uid()::text );

CREATE POLICY "Users can delete own media"
ON storage.objects FOR DELETE
USING ( bucket_id = 'posts' AND (storage.foldername(name))[1] = auth.uid()::text );


-- 4. Message Attachments (Private)
-- Only senders or recipients can view attachments
-- This requires checking the messages table which might be complex in Storage RLS.
-- Simplified: Only authenticated users for now, further hardening recommended via signed URLs.
CREATE POLICY "Authenticated users can view attachments"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'messages' );

CREATE POLICY "Users can upload message attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'messages' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
