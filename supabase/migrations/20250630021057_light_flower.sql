-- Update the qr_scans table to make location optional and add a comment
COMMENT ON COLUMN qr_scans.location IS 'Location data - currently not collected for privacy';

-- Update the scan event logging to not require location
-- The application will now pass null for location data

-- Update the scan analytics functions to work without location data
CREATE OR REPLACE FUNCTION get_scan_summary(qr_code_uuid uuid)
RETURNS TABLE(
  total_scans bigint,
  today_scans bigint,
  week_scans bigint,
  month_scans bigint,
  unique_sessions bigint
) AS $$
BEGIN
  -- Ensure we're only getting analytics for tracked QR codes
  IF NOT EXISTS (
    SELECT 1 FROM qr_codes 
    WHERE id = qr_code_uuid AND is_tracked = true
  ) THEN
    RETURN QUERY SELECT 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*) AS total_scans,
    COUNT(*) FILTER (WHERE scanned_at >= CURRENT_DATE) AS today_scans,
    COUNT(*) FILTER (WHERE scanned_at >= CURRENT_DATE - INTERVAL '7 days') AS week_scans,
    COUNT(*) FILTER (WHERE scanned_at >= CURRENT_DATE - INTERVAL '30 days') AS month_scans,
    COUNT(DISTINCT session_id) AS unique_sessions
  FROM qr_scans
  WHERE qr_code_id = qr_code_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a privacy-focused comment to the qr_scans table
COMMENT ON TABLE qr_scans IS 'QR code scan events - location data is not collected for user privacy';

-- Update RLS policy for qr_scans to ensure privacy
DROP POLICY IF EXISTS "Allow public scan logging" ON qr_scans;
CREATE POLICY "Allow public scan logging"
  ON qr_scans
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure users can only read their own QR scan data
DROP POLICY IF EXISTS "Users can read own QR scan data" ON qr_scans;
CREATE POLICY "Users can read own QR scan data"
  ON qr_scans
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM qr_codes 
      WHERE qr_codes.id = qr_scans.qr_code_id 
      AND qr_codes.user_id = auth.uid()
    )
  );