-- Migration: Add qualification columns to practitioners table
-- Purpose: Store conversation data extracted during Bland.ai calls

-- Contact & Qualification fields
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS contact_role TEXT;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS decision_maker BOOLEAN;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS best_callback_time TEXT;

-- Interest Level fields
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS interest_level TEXT;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS pain_points TEXT;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS current_solutions TEXT;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS objections TEXT;

-- Business Info fields
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS practice_size INTEGER;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS patient_volume TEXT;

-- Next Steps fields
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS follow_up_action TEXT;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS follow_up_date TIMESTAMPTZ;
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS decision_timeline TEXT;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_practitioners_interest_level 
ON practitioners(interest_level) 
WHERE interest_level IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_practitioners_follow_up_date 
ON practitioners(follow_up_date) 
WHERE follow_up_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_practitioners_decision_maker 
ON practitioners(decision_maker) 
WHERE decision_maker = TRUE;

-- Add comments for documentation
COMMENT ON COLUMN practitioners.contact_name IS 'Name of the person spoken to during the call';
COMMENT ON COLUMN practitioners.contact_role IS 'Role: owner, office_manager, receptionist, practitioner, other';
COMMENT ON COLUMN practitioners.contact_email IS 'Email address captured during conversation';
COMMENT ON COLUMN practitioners.decision_maker IS 'Whether the contact is a decision maker';
COMMENT ON COLUMN practitioners.best_callback_time IS 'Preferred time to call back';
COMMENT ON COLUMN practitioners.interest_level IS 'Interest level: high, medium, low, not_interested';
COMMENT ON COLUMN practitioners.pain_points IS 'Pain points mentioned during conversation';
COMMENT ON COLUMN practitioners.current_solutions IS 'Current solutions they use for pain management';
COMMENT ON COLUMN practitioners.objections IS 'Objections or concerns raised';
COMMENT ON COLUMN practitioners.practice_size IS 'Number of practitioners in the practice';
COMMENT ON COLUMN practitioners.patient_volume IS 'Approximate patient volume (e.g., 50-100 per week)';
COMMENT ON COLUMN practitioners.follow_up_action IS 'Agreed follow-up action: send_info, callback, sample, demo, none';
COMMENT ON COLUMN practitioners.follow_up_date IS 'Scheduled follow-up date';
COMMENT ON COLUMN practitioners.decision_timeline IS 'When they expect to make a decision';
