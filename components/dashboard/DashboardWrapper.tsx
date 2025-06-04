'use client';

import { useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

interface DashboardWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function DashboardWrapper({ 
  children, 
  requireAuth = true 
}: DashboardWrapperProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Cancel authentication check if redirects have been detected in session storage
    if (typeof window !== 'undefined') {
      const preventRedirect = sessionStorage.getItem('prevent_auth_redirect');
      if (preventRedirect === 'true') {
        console.log('Redirect prevention active in DashboardWrapper, bypassing auth check');
        setLoading(false);
        return;
      }

      // Check for bypass auth check cookie
      const cookies = document.cookie.split(';');
      const bypassCookie = cookies.find(cookie => cookie.trim().startsWith('bypass_auth_check='));
      if (bypassCookie && bypassCookie.includes('true')) {
        console.log('Found bypass_auth_check cookie, allowing access to dashboard');
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // Check for just_logged_in cookie to bypass auth check
      const justLoggedInCookie = cookies.find(cookie => cookie.trim().startsWith('just_logged_in='));
      if (justLoggedInCookie && justLoggedInCookie.includes('true')) {
        console.log('Found just_logged_in cookie, bypassing auth check');
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // Check for Supabase auth token directly
      const supabaseAuthCookie = cookies.find(cookie => 
        cookie.trim().startsWith('sb-') && cookie.includes('auth-token')
      );
      if (supabaseAuthCookie) {
        console.log('Found Supabase auth token cookie, proceeding as authenticated');
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }
    }

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Dashboard wrapper auth check:', !!session);
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Auth check error:', error);
        // On error, don't block access - fail open
        if (requireAuth === false) {
          setIsAuthenticated(true);
        }
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [requireAuth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Icons.Search className="w-10 h-10 mx-auto animate-spin text-blue-500" />
          <h2 className="mt-4 text-xl">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && requireAuth) {
    // Set a flag to prevent redirect loops
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth_redirect_from_dashboard', 'true');
    }
    
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                You need to be logged in to access the dashboard. Please <Link href={`/auth/login?redirect=${encodeURIComponent('/dashboard')}`} className="font-medium underline text-yellow-700 dark:text-yellow-300 hover:text-yellow-600">log in</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 