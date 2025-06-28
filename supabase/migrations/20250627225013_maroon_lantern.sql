/*
  # Create QR codes table

  1. New Tables
    - `qr_codes`
      - `id` (uuid, primary key) - Unique identifier for each QR code
      - `user_id` (uuid, foreign key) - References the authenticated user who created the QR code
      - `content` (text) - The actual content that was encoded in the QR code
      - `type` (text) - Type of content, either 'text' or 'url'
      - `qr_data_url` (text) - Base64 data URL of the generated QR code image
      - `created_at` (timestamptz) - When the QR code was created
      - `updated_at` (timestamptz) - When the QR code was last updated

  2. Security
    - Enable RLS on `qr_codes` table
    - Add policy for authenticated users to read their own QR codes
    - Add policy for authenticated users to insert their own QR codes
    - Add policy for authenticated users to update their own QR codes
    - Add policy for authenticated users to delete their own QR codes

  3. Constraints
    - Check constraint to ensure type is either 'text' or 'url'
    - Foreign key constraint linking user_id to auth.users
*/

-- Create the qr_codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'url')),
  qr_data_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to manage their own QR codes
CREATE POLICY "Users can read own QR codes"
  ON qr_codes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own QR codes"
  ON qr_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own QR codes"
  ON qr_codes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own QR codes"
  ON qr_codes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create an index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);

-- Create an index on created_at for better sorting performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS update_qr_codes_updated_at ON qr_codes;
CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();