-- Migration: Allow Unknown Callers in Call Records
-- Run this in Supabase SQL Editor to enable tracking calls from unknown numbers
-- 
-- This migration:
-- 1. Removes the foreign key constraint (allows practitioner_id values not in practitioners table)
-- 2. Makes practitioner_id nullable (NULL = unknown caller)

-- Remove FK constraint if it exists
ALTER TABLE call_records DROP CONSTRAINT IF EXISTS fk_practitioner;

-- Make practitioner_id nullable for unknown callers
ALTER TABLE call_records ALTER COLUMN practitioner_id DROP NOT NULL;

-- Verify the change
SELECT 
  column_name, 
  is_nullable, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'call_records' 
  AND column_name = 'practitioner_id';

-- Output should show: practitioner_id | YES | text
