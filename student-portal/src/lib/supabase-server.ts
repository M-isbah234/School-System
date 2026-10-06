import { createClient } from '@supabase/supabase-js';

// Server-side admin client — bypasses RLS, only used in API routes
export function createAdminClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  const cleanUrl = rawUrl.trim().replace(/^["']|["']$/g, '');
  const cleanKey = rawKey.trim().replace(/^["']|["']$/g, '');

  return createClient(
    cleanUrl,
    cleanKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
