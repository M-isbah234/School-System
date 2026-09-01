import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://mhyuvcadypeelveiryooo.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeXV2Y2FkeXBlZWx2ZWl5b29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MDA2OTcsImV4cCI6MjEwMjI3NjY5N30.ifUP2PmxvD4VSN1bLj1Up2lCClGVNHFrNHuyf0e3K6s';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

const cleanUrl = rawUrl.trim().replace(/^["']|["']$/g, '');
const cleanKey = rawKey.trim().replace(/^["']|["']$/g, '');

const supabaseUrl = (cleanUrl && cleanUrl.startsWith('http')) ? cleanUrl : defaultUrl;
const supabaseAnonKey = cleanKey || defaultAnonKey;

// Browser client — uses anon key, respects Row Level Security
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
