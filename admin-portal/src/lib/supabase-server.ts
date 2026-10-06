import { createClient } from '@supabase/supabase-js';

// Server-side admin client — bypasses RLS, only used in API routes
export function createAdminClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhyuvcadypeelveiyooo.supabase.co';
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeXV2Y2FkeXBlZWx2ZWl5b29vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjcwMDY5NywiZXhwIjoyMTAyMjc2Njk3fQ.uetV2CWCXQYCL-g534Ikdr8h2Jf9Ap6UqAz7Qpcc-5w';
  
  const cleanUrl = rawUrl.trim().replace(/^["']|["']$/g, '');
  const cleanKey = rawKey.trim().replace(/^["']|["']$/g, '');

  return createClient(
    cleanUrl,
    cleanKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
