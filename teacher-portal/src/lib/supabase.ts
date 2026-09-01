import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://mhyuvcadypeelveiryooo.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeXV2Y2FkeXBlZWx2ZWl5b29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MDA2OTcsImV4cCI6MjEwMjI3NjY5N30.ifUP2PmxvD4VSN1bLj1Up2lCClGVNHFrNHuyf0e3K6s';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'))
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : defaultUrl;

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey;

// Browser client — uses anon key, respects Row Level Security
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

