import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  
  try {
    // Create a Supabase client for the middleware
    const supabase = createMiddlewareClient({ req: request, res });
    
    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession();
    
    console.log('Middleware path:', pathname, 'Session exists:', !!session);
    
    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/profile', '/jobs/new'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    // Auth routes - redirect to dashboard if already signed in
    const authRoutes = ['/auth/login', '/auth/signup'];
    const isAuthRoute = authRoutes.some(route => pathname === route);
  
    // Handle redirect for authenticated users trying to access auth pages
    if (session && isAuthRoute) {
      console.log('User is authenticated, redirecting from auth page to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  
    // Handle redirect for unauthenticated users trying to access protected routes
    if (!session && isProtectedRoute) {
      console.log('User is not authenticated, redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // Don't block the request if middleware fails
    return res;
  }
}

// Only run middleware on these paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
}; 