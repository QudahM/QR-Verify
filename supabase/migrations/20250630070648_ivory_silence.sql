-- Fix the create_tracked_qr_code function to use proper URL encoding
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
  v_base_url text;
BEGIN
  -- Generate IDs
  v_tracked_id := gen_random_uuid();
  v_original_id := gen_random_uuid();
  
  -- Use the current domain for tracking URLs
  v_base_url := 'https://qrnexus.site';
  
  -- Generate tracking URL with proper encoding
  -- The content will be URL encoded by the frontend
  v_tracking_url := v_base_url || '/track/' || v_tracked_id || '?redirect=' || 
    replace(
      replace(
        replace(
          replace(
            replace(p_content, '%', '%25'),
            '&', '%26'
          ),
          '?', '%3F'
        ),
        '#', '%23'
      ),
      ' ', '%20'
    );
  
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
    scan_count,
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
    CASE WHEN p_type = 'url' THEN true ELSE false END, -- Only track URLs
    0,
    now(),
    now()
  );
  
  RETURN QUERY SELECT v_tracked_id, v_original_id, v_tracking_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up any existing QR codes with invalid tracking URLs
UPDATE qr_codes 
SET 
  tracking_url = 'https://qrnexus.site/track/' || id || '?redirect=' || 
    replace(
      replace(
        replace(
          replace(
            replace(content, '%', '%25'),
            '&', '%26'
          ),
          '?', '%3F'
        ),
        '#', '%23'
      ),
      ' ', '%20'
    ),
  is_tracked = (type = 'url')
WHERE type = 'url' 
AND (tracking_url IS NULL OR tracking_url NOT LIKE 'https://qrnexus.site/track/%');

-- Ensure text QR codes are not tracked
UPDATE qr_codes 
SET 
  tracking_url = NULL,
  is_tracked = false
WHERE type = 'text';

-- Add a function to get QR code for tracking page
CREATE OR REPLACE FUNCTION get_qr_code_for_tracking(p_qr_id text)
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
DECLARE
  v_qr_uuid uuid;
BEGIN
  -- Try to parse the input as UUID
  BEGIN
    v_qr_uuid := p_qr_id::uuid;
  EXCEPTION WHEN invalid_text_representation THEN
    -- If it's not a valid UUID, return nothing
    RETURN;
  END;
  
  -- Look for QR code by tracked ID first
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
  WHERE qr.id = v_qr_uuid
  LIMIT 1;
  
  -- If not found by tracked ID, try original ID
  IF NOT FOUND THEN
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
    WHERE qr.original_qr_id = v_qr_uuid
    LIMIT 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;