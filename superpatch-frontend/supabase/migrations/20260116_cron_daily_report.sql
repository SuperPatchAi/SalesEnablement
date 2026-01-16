-- Schedule daily report generation at 8:00 AM UTC
-- This generates yesterday's report
SELECT cron.schedule(
  'generate-daily-report',
  '0 8 * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://gdwwppwaxyvudsecexuq.supabase.co/functions/v1/generate-daily-report',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
      ),
      body := jsonb_build_object('source', 'pg_cron', 'scheduled', true)
    ) AS request_id;
  $$
);
