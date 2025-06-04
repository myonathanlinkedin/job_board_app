import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize the Supabase client with persistent session storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'job-board-auth-token',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    debug: true, // Enable debug logging for auth
  }
});

// Add auth state change listener for debugging
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Supabase auth event:', event, session);
  });
} 