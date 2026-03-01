-- FFN Supabase Maintenance: Automated Stories Cleanup Protocol
-- Run this in your Supabase SQL Editor to automatically delete stories older than 24 hours.

-- 1. Ensure the pg_cron extension is enabled for your project (available on Supabase Pro or by manually turning it on)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Create the cleanup job to run at the top of every hour
-- It safely deletes rows from the "stories" table where the expires_at timestamp has passed.
SELECT cron.schedule(
  'cleanup-expired-stories', -- Job Name
  '0 * * * *',               -- Cron Schedule (Every hour at minute 0)
  $$
    DELETE FROM public.stories
    WHERE expires_at < NOW();
  $$
);

-- Note:
-- If you ever need to unschedule this job, you can run:
-- SELECT cron.unschedule('cleanup-expired-stories');
