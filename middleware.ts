import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  
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
  ];
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return res;
  }
  
  // Skip middleware for browser DevTools requests
  if (pathname.includes('devtools') || pathname.includes('chrome-extension')) {
    return res;
  }

  // Add debug param to see if we should bypass auth for debugging
  const debugBypass = request.nextUrl.searchParams.get('debug_auth') === 'bypass';
  if (debugBypass && pathname.startsWith('/dashboard')) {
    console.log('DEBUG MODE: Bypassing auth check for debugging');
    return res;
  }
  
  // Check for error parameter in URL - never redirect a URL with error parameter
  if (request.nextUrl.searchParams.has('error')) {
    console.log('Error parameter found in URL, bypassing middleware redirect');
    return res;
  }
  
  // Important: Get the auth token from cookies directly
  const supabaseAuthCookie = request.cookies.get('sb-auth-token')?.value || 
                          request.cookies.get('supabase-auth-token')?.value;
  
  // If the user has a direct bypass cookie, allow access to protected routes
  const bypassAuthCheck = request.cookies.get('bypass_auth_check')?.value === 'true';
  if (bypassAuthCheck && pathname.startsWith('/dashboard')) {
    console.log('Auth check bypass cookie found, allowing access to dashboard');
    return res;
  }
  
  // Check for "just logged in" cookie to provide grace period
  const justLoggedIn = request.cookies.get('just_logged_in')?.value === 'true';
  if (justLoggedIn && pathname.startsWith('/dashboard')) {
    console.log('User just logged in, bypassing immediate auth check for grace period');
    
    // Set a cookie to clear the flag after this request
    // This will only allow one "free pass" to the dashboard
    const clearLoginFlag = NextResponse.next();
    clearLoginFlag.cookies.set('just_logged_in', 'false', { 
      maxAge: 0, 
      path: '/' 
    });
    
    // Set a bypass cookie that will last 1 hour to avoid redirect loops
    clearLoginFlag.cookies.set('bypass_auth_check', 'true', {
      maxAge: 3600, // 1 hour
      path: '/',
      sameSite: 'lax'
    });
    
    return clearLoginFlag;
  }
  
  try {
    // Create a Supabase client for the middleware
    const supabase = createMiddlewareClient({ req: request, res });
    
    // Attempt to refresh the session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log('Middleware path:', pathname, 
                'Session exists:', !!session, 
                'Auth cookie exists:', !!supabaseAuthCookie, 
                'Error:', !!error);
    
    if (error) {
      console.error('Error getting session:', error.message);
    }
    
    const hasValidSession = !!session || !!supabaseAuthCookie;
    
    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/jobs/new'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    // Auth routes - redirect to dashboard if already signed in
    const authRoutes = ['/auth/login', '/auth/signup'];
    const isAuthRoute = authRoutes.some(route => pathname === route);
  
    // Handle redirect for authenticated users trying to access auth pages
    if (hasValidSession && isAuthRoute) {
      console.log('User is authenticated, redirecting from auth page to dashboard');
      const redirectUrl = new URL('/dashboard', request.url);
      
      // Set the just_logged_in cookie for the client
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set('just_logged_in', 'true', {
        maxAge: 5,  // 5 seconds
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      
      // Set a bypass cookie that will last 1 hour to avoid redirect loops
      response.cookies.set('bypass_auth_check', 'true', {
        maxAge: 3600, // 1 hour
        path: '/',
        sameSite: 'lax'
      });
      
      return response;
    }
  
    // Redirect unauthenticated users to login if trying to access protected routes
    if (!hasValidSession && isProtectedRoute) {
      console.log('User is not authenticated, redirecting to login');
      // Add a timestamp to prevent browser caching the redirect
      const timestamp = Date.now();
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}&t=${timestamp}`, request.url)
      );
    }
    
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // Don't block the request if middleware fails
    return res;
  }
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