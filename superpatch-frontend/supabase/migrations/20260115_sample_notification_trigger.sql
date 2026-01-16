-- Create function to notify on new sample requests
-- Uses pg_notify to send real-time notifications
CREATE OR REPLACE FUNCTION notify_new_sample_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Send notification via pg_notify channel
  PERFORM pg_notify(
    'new_sample_request',
    json_build_object(
      'id', NEW.id,
      'practitioner_id', NEW.practitioner_id,
      'practitioner_name', NEW.practitioner_name,
      'practitioner_type', NEW.practitioner_type,
      'products', NEW.products,
      'address', NEW.address,
      'email', NEW.email,
      'phone', NEW.phone,
      'status', NEW.status,
      'created_at', NEW.created_at
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on sample_requests table
DROP TRIGGER IF EXISTS trigger_notify_new_sample ON sample_requests;

CREATE TRIGGER trigger_notify_new_sample
  AFTER INSERT ON sample_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_sample_request();

COMMENT ON FUNCTION notify_new_sample_request() IS 'Sends pg_notify when a new sample request is created';
