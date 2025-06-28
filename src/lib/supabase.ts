import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      qr_codes: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          type: 'text' | 'url';
          qr_data_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          type: 'text' | 'url';
          qr_data_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          type?: 'text' | 'url';
          qr_data_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};