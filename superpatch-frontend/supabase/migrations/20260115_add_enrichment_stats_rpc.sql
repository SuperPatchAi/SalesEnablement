-- Create RPC function to get enrichment statistics in a single query
-- This is more efficient than making 5 separate count queries

CREATE OR REPLACE FUNCTION get_enrichment_stats()
RETURNS TABLE (
  total bigint,
  pending bigint,
  in_progress bigint,
  completed bigint,
  failed bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COUNT(*)::bigint as total,
    COUNT(*) FILTER (WHERE enrichment_status = 'pending')::bigint as pending,
    COUNT(*) FILTER (WHERE enrichment_status = 'in_progress')::bigint as in_progress,
    COUNT(*) FILTER (WHERE enrichment_status = 'completed')::bigint as completed,
    COUNT(*) FILTER (WHERE enrichment_status = 'failed')::bigint as failed
  FROM practitioners;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION get_enrichment_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_enrichment_stats() TO anon;

COMMENT ON FUNCTION get_enrichment_stats() IS 'Returns counts of practitioners by enrichment status for dashboard stats';
