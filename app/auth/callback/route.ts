import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  
  // Check for errors in URL - access_denied with otp_expired is a common error
  // Note: We can't directly access URL hash fragment (#) in server side, but we might see it in referrer
  const referer = request.headers.get('referer') || '';
  const hasError = referer.includes('error=') || referer.includes('#error=');
  
  if (hasError) {
    console.error('Auth callback error detected in referrer:', referer);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent('Password reset link is invalid or has expired. Please request a new one.')}`
    );
  }
  
  console.log('Auth callback received:', { type, hasCode: !!code });

  // Handle recovery type (password reset) separately
  if (type === 'recovery' && code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      console.log('Processing password recovery flow with code');
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error during recovery code exchange:', error);
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=${encodeURIComponent('Failed to process reset link. Please request a new one.')}`
        );
      }
      
      // Successful code exchange for password reset - redirect to reset page
      // Add 'from=reset' to indicate this is from a password reset flow
      console.log('Successfully exchanged password reset code for session, redirecting to reset password page');
      
      // Set strong bypass cookies to ensure we reach the reset password page
      const response = NextResponse.redirect(`${requestUrl.origin}/auth/change-password?from=reset`);
      
      // Set a cookie to indicate this is a reset flow
      response.cookies.set('password_reset_flow', 'true', {
        maxAge: 600, // 10 minutes
        path: '/',
        sameSite: 'lax'
      });
      
      // Set bypass cookies to prevent redirects by middleware
      response.cookies.set('bypass_reset_redirect', 'true', {
        maxAge: 600, // 10 minutes
        path: '/',
        sameSite: 'lax'
      });
      
      // Prevent redirect loops
      response.cookies.set('prevent_auth_redirect', 'true', {
        maxAge: 600, // 10 minutes
        path: '/',
        sameSite: 'lax'
      });
      
      // Log the redirection for debugging
      console.log('Redirecting to reset password page with bypass cookies set');
      
      // Store the user's email in session for the reset password page to use if needed
      try {
        const user = await supabase.auth.getUser();
        if (user?.data?.user?.email) {
          response.cookies.set('reset_user_email', user.data.user.email, {
            maxAge: 600, // 10 minutes
            path: '/',
            sameSite: 'lax'
          });
        }
      } catch (e) {
        console.error('Error getting user email:', e);
      }
      
      return response;
      
    } catch (error) {
      console.error('Exception during recovery flow:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent('An unexpected error occurred. Please try again.')}`
      );
    }
  }
  
  // Handle all other auth types (login, signup)
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        throw error;
      }
      
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent('Failed to sign in. Please try again.')}`
      );
    }
  }

  // Default redirect to dashboard for successful regular auth flows
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
} 