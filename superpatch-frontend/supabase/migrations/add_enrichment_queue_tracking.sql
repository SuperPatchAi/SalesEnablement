-- Add enrichment queue tracking columns to practitioners table
-- This allows tracking when enrichment was queued and provides better status management

-- Add enrichment_queued_at column to track when enrichment was requested
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS enrichment_queued_at TIMESTAMPTZ;

-- Create index for efficient querying of pending enrichments
CREATE INDEX IF NOT EXISTS idx_practitioners_enrichment_queued ON practitioners(enrichment_queued_at)
WHERE enrichment_status = 'pending' AND website IS NOT NULL;

-- Update enrichment_status to include 'in_progress' state
-- The column already exists with 'pending', 'enriched', 'failed' values
-- Just document that 'in_progress' is now a valid state used by the edge function

-- Create a helper function to queue practitioners for enrichment
CREATE OR REPLACE FUNCTION queue_practitioners_for_enrichment(practitioner_ids TEXT[])
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
  SELECT COUNT(*) INTO v_enriched
  FROM practitioners
  WHERE id = ANY(practitioner_ids) AND enrichment_status = 'enriched';
  
  -- Count those without websites
  SELECT COUNT(*) INTO v_no_website
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
      AND enrichment_status != 'enriched'
    RETURNING id
  )
  SELECT COUNT(*) INTO v_queued FROM updated;
  
  RETURN QUERY SELECT v_queued, v_enriched, v_no_website;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION queue_practitioners_for_enrichment(TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION queue_practitioners_for_enrichment(TEXT[]) TO service_role;
