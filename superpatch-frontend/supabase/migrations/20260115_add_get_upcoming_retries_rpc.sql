-- Function to get upcoming retries (for dashboard display)
CREATE OR REPLACE FUNCTION get_upcoming_retries(p_limit INTEGER DEFAULT 20)
RETURNS TABLE(
  id UUID,
  name TEXT,
  phone TEXT,
  practitioner_type TEXT,
  retry_count INTEGER,
  next_retry_at TIMESTAMPTZ,
  retry_reason TEXT,
  city TEXT,
  province TEXT,
  time_until_retry INTERVAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.phone,
    p.practitioner_type,
    p.retry_count,
    p.next_retry_at,
    p.retry_reason,
    p.city,
    p.province,
    p.next_retry_at - NOW() as time_until_retry
  FROM practitioners p
  WHERE 
    p.next_retry_at IS NOT NULL
    AND p.do_not_call = FALSE
    AND p.phone IS NOT NULL
  ORDER BY p.next_retry_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION get_upcoming_retries(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_upcoming_retries(INTEGER) TO anon;

COMMENT ON FUNCTION get_upcoming_retries(INTEGER) IS 'Returns upcoming retry queue items with calculated time until retry';
