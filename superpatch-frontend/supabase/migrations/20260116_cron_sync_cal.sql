-- Schedule Cal.com booking sync every 15 minutes
-- This keeps appointment status in sync with Cal.com
SELECT cron.schedule(
  'sync-cal-bookings',
  '*/15 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://gdwwppwaxyvudsecexuq.supabase.co/functions/v1/sync-cal-bookings',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
      ),
      body := jsonb_build_object('source', 'pg_cron', 'scheduled', true)
    ) AS request_id;
  $$
);
