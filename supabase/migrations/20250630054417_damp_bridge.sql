-- Fix the create_tracked_qr_code function to use the correct domain
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
  
  -- Generate tracking URL using the main domain (not subdomain)
  v_tracking_url := 'https://qrnexus.site/track/' || v_tracked_id || '?redirect=' || encode(p_content::bytea, 'escape');
  
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

-- Update existing tracking URLs to use the correct domain
UPDATE qr_codes 
SET tracking_url = REPLACE(tracking_url, 'https://track.qrnexus.site/', 'https://qrnexus.site/')
WHERE tracking_url LIKE 'https://track.qrnexus.site/%';