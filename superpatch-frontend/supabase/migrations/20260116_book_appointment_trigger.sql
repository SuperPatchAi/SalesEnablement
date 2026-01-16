-- Trigger to automatically queue appointment booking when appointment_booked is set
-- Uses pg_net to call the book-appointment edge function

-- Create the trigger function
CREATE OR REPLACE FUNCTION queue_appointment_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when appointment_booked changes to true and booking_id is not set
  IF NEW.appointment_booked = true 
     AND NEW.booking_id IS NULL 
     AND NEW.appointment_time IS NOT NULL
     AND (OLD.appointment_booked IS NULL OR OLD.appointment_booked = false) THEN
    
    -- Call edge function via pg_net
    PERFORM net.http_post(
      url := 'https://gdwwppwaxyvudsecexuq.supabase.co/functions/v1/book-appointment',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
      ),
      body := jsonb_build_object(
        'call_record_id', NEW.id,
        'practitioner_name', NEW.practitioner_name,
        'practitioner_email', NEW.practitioner_email,
        'appointment_time', NEW.appointment_time,
        'phone', NEW.phone,
        'address', NEW.address,
        'practitioner_type', NEW.practitioner_type,
        'summary', NEW.summary
      )
    );
    
    RAISE NOTICE 'Queued appointment booking for call_record %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_queue_appointment_booking ON call_records;

-- Create the trigger
CREATE TRIGGER trigger_queue_appointment_booking
  AFTER INSERT OR UPDATE OF appointment_booked, appointment_time
  ON call_records
  FOR EACH ROW
  EXECUTE FUNCTION queue_appointment_booking();

COMMENT ON FUNCTION queue_appointment_booking() IS 'Automatically calls book-appointment edge function when an appointment is requested';
