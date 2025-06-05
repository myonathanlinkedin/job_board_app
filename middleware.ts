import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from './lib/logger';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const requestUrl = request.nextUrl;

  // Skip middleware for specific paths that should never be protected
  const publicPaths = [
    '/_next', // Next.js assets
    '/api/', // API routes
    '/static', // Static files
    '/images', // Image files
    '/favicon.ico', // Favicon
    '/debug', // Debug routes
    '/.well-known/', // Well-known URLs (used by browsers)
    '/manifest.json', // PWA manifest
    '/', // Homepage is public
    '/jobs' // Jobs listing is public
  ];
  
  // Refined public path check to handle exact matches and prefixes correctly
  const isPublicPath = publicPaths.some(path => {
      if (path === '/' && pathname === '/') return true;
      if (path === '/jobs' && pathname === '/jobs') return true;
      if (path !== '/' && path !== '/jobs' && pathname.startsWith(path)) return true;
      return false;
  });

  if (isPublicPath) {
    logger.debug('Middleware: Allowing access to public path', { pathname });
    return res;
  }
  
  // Skip middleware for browser DevTools requests
  if (pathname.includes('devtools') || pathname.includes('chrome-extension')) {
    logger.debug('Middleware: Skipping DevTools request', { pathname });
    return res;
  }

  // Check for error parameter in URL - never redirect a URL with error parameter
   if (searchParams.has('error') || searchParams.has('error_code') || searchParams.has('error_description')) {
     logger.debug('Middleware: Error parameter found in URL');
     // Clear redirect counters if landing on an error page to break loops
     const response = NextResponse.next();
     response.cookies.delete('auth_redirect_count');
     response.cookies.delete('prevent_auth_redirect');
     return response;
   }

  // --- Forced Password Reset Redirect Mechanism ---
  // Check for parameters indicative of a Supabase auth flow, especially recovery
  const code = searchParams.get('code');
  const token = searchParams.get('token');
  const type = searchParams.get('type');
  const redirect_to_param = searchParams.get('redirect_to');
  const decodedRedirectTo = redirect_to_param ? decodeURIComponent(redirect_to_param) : null;

  // Define strict conditions for an *initial* recovery flow entry point
  const isInitialRecoveryFlowUrl = 
      (code && type === 'recovery') || 
      (token && type === 'recovery') ||
      (decodedRedirectTo && decodedRedirectTo.includes('type=recovery'));

  // Check for the specific callback path with recovery type
   const isCallbackRecovery = pathname === '/auth/callback' && type === 'recovery';

  // Check for existing password reset flow cookie
  const isPasswordResetFlowCookie = request.cookies.get('password_reset_flow')?.value === 'true';

  // Determine if we should be in a password reset flow
  const isInPasswordResetFlow = isInitialRecoveryFlowUrl || isCallbackRecovery || isPasswordResetFlowCookie;

  if (isInPasswordResetFlow) {
    logger.debug('Middleware: Password recovery flow detected');

    // If the user is already on the change-password page as part of a reset flow, allow access
    if (pathname === '/auth/change-password') {
       logger.debug('Middleware: Allowing access to change-password page');
       // Clear general auth redirect cookies when allowing access to reset page
       const response = NextResponse.next();
       // Aggressively clear general auth redirect cookies that might interfere
       response.cookies.delete('auth_redirect_count');
       response.cookies.delete('prevent_auth_redirect');
       response.cookies.delete('middleware_auth_redirect'); // Clear middleware bypass cookie if set
        // Ensure reset cookies are set if we arrived via a recovery URL, even if already on the page
        if(isInitialRecoveryFlowUrl) {
             response.cookies.set('password_reset_flow', 'true', { maxAge: 600, path: '/', sameSite: 'lax' });
             response.cookies.set('bypass_reset_redirect', 'true', { maxAge: 600, path: '/', sameSite: 'lax' });
        }
       return response;
    }

    // If it's a potential recovery flow URL and not on the change-password page, force redirect
    // Only set cookies and redirect if it's an initial recovery URL, not just based on a stale cookie
    if (isInitialRecoveryFlowUrl) {
         logger.debug('Middleware: Initial recovery flow URL detected');
         const response = NextResponse.redirect(`${requestUrl.origin}/auth/change-password?from=reset` + 
             (code ? `&code=${code}` : '') + 
             (token ? `&token=${token}` : '')
         );

         // Set specific reset flow cookies
         response.cookies.set('password_reset_flow', 'true', { maxAge: 600, path: '/', sameSite: 'lax' });
         response.cookies.set('bypass_reset_redirect', 'true', { maxAge: 600, path: '/', sameSite: 'lax' });

          // Clear general auth redirect counters
          response.cookies.delete('auth_redirect_count');
          response.cookies.delete('prevent_auth_redirect');
          response.cookies.delete('middleware_auth_redirect');

        return response;
    }

    // If we are in the password reset flow based *only* on a cookie (not URL), and not on the change-password page,
    // it might be a stale cookie. Let the general auth flow handle it, and clear the reset cookies.
    logger.debug('Middleware: Stale password reset cookie detected');
    const response = NextResponse.next();
    response.cookies.delete('password_reset_flow');
    response.cookies.delete('bypass_reset_redirect');
    return response;
  }
  // --- End Forced Password Reset Redirect Mechanism ---


  // --- General Authentication Handling ---

  // Attempt to get the session immediately
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  // Check if session exists. Rely on getSession for authoritative check.
  const hasValidSession = !!session;

  logger.debug('Middleware: Auth check', { pathname });

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/jobs/new', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Auth routes - redirect to dashboard if already signed in
  const authRoutes = ['/auth/login', '/auth/signup'];
  const isAuthRoute = authRoutes.some(route => pathname === route);

  // If user has a valid session and is trying to access an auth route
  if (hasValidSession && isAuthRoute) {
    logger.debug('Middleware: Authenticated user accessing auth page');
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    // Explicitly delete all relevant cookies to ensure no lingering state causes redirects
    response.cookies.delete('auth_redirect_count');
    response.cookies.delete('prevent_auth_redirect');
    response.cookies.delete('middleware_auth_redirect');
    response.cookies.delete('password_reset_flow');
    response.cookies.delete('bypass_reset_redirect');
    response.cookies.delete('sb-auth-token'); // Also clear Supabase auth cookie on successful auth page redirect
    response.cookies.delete('supabase-auth-token'); // Legacy Supabase auth cookie

    return response;
  }

  // If user does NOT have a valid session and is trying to access a protected route
  if (!hasValidSession && isProtectedRoute) {
    logger.debug('Middleware: Unauthenticated user accessing protected route');
    console.log('DEBUG: Cookies received:', request.cookies.getAll());
    console.log('DEBUG: Session from Supabase:', session);
    let redirectCount = parseInt(request.cookies.get('auth_redirect_count')?.value || '0', 10);
    logger.debug('Middleware: Redirect count', { count: redirectCount });
    // TEMPORARY: Instead of redirecting, show a debug message and allow access
    return res;
    /*
    // Original redirect logic (commented out for debugging)
    if (redirectCount > 5) {
      console.error('Middleware: Potential redirect loop detected for unauthenticated access. Clearing auth cookies.');
      const response = NextResponse.redirect(new URL(`${requestUrl.origin}/auth/login?error=${encodeURIComponent('Too many redirects. Please try logging in again.')}`));
      response.cookies.delete('sb-auth-token');
      response.cookies.delete('supabase-auth-token');
      response.cookies.delete('auth_redirect_count');
      response.cookies.delete('prevent_auth_redirect');
      response.cookies.delete('middleware_auth_redirect');
      response.cookies.delete('password_reset_flow');
      response.cookies.delete('bypass_reset_redirect');
      return response;
    }
    const redirectUrl = new URL('/auth/login', request.url);
    const excludedFromContinue = ['/auth/login', '/auth/signup', '/auth/callback', '/auth/change-password'];
    if (!excludedFromContinue.includes(pathname)) {
      redirectUrl.searchParams.set('continue', requestUrl.pathname + requestUrl.search);
    }
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('auth_redirect_count', (redirectCount + 1).toString(), {
      maxAge: 60,
      path: '/',
      sameSite: 'lax'
    });
    response.cookies.delete('middleware_auth_redirect');
    console.log('Middleware: Redirecting unauthenticated user to login.');
    return response;
    */
  }
  
  // Clear redirect counter if successfully accessing a protected page after potential redirects
   if (hasValidSession && isProtectedRoute) {
       logger.debug('Middleware: Successfully accessed protected route');
       const response = NextResponse.next();
       response.cookies.delete('auth_redirect_count');
       response.cookies.delete('prevent_auth_redirect');
       response.cookies.delete('middleware_auth_redirect'); 
       return response;
   }

  // Allow the request to proceed if no redirects were issued
  logger.debug('Middleware: No redirect necessary');
  return res;
}

// Only run middleware on these paths, exclude browser-specific paths
export const config = {
  matcher: [
    // Match all paths except static files and browser-specific resources
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.ico|.*\\.woff|.*\\.woff2).*)',
    // Explicitly exclude DevTools paths
    '/((?!\\.well-known/.*|.*\\.json).*)',
  ],
}; 