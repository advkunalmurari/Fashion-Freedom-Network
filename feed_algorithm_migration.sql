-- feed_algorithm_migration.sql
-- This migration creates the `get_algorithmic_feed` RPC function for the FFN platform.
-- It replaces pure chronological feeds with an engagement & monetization-driven algorithm.

CREATE OR REPLACE FUNCTION get_algorithmic_feed()
RETURNS TABLE (
  id uuid,
  author_id uuid,
  caption text,
  media_url text,
  type text,
  created_at timestamptz,
  author_full_name text,
  author_avatar_url text,
  author_role text,
  author_is_premium boolean,
  likes_count bigint,
  comments_count bigint,
  feed_score numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.author_id,
    p.caption,
    p.media_url,
    p.type,
    p.created_at,
    pr.full_name as author_full_name,
    pr.avatar_url as author_avatar_url,
    pr.role as author_role,
    pr.is_premium as author_is_premium,
    COALESCE(l.likes_count, 0) as likes_count,
    COALESCE(c.comments_count, 0) as comments_count,
    (
      -- Engagement Bonus
      (COALESCE(l.likes_count, 0) * 5.0) + 
      (COALESCE(c.comments_count, 0) * 10.0) +
      
      -- Monetization & Quality Bonus
      (CASE WHEN pr.is_premium THEN 1000.0 ELSE 0.0 END) +
      COALESCE(pr.search_rank_score, 0.0) -
      
      -- Recency Penalty (Older posts lose points, ~10 pts per hour)
      (EXTRACT(EPOCH FROM (now() - p.created_at)) / 3600.0 * 10.0)
    ) as feed_score
  FROM posts p
  JOIN profiles pr ON p.author_id = pr.user_id
  LEFT JOIN (
    SELECT post_id, count(*) as likes_count
    FROM likes
    GROUP BY post_id
  ) l ON l.post_id = p.id
  LEFT JOIN (
    SELECT post_id, count(*) as comments_count
    FROM comments
    GROUP BY post_id
  ) c ON c.post_id = p.id
  ORDER BY feed_score DESC, p.created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grants access to the RPC so authenticated users can call it securely via Supabase JS
GRANT EXECUTE ON FUNCTION get_algorithmic_feed() TO authenticated;
GRANT EXECUTE ON FUNCTION get_algorithmic_feed() TO anon;
