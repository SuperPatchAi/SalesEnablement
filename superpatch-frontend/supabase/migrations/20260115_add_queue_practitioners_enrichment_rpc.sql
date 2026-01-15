-- Helper function to queue practitioners for enrichment with validation
CREATE OR REPLACE FUNCTION queue_practitioners_for_enrichment(practitioner_ids UUID[])
RETURNS TABLE(
  queued_count INTEGER,
  already_enriched INTEGER,
  no_website INTEGER
) AS $$
DECLARE
  v_queued INTEGER := 0;
  v_enriched INTEGER := 0;
  v_no_website INTEGER := 0;
BEGIN
  -- Count already enriched
  SELECT COUNT(*)::INTEGER INTO v_enriched
  FROM practitioners
  WHERE id = ANY(practitioner_ids) AND enrichment_status = 'completed';
  
  -- Count those without websites
  SELECT COUNT(*)::INTEGER INTO v_no_website
  FROM practitioners
  WHERE id = ANY(practitioner_ids) AND website IS NULL;
  
  -- Update pending ones with websites
  WITH updated AS (
    UPDATE practitioners
    SET 
      enrichment_status = 'pending',
      enrichment_queued_at = NOW()
    WHERE 
      id = ANY(practitioner_ids)
      AND website IS NOT NULL
      AND enrichment_status NOT IN ('completed', 'in_progress')
    RETURNING id
  )
  SELECT COUNT(*)::INTEGER INTO v_queued FROM updated;
  
  RETURN QUERY SELECT v_queued, v_enriched, v_no_website;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION queue_practitioners_for_enrichment(UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION queue_practitioners_for_enrichment(UUID[]) TO service_role;

COMMENT ON FUNCTION queue_practitioners_for_enrichment(UUID[]) IS 'Batch queue practitioners for enrichment with validation counts';
