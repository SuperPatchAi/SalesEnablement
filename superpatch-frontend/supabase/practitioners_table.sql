-- Practitioners Table Schema
-- Run this in Supabase SQL Editor to create the practitioners table

-- Enable trigram extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Practitioners table (main practitioner data)
CREATE TABLE IF NOT EXISTS practitioners (
  id TEXT PRIMARY KEY,  -- Use existing ID from JSON data
  name TEXT NOT NULL,
  practitioner_type TEXT NOT NULL,
  address TEXT,
  city TEXT,
  province TEXT,
  phone TEXT,
  website TEXT,
  rating DECIMAL(2,1),
  review_count INTEGER,
  business_status TEXT,
  google_maps_uri TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  scraped_at TIMESTAMPTZ,
  notes TEXT,
  
  -- Enrichment data (JSONB for flexibility)
  enrichment JSONB,
  enrichment_status TEXT DEFAULT 'pending',
  enriched_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_practitioners_province ON practitioners(province);
CREATE INDEX IF NOT EXISTS idx_practitioners_city ON practitioners(city);
CREATE INDEX IF NOT EXISTS idx_practitioners_type ON practitioners(practitioner_type);
CREATE INDEX IF NOT EXISTS idx_practitioners_phone ON practitioners(phone);
CREATE INDEX IF NOT EXISTS idx_practitioners_rating ON practitioners(rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_practitioners_enrichment_status ON practitioners(enrichment_status);

-- Full-text search indexes (requires pg_trgm extension)
CREATE INDEX IF NOT EXISTS idx_practitioners_name_trgm ON practitioners USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_practitioners_address_trgm ON practitioners USING gin(address gin_trgm_ops);

-- Enable Row Level Security
ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;

-- Allow all operations (no auth yet)
DROP POLICY IF EXISTS "Allow all operations on practitioners" ON practitioners;
CREATE POLICY "Allow all operations on practitioners" ON practitioners FOR ALL USING (true);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS practitioners_updated_at ON practitioners;
CREATE TRIGGER practitioners_updated_at
  BEFORE UPDATE ON practitioners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Grant permissions
GRANT ALL ON practitioners TO anon;
GRANT ALL ON practitioners TO authenticated;
GRANT ALL ON practitioners TO service_role;
