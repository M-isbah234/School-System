import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://mhyuvcadypeelveiyooo.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeXV2Y2FkeXBlZWx2ZWl5b29vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjcwMDY5NywiZXhwIjoyMTAyMjc2Njk3fQ.uetV2CWCXQYCL-g534Ikdr8h2Jf9Ap6UqAz7Qpcc-5w';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

const cleanUrl = rawUrl.trim().replace(/^["']|["']$/g, '');
const cleanKey = rawKey.trim().replace(/^["']|["']$/g, '');

const supabaseUrl = (cleanUrl && cleanUrl.startsWith('http')) ? cleanUrl : defaultUrl;
const supabaseAnonKey = cleanKey || defaultAnonKey;

// Browser client — uses anon key, respects Row Level Security
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
