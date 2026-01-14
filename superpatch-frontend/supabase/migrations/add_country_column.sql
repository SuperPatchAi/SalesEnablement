-- Add country column to practitioners table
ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS country TEXT;

-- Create index for country filtering
CREATE INDEX IF NOT EXISTS idx_practitioners_country ON practitioners(country);

-- Update existing records: infer country from province/state
-- Canadian provinces
UPDATE practitioners SET country = 'CA' WHERE country IS NULL AND province IN (
  'Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Manitoba',
  'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador',
  'Prince Edward Island', 'Northwest Territories', 'Yukon', 'Nunavut'
);

-- US states (common ones)
UPDATE practitioners SET country = 'US' WHERE country IS NULL AND province IN (
  'California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania',
  'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia',
  'Washington', 'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri',
  'Maryland', 'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama',
  'Louisiana', 'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah', 'Iowa',
  'Nevada', 'Arkansas', 'Mississippi', 'Kansas', 'New Mexico', 'Nebraska',
  'West Virginia', 'Idaho', 'Hawaii', 'New Hampshire', 'Maine', 'Montana',
  'Rhode Island', 'Delaware', 'South Dakota', 'North Dakota', 'Alaska',
  'Vermont', 'Wyoming', 'District of Columbia'
);

-- Also check notes for country info (from Google Maps imports)
UPDATE practitioners SET country = 'US' WHERE country IS NULL AND notes LIKE '%Country: US%';
UPDATE practitioners SET country = 'CA' WHERE country IS NULL AND notes LIKE '%Country: CA%';

-- Default remaining to CA (original Canadian data)
UPDATE practitioners SET country = 'CA' WHERE country IS NULL;

-- Add RPC function to get distinct countries
CREATE OR REPLACE FUNCTION get_distinct_countries()
RETURNS TABLE(country TEXT) AS $$
  SELECT DISTINCT country FROM practitioners WHERE country IS NOT NULL ORDER BY country;
$$ LANGUAGE sql STABLE;
