-- Add confirmation tracking columns to sample_requests
-- These track whether a confirmation email has been sent

ALTER TABLE sample_requests ADD COLUMN IF NOT EXISTS confirmation_sent BOOLEAN DEFAULT false;
ALTER TABLE sample_requests ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN sample_requests.confirmation_sent IS 'Whether a confirmation email has been sent';
COMMENT ON COLUMN sample_requests.confirmation_sent_at IS 'Timestamp when confirmation email was sent';
