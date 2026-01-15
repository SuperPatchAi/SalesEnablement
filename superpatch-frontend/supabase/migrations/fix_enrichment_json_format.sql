-- Fix Enrichment JSON Format Migration
-- Problem: 10,485 records have enrichment stored as escaped JSON strings instead of proper JSONB
-- Solution: Parse the escaped strings back into proper JSONB objects

-- First, let's see how many records need fixing (records where enrichment starts with a quote)
-- SELECT COUNT(*) FROM practitioners WHERE enrichment IS NOT NULL AND enrichment::text LIKE '"{%';

-- Create a function to safely parse the double-escaped JSON
CREATE OR REPLACE FUNCTION fix_escaped_json(input_jsonb JSONB)
RETURNS JSONB AS $$
DECLARE
    text_value TEXT;
    result JSONB;
BEGIN
    -- Check if the value is a string (starts with quote when cast to text)
    text_value := input_jsonb::text;
    
    -- If it starts with a quote and contains escaped JSON, parse it
    IF text_value LIKE '"{%' OR text_value LIKE '"{\%' THEN
        -- Remove outer quotes and unescape
        text_value := input_jsonb #>> '{}';  -- Extract as text
        
        -- Try to parse as JSON
        BEGIN
            result := text_value::jsonb;
            RETURN result;
        EXCEPTION WHEN OTHERS THEN
            -- If parsing fails, return original
            RETURN input_jsonb;
        END;
    ELSE
        -- Already proper JSON, return as-is
        RETURN input_jsonb;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Count records that need fixing (for logging)
DO $$
DECLARE
    count_to_fix INTEGER;
BEGIN
    SELECT COUNT(*) INTO count_to_fix 
    FROM practitioners 
    WHERE enrichment IS NOT NULL 
    AND enrichment::text LIKE '"{%';
    
    RAISE NOTICE 'Records to fix: %', count_to_fix;
END $$;

-- Apply the fix to all affected records
UPDATE practitioners
SET enrichment = fix_escaped_json(enrichment)
WHERE enrichment IS NOT NULL
AND enrichment::text LIKE '"{%';

-- Verify the fix worked - count records with proper JSON structure now
DO $$
DECLARE
    fixed_count INTEGER;
    with_practitioners INTEGER;
    with_emails INTEGER;
    with_services INTEGER;
BEGIN
    -- Count records with proper data structure
    SELECT 
        COUNT(*),
        COUNT(CASE WHEN enrichment->'data'->'practitioners' IS NOT NULL 
                   AND jsonb_array_length(enrichment->'data'->'practitioners') > 0 THEN 1 END),
        COUNT(CASE WHEN enrichment->'data'->'emails' IS NOT NULL 
                   AND jsonb_array_length(enrichment->'data'->'emails') > 0 THEN 1 END),
        COUNT(CASE WHEN enrichment->'data'->'services' IS NOT NULL 
                   AND jsonb_array_length(enrichment->'data'->'services') > 0 THEN 1 END)
    INTO fixed_count, with_practitioners, with_emails, with_services
    FROM practitioners
    WHERE enrichment IS NOT NULL
    AND enrichment_status IN ('success', 'enriched');
    
    RAISE NOTICE 'Fixed records with enrichment: %', fixed_count;
    RAISE NOTICE 'Records with practitioner data: %', with_practitioners;
    RAISE NOTICE 'Records with email data: %', with_emails;
    RAISE NOTICE 'Records with services data: %', with_services;
END $$;

-- Clean up the function (optional - keep it for future use)
-- DROP FUNCTION IF EXISTS fix_escaped_json(JSONB);

-- Add a comment to track this migration
COMMENT ON COLUMN practitioners.enrichment IS 'JSONB enrichment data from Firecrawl. Fixed double-escaped strings on 2026-01-14.';
