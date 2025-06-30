/*
  # Analytics Functions for QR Code Tracking

  1. Functions
    - `get_scan_summary` - Get comprehensive scan analytics for a QR code
    - `get_daily_scan_analytics` - Get daily scan data for charts
    - `update_qr_scan_stats` - Trigger function to update scan counts

  2. Security
    - Functions are marked as SECURITY DEFINER to run with elevated privileges
    - Row Level Security policies ensure users can only access their own data
*/

-- Function to get scan analytics summary
CREATE OR REPLACE FUNCTION get_scan_summary(qr_code_uuid uuid)
RETURNS TABLE(
  total_scans bigint,
  today_scans bigint,
  week_scans bigint,
  month_scans bigint,
  unique_sessions bigint
) AS $$
BEGIN
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

-- Function to get daily scan analytics
CREATE OR REPLACE FUNCTION get_daily_scan_analytics(qr_code_uuid uuid, days_back integer DEFAULT 30)
RETURNS TABLE(
  scan_date date,
  scan_count bigint
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - INTERVAL '1 day' * days_back,
      CURRENT_DATE,
      INTERVAL '1 day'
    )::date AS scan_date
  )
  SELECT 
    ds.scan_date,
    COALESCE(COUNT(qs.id), 0) AS scan_count
  FROM date_series ds
  LEFT JOIN qr_scans qs ON 
    date_trunc('day', qs.scanned_at)::date = ds.scan_date
    AND qs.qr_code_id = qr_code_uuid
  GROUP BY ds.scan_date
  ORDER BY ds.scan_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update scan count and last scanned timestamp
CREATE OR REPLACE FUNCTION update_qr_scan_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE qr_codes 
  SET 
    scan_count = scan_count + 1,
    last_scanned_at = NEW.scanned_at
  WHERE id = NEW.qr_code_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS trigger_update_qr_scan_stats ON qr_scans;
CREATE TRIGGER trigger_update_qr_scan_stats
  AFTER INSERT ON qr_scans
  FOR EACH ROW
  EXECUTE FUNCTION update_qr_scan_stats();