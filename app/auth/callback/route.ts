import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  
  console.log('Auth callback received:', { type, hasCode: !!code });

  // Handle recovery type (password reset) separately
  if (type === 'recovery' && code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error during recovery code exchange:', error);
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=${encodeURIComponent('Failed to process reset link. Please request a new one.')}`
        );
      }
      
      // Successful code exchange for password reset - redirect to reset page
      // Add 'from=reset' to indicate this is from a password reset flow
      console.log('Redirecting to password reset page');
      return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password?from=reset`);
      
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