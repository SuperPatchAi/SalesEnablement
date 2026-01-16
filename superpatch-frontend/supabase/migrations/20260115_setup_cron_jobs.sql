-- pg_cron jobs for automated task processing
-- Note: These are already applied via Supabase MCP

-- 1. Process retry queue every 15 minutes during business hours (8am-6pm EST, Mon-Fri)
-- Cron uses UTC, so 8am-6pm EST = 13:00-23:00 UTC
SELECT cron.schedule(
  'process-retry-queue',
  '*/15 13-23 * * 1-5',
  $$
  SELECT
    net.http_post(
      url := 'https://gdwwppwaxyvudsecexuq.supabase.co/functions/v1/process-retry-queue',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
      ),
      body := jsonb_build_object('source', 'pg_cron', 'scheduled', true)
    ) AS request_id;
  $$
);

-- 2. Process enrichment queue every 30 minutes
SELECT cron.schedule(
  'process-enrichment-queue',
  '*/30 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://gdwwppwaxyvudsecexuq.supabase.co/functions/v1/enrich-practitioners',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
      ),
      body := jsonb_build_object('source', 'pg_cron', 'scheduled', true)
    ) AS request_id;
  $$
);

-- 3. Cleanup stale enrichment jobs daily at 2am UTC
-- Resets any enrichment stuck in 'in_progress' for more than 1 hour
SELECT cron.schedule(
  'cleanup-stale-enrichment',
  '0 2 * * *',
  $$
  UPDATE practitioners 
  SET 
    enrichment_status = 'pending',
    updated_at = NOW()
  WHERE 
    enrichment_status = 'in_progress' 
    AND updated_at < NOW() - INTERVAL '1 hour';
  $$
);
