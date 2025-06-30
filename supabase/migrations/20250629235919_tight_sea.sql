/*
  # Fix QR Code Tracking System

  1. Database Schema Updates
    - Ensure all tracking columns exist in qr_codes table
    - Create qr_scans table with proper structure
    - Add indexes for performance
    - Create RLS policies for security

  2. Analytics Functions
    - Function to get scan summary statistics
    - Function to get daily scan analytics
    - Trigger to update scan counts automatically

  3. Security
    - Enable RLS on all tables
    - Create appropriate policies for data access
*/

-- Add missing columns to qr_codes table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'tracking_url'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN tracking_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'scan_count'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN scan_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'last_scanned_at'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN last_scanned_at timestamptz;
  END IF;
END $$;

-- Create qr_scans table if it doesn't exist
CREATE TABLE IF NOT EXISTS qr_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id uuid NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
  user_agent text,
  ip_address inet,
  location jsonb,
  referrer text,
  scanned_at timestamptz DEFAULT now(),
  session_id text
);

-- Enable Row Level Security
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can read own QR scan data" ON qr_scans;
DROP POLICY IF EXISTS "Allow public scan logging" ON qr_scans;

-- Create policies for qr_scans
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

CREATE POLICY "Allow public scan logging"
  ON qr_scans
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_code_id ON qr_scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at ON qr_scans(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_scans_session ON qr_scans(session_id);

-- Add indexes for qr_codes table
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);

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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_qr_scan_stats ON qr_scans;

-- Create trigger to automatically update scan stats
CREATE TRIGGER trigger_update_qr_scan_stats
  AFTER INSERT ON qr_scans
  FOR EACH ROW
  EXECUTE FUNCTION update_qr_scan_stats();

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