-- Fix the create_tracked_qr_code function to properly encode URLs
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
  v_encoded_content text;
BEGIN
  -- Generate IDs
  v_tracked_id := gen_random_uuid();
  v_original_id := gen_random_uuid();
  
  -- URL encode the content properly
  v_encoded_content := replace(replace(replace(p_content, '%', '%25'), '&', '%26'), '?', '%3F');
  v_encoded_content := replace(replace(replace(v_encoded_content, '#', '%23'), '=', '%3D'), '+', '%2B');
  v_encoded_content := replace(replace(replace(v_encoded_content, ' ', '%20'), '/', '%2F'), ':', '%3A');
  
  -- Generate tracking URL using the main domain
  v_tracking_url := 'https://qrnexus.site/track/' || v_tracked_id || '?redirect=' || v_encoded_content;
  
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

-- Clean up any existing invalid tracking URLs
UPDATE qr_codes 
SET tracking_url = 'https://qrnexus.site/track/' || id || '?redirect=' || 
  replace(replace(replace(content, '%', '%25'), '&', '%26'), '?', '%3F')
WHERE is_tracked = true 
AND tracking_url IS NOT NULL 
AND tracking_url NOT LIKE 'https://qrnexus.site/track/%';