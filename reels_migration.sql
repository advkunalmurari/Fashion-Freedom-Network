-- reels_migration.sql
-- Subsystem: Reels & Vertical Video (Social Pivot Phase 5)

CREATE OR REPLACE FUNCTION get_reels_feed()
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
      -- Reels Engagement Bonus (Stronger emphasis on likes)
      (COALESCE(l.likes_count, 0) * 8.0) + 
      (COALESCE(c.comments_count, 0) * 12.0) +
      
      -- Monetization Bonus
      (CASE WHEN pr.is_premium THEN 500.0 ELSE 0.0 END) +
      
      -- Faster Recency Decay for Reels (20 pts per hour)
      -- Keeps the "Motion" feed extremely fresh
      (EXTRACT(EPOCH FROM (now() - p.created_at)) / 3600.0 * 20.0 * -1.0)
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
  WHERE p.type = 'video' -- STRICT FILTER FOR REELS
  ORDER BY feed_score DESC, p.created_at DESC
  LIMIT 25;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grants
GRANT EXECUTE ON FUNCTION get_reels_feed() TO authenticated;
GRANT EXECUTE ON FUNCTION get_reels_feed() TO anon;
