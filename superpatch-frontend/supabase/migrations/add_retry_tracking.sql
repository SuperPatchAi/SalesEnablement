-- Migration: Add retry tracking columns to practitioners table
-- Purpose: Enable smart retry logic for voicemail/failed calls

-- Add retry tracking columns
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS last_call_status TEXT;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS last_call_at TIMESTAMPTZ;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS retry_reason TEXT;

-- Create index for efficient retry queue queries
CREATE INDEX IF NOT EXISTS idx_practitioners_next_retry 
ON practitioners(next_retry_at) 
WHERE next_retry_at IS NOT NULL;

-- Create index for filtering by last call status
CREATE INDEX IF NOT EXISTS idx_practitioners_last_call_status 
ON practitioners(last_call_status);

-- Function to schedule a retry for a practitioner
CREATE OR REPLACE FUNCTION schedule_retry(
  p_practitioner_id UUID,
  p_delay_minutes INTEGER,
  p_reason TEXT
) RETURNS TIMESTAMPTZ AS $$
DECLARE
  v_next_retry TIMESTAMPTZ;
  v_current_count INTEGER;
BEGIN
  -- Get current retry count
  SELECT retry_count INTO v_current_count
  FROM practitioners
  WHERE id = p_practitioner_id;
  
  -- Calculate next retry time
  v_next_retry := NOW() + (p_delay_minutes || ' minutes')::INTERVAL;
  
  -- Update practitioner
  UPDATE practitioners
  SET 
    retry_count = COALESCE(v_current_count, 0) + 1,
    next_retry_at = v_next_retry,
    retry_reason = p_reason,
    updated_at = NOW()
  WHERE id = p_practitioner_id;
  
  RETURN v_next_retry;
END;
$$ LANGUAGE plpgsql;

-- Function to clear retry scheduling (after successful call or manual clear)
CREATE OR REPLACE FUNCTION clear_retry(p_practitioner_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE practitioners
  SET 
    next_retry_at = NULL,
    retry_reason = NULL,
    updated_at = NOW()
  WHERE id = p_practitioner_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get practitioners due for retry
CREATE OR REPLACE FUNCTION get_retry_queue(p_limit INTEGER DEFAULT 50)
RETURNS TABLE(
  id UUID,
  name TEXT,
  phone TEXT,
  practitioner_type TEXT,
  retry_count INTEGER,
  next_retry_at TIMESTAMPTZ,
  retry_reason TEXT,
  city TEXT,
  province TEXT
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
    p.province
  FROM practitioners p
  WHERE 
    p.next_retry_at IS NOT NULL
    AND p.next_retry_at <= NOW()
    AND p.do_not_call = FALSE
    AND p.phone IS NOT NULL
  ORDER BY p.next_retry_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

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
    p.next_retry_at - NOW() AS time_until_retry
  FROM practitioners p
  WHERE 
    p.next_retry_at IS NOT NULL
    AND p.do_not_call = FALSE
    AND p.phone IS NOT NULL
  ORDER BY p.next_retry_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Add comment explaining the retry system
COMMENT ON COLUMN practitioners.retry_count IS 'Number of retry attempts made for this practitioner';
COMMENT ON COLUMN practitioners.next_retry_at IS 'Scheduled time for next retry call (NULL if no retry scheduled)';
COMMENT ON COLUMN practitioners.last_call_status IS 'Status of the last call attempt (voicemail, failed, completed, etc.)';
COMMENT ON COLUMN practitioners.last_call_at IS 'Timestamp of the last call attempt';
COMMENT ON COLUMN practitioners.retry_reason IS 'Reason for retry (voicemail_left, no_answer, call_failed, etc.)';
