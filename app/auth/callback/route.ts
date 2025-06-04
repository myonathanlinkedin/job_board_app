import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  const redirectTo = requestUrl.searchParams.get('redirect_to');
  const token = requestUrl.searchParams.get('token');

  console.log('CALLBACK DEBUG: Start processing callback request.');
  console.log('CALLBACK DEBUG: Raw URL:', request.url);
  console.log('CALLBACK DEBUG: Parsed searchParams:', { code, type, redirectTo, token });

  // Decode redirect_to if present
  const decodedRedirectTo = redirectTo ? decodeURIComponent(redirectTo) : null;

  console.log('Auth callback received:', {
    type,
    hasCode: !!code,
    hasToken: !!token,
    redirectTo: decodedRedirectTo,
    fullUrl: request.url
  });

  // Check for errors from Supabase
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  if (error || errorDescription) {
    console.error('Error in auth callback:', error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(errorDescription || error || 'An unknown authentication error occurred.')}`
    );
  }

  // Handle auth types with code exchange and recovery flow
  if (code || (type === 'recovery' && token)) {
    console.log('CALLBACK DEBUG: Condition for code or recovery token met. Proceeding with session processing.');
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      console.log('Processing auth callback with code or recovery token', { hasCode: !!code, hasToken: !!token, type });

      // Attempt to get session. Supabase client should process URL parameters (code, token, type)
      // to establish a session internally if valid.
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error getting session in callback:', sessionError);
        // Redirect to login with a specific error indicating session processing failed
         return NextResponse.redirect(
           `${requestUrl.origin}/auth/login?error=${encodeURIComponent('Failed to process authentication link. Please try again.') + (sessionError.message ? ' Error: ' + sessionError.message : '')}`
         );
      }

      // Determine if this was initiated by a password recovery link based on original URL params
       const cameFromRecoveryLink = type === 'recovery' || (decodedRedirectTo && decodedRedirectTo.includes('type=recovery'));

      // If a session is successfully established AND it came from a recovery link
      if (session && cameFromRecoveryLink) {
         console.log('Successfully processed recovery link, session established. Redirecting to change password page.');

         // Set cookies to indicate reset flow and bypass middleware redirects
         const response = NextResponse.redirect(`${requestUrl.origin}/auth/change-password?from=reset`);

         response.cookies.set('password_reset_flow', 'true', { maxAge: 600, path: '/', sameSite: 'lax' });
         response.cookies.set('bypass_reset_redirect', 'true', { maxAge: 600, path: '/', sameSite: 'lax' });

         // Clear general auth redirect counters on successful flow
         response.cookies.delete('auth_redirect_count');
         response.cookies.delete('prevent_auth_redirect');
         response.cookies.delete('middleware_auth_redirect');

         return response;

      } else if (session && !cameFromRecoveryLink) {
          // If a session is established but it's NOT a recovery link (e.g., normal login/signup callback)
          console.log('Successfully processed general auth callback, session established. Redirecting to dashboard.');
           // Clear password reset cookies on successful general auth
           const response = NextResponse.redirect(`${requestUrl.origin}/dashboard`);
           response.cookies.delete('password_reset_flow');
           response.cookies.delete('bypass_reset_redirect');
           response.cookies.delete('prevent_auth_redirect');
           // Clear general auth redirect counters as user is now authenticated
           response.cookies.delete('auth_redirect_count');
           response.cookies.delete('middleware_auth_redirect');

          return response;

      } else {
          // If no session was established after processing code/token
          console.error('Callback processed code/token but no session established.');
          return NextResponse.redirect(
            `${requestUrl.origin}/auth/login?error=${encodeURIComponent('Authentication failed. Please try logging in again.')}`
          );
      }

    } catch (error: any) {
      console.error('Exception during auth callback processing:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent('An unexpected error occurred during authentication. Please try again. Error: ' + error.message)}`
      );
    }
  }

  // If no code or recognized recovery flow indicator in the initial request
  console.log('CALLBACK DEBUG: Condition for code or recovery token NOT met.');
  console.log('Callback received without necessary parameters.');
  const response = NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent('Invalid authentication link.')}`);
  // Clear potential lingering redirect cookies
  response.cookies.delete('auth_redirect_count');
  response.cookies.delete('prevent_auth_redirect');
  response.cookies.delete('middleware_auth_redirect');
  response.cookies.delete('password_reset_flow');
  response.cookies.delete('bypass_reset_redirect');
  return response;
} 