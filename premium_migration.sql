-- FFN Monetization Upgrade: Premium "Reddish-Pink Tick" Schema
-- Run this securely in the Supabase Dashboard -> SQL Editor

ALTER TABLE profiles 
ADD COLUMN is_premium BOOLEAN DEFAULT false,
ADD COLUMN premium_badge_color TEXT DEFAULT 'none', -- Optional for dynamic colors, default 'reddish-pink'
ADD COLUMN subscription_status TEXT DEFAULT 'free', -- Enums: 'free', 'active', 'past_due', 'canceled'
ADD COLUMN subscription_tier TEXT DEFAULT 'none', -- Enums: 'monthly', 'annual'
ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN search_rank_score INTEGER DEFAULT 0, -- Calculated daily algorithm
ADD COLUMN profile_views_count INTEGER DEFAULT 0;

-- Optional: Create an index for faster Directory queries and sorting
CREATE INDEX IF NOT EXISTS idx_profiles_premium_rank 
ON profiles(is_premium DESC, search_rank_score DESC);
