import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize the Supabase client for client-side operations
// Use createBrowserClient from @supabase/ssr
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      // createBrowserClient uses cookies by default, no need to specify storage
      // persistSession: true is the default
      // detectSessionInUrl: true is the default
      autoRefreshToken: true,
      debug: true, // Keep debug logging for auth
    }
  }
);

// Remove the old auth state change listener here, will be handled by hooks or components
// if (typeof window !== 'undefined') {
//   supabase.auth.onAuthStateChange((event, session) => {
//     console.log('Supabase auth event:', event, session);
//   });
// }
