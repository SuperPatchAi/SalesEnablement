-- Enable pg_net extension for HTTP calls from database
-- Required for pg_cron to call edge functions
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
