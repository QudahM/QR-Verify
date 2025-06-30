/*
  # Update QR codes table for dual ID system

  1. Schema Changes
    - Add `original_qr_id` column to store the ID of the simple QR code
    - Keep existing `id` as the tracked QR code ID
    - Add `is_tracked` boolean to distinguish between tracked and untracked QR codes
    - Update constraints and indexes

  2. Data Migration
    - Update existing records to set appropriate flags
    - Ensure data integrity

  3. Functions
    - Update existing functions to work with new schema
*/

-- Add new columns to qr_codes table
ALTER TABLE qr_codes 
ADD COLUMN IF NOT EXISTS original_qr_id uuid DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS is_tracked boolean DEFAULT false;

-- Update existing records to have original_qr_id and set tracking status
UPDATE qr_codes 
SET 
  original_qr_id = gen_random_uuid(),
  is_tracked = (tracking_url IS NOT NULL)
WHERE original_qr_id IS NULL;

-- Make original_qr_id NOT NULL after setting values
ALTER TABLE qr_codes 
ALTER COLUMN original_qr_id SET NOT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_original_qr_id ON qr_codes(original_qr_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_is_tracked ON qr_codes(is_tracked);
CREATE INDEX IF NOT EXISTS idx_qr_codes_tracking_url ON qr_codes(tracking_url) WHERE tracking_url IS NOT NULL;

-- Add constraint to ensure tracked QR codes have tracking URLs
ALTER TABLE qr_codes 
ADD CONSTRAINT check_tracked_has_url 
CHECK (
  (is_tracked = true AND tracking_url IS NOT NULL) OR 
  (is_tracked = false)
);

-- Update the scan stats function to work with tracked QR codes
CREATE OR REPLACE FUNCTION update_qr_scan_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update scan stats for tracked QR codes
  UPDATE qr_codes 
  SET 
    scan_count = scan_count + 1,
    last_scanned_at = NEW.scanned_at,
    updated_at = now()
  WHERE id = NEW.qr_code_id AND is_tracked = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update RLS policies to work with new schema
DROP POLICY IF EXISTS "Users can read own QR codes" ON qr_codes;
CREATE POLICY "Users can read own QR codes"
  ON qr_codes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own QR codes" ON qr_codes;
CREATE POLICY "Users can insert own QR codes"
  ON qr_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own QR codes" ON qr_codes;
CREATE POLICY "Users can update own QR codes"
  ON qr_codes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own QR codes" ON qr_codes;
CREATE POLICY "Users can delete own QR codes"
  ON qr_codes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to create a tracked QR code from an original
CREATE OR REPLACE FUNCTION create_tracked_qr_code(
  p_user_id uuid,
  p_content text,
  p_type text,
  p_original_qr_data_url text
)
RETURNS TABLE(
  tracked_id uuid,
  original_id uuid,
  tracking_url text
) AS $$
DECLARE
  v_tracked_id uuid;
  v_original_id uuid;
  v_tracking_url text;
BEGIN
  -- Generate IDs
  v_tracked_id := gen_random_uuid();
  v_original_id := gen_random_uuid();
  
  -- Generate tracking URL
  v_tracking_url := 'https://track.qrnexus.site/track/' || v_tracked_id || '?redirect=' || encode(p_content::bytea, 'escape');
  
  -- Insert the tracked QR code record
  INSERT INTO qr_codes (
    id,
    user_id,
    content,
    type,
    qr_data_url,
    tracking_url,
    original_qr_id,
    is_tracked,
    created_at,
    updated_at
  ) VALUES (
    v_tracked_id,
    p_user_id,
    p_content,
    p_type,
    p_original_qr_data_url, -- Will be updated with tracked QR code image
    v_tracking_url,
    v_original_id,
    true,
    now(),
    now()
  );
  
  RETURN QUERY SELECT v_tracked_id, v_original_id, v_tracking_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get QR code by either tracked ID or original ID
CREATE OR REPLACE FUNCTION get_qr_code_by_any_id(p_qr_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  content text,
  type text,
  qr_data_url text,
  tracking_url text,
  original_qr_id uuid,
  is_tracked boolean,
  scan_count integer,
  last_scanned_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    qr.id,
    qr.user_id,
    qr.content,
    qr.type,
    qr.qr_data_url,
    qr.tracking_url,
    qr.original_qr_id,
    qr.is_tracked,
    qr.scan_count,
    qr.last_scanned_at,
    qr.created_at,
    qr.updated_at
  FROM qr_codes qr
  WHERE qr.id = p_qr_id OR qr.original_qr_id = p_qr_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the existing analytics functions to work with tracked QR codes only
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

CREATE OR REPLACE FUNCTION get_daily_scan_analytics(qr_code_uuid uuid, days_back integer DEFAULT 30)
RETURNS TABLE(
  scan_date date,
  scan_count bigint
) AS $$
BEGIN
  -- Ensure we're only getting analytics for tracked QR codes
  IF NOT EXISTS (
    SELECT 1 FROM qr_codes 
    WHERE id = qr_code_uuid AND is_tracked = true
  ) THEN
    RETURN;
  END IF;

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