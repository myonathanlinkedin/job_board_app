'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import * as auth from '@/lib/auth-client';
import { logger } from '../../../lib/logger';

// Create a session storage key for redirect count
const REDIRECT_COUNT_KEY = 'auth_redirect_count';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [authData, setAuthData] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get error and redirect from URL if present
  const redirect = searchParams.get('redirect') || '/dashboard';
  
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, [searchParams]);

  // Check if already logged in
  useEffect(() => {
    async function checkAuth() {
      try {
        // On initial mount, clear any existing redirect loops
        if (typeof window !== 'undefined') {
          // If we're already at the login page with an error param, don't redirect
          const url = new URL(window.location.href);
          if (url.searchParams.has('error')) {
            logger.debug('Error parameter detected in URL');
            sessionStorage.removeItem(REDIRECT_COUNT_KEY);
            return;
          }
          
          // Check for loop detection parameter
          const preventRedirect = sessionStorage.getItem('prevent_auth_redirect');
          if (preventRedirect === 'true') {
            logger.debug('Redirect prevention active');
            sessionStorage.removeItem(REDIRECT_COUNT_KEY);
            sessionStorage.removeItem('prevent_auth_redirect');
            return;
          }
        }
        
        // Get current redirect count from session storage
        let redirectCount = 0;
        if (typeof window !== 'undefined') {
          const storedCount = sessionStorage.getItem(REDIRECT_COUNT_KEY);
          redirectCount = storedCount ? parseInt(storedCount, 10) : 0;
          
          // If we've redirected too many times, stop to prevent infinite loops
          if (redirectCount > 3) {
            console.error('Too many redirects detected - breaking potential infinite loop');
            sessionStorage.removeItem(REDIRECT_COUNT_KEY);
            sessionStorage.setItem('prevent_auth_redirect', 'true');
            setError('Authentication error: too many redirects. Please try again or clear your browser cookies.');
            return;
          }
          
          // Increment the counter for next time
          sessionStorage.setItem(REDIRECT_COUNT_KEY, (redirectCount + 1).toString());
        }
        
        const session = await auth.getSession();
        if (session) {
          logger.debug('User session detected');
          console.log('User already has a session, redirecting to dashboard or requested page');
          
          // Hard navigation to dashboard - most reliable approach
          window.location.href = redirect;
        } else if (redirectCount > 0) {
          // If we've already tried redirecting but have no session, reset the counter
          sessionStorage.removeItem(REDIRECT_COUNT_KEY);
        }
      } catch (err) {
        console.error('Error checking auth state:', err);
        // Clear redirect counter on error
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(REDIRECT_COUNT_KEY);
        }
      }
    }
    
    checkAuth();
  }, [redirect]);

  // Handle redirect after successful authentication
  useEffect(() => {
    // Only run this effect if we have auth data
    if (!authData) return;
    
    const redirectTimer = setTimeout(() => {
      // Set a bypass cookie to avoid immediate redirect back to login
      if (typeof document !== 'undefined') {
        document.cookie = `bypass_auth_check=true;path=/;max-age=3600;SameSite=Lax${
          window.location.protocol === 'https:' ? ';Secure' : ''
        }`;
      }
      
      window.location.href = redirect;
    }, 1500);
    
    return () => clearTimeout(redirectTimer);
  }, [authData, redirect]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Debug info
      logger.info('Login attempt initiated');
      
      // Reset all redirect counters and flags
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(REDIRECT_COUNT_KEY);
        sessionStorage.removeItem('prevent_auth_redirect');
        sessionStorage.removeItem('auth_redirect_from_dashboard');
      }
      
      // Sign in using our helper
      const data = await auth.signIn(email, password, redirect);
      logger.info('Login successful');
      
      if (data?.session) {
        setAuthData({
          session: {
            ...data.session,
            access_token: data.session.access_token.substring(0, 20) + '...',
          },
          user: data.user
        });
        
        // The redirect will be handled by the useEffect above
      }
    } catch (error: any) {
      console.error('Login error details:', error);
      
      // Handle common errors with more user-friendly messages
      if (error.message?.includes('configuration')) {
        setError('The authentication system is not properly set up. Please check server configuration.');
      } else if (error.message?.includes('network')) {
        setError('Network error. Please check your internet connection.');
      } else if (error.message?.includes('Invalid login')) {
        setError('Incorrect email or password.');
      } else {
        setError(error.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  // If auth data exists but we haven't redirected yet, show a loading state
  if (authData) {
    return (
      <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <Icons.Search className="w-10 h-10 mx-auto animate-spin text-blue-500" />
              <h2 className="mt-4 text-xl font-semibold">Login successful!</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Redirecting to dashboard...</p>
              <div className="mt-4">
                <button 
                  onClick={() => {
                    // Set a bypass cookie to avoid immediate redirect back to login
                    if (typeof document !== 'undefined') {
                      document.cookie = `bypass_auth_check=true;path=/;max-age=3600;SameSite=Lax${
                        window.location.protocol === 'https:' ? ';Secure' : ''
                      }`;
                    }
                    window.location.href = redirect;
                  }}
                  className="btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Log in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md p-4 text-sm text-red-600 dark:text-red-400">
                <div className="flex items-center">
                  <Icons.Close className="w-5 h-5 mr-2 shrink-0" />
                  <div>{error}</div>
                </div>
              </div>
            )}
            
            {debugInfo && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-md p-2 text-xs text-blue-600 dark:text-blue-400">
                Debug info: {debugInfo}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label flex justify-between">
                <span>Password</span>
                <Link 
                  href="#" 
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!email) {
                      setError('Please enter your email address first');
                      return;
                    }
                    
                    try {
                      setLoading(true);
                      setError(null);
                      
                      const redirectTo = `${window.location.origin}/auth/callback?type=recovery`;
                      
                      // Use the auth helper to request password reset with required redirect parameter
                      auth.resetPassword(email, redirectTo)
                        .then(() => {
                          if (typeof window !== 'undefined' && window.showToast) {
                            window.showToast({
                              message: `Password reset email sent to ${email}. Please check your inbox.`,
                              type: 'success',
                              duration: 8000
                            });
                          } else {
                            // Fallback to alert if toast is not available
                            alert(`Password reset email sent to ${email}. Please check your inbox.`);
                          }
                        })
                        .catch((err) => {
                          console.error('Error sending reset email:', err);
                          setError(`Failed to send password reset: ${err.message}`);
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    } catch (err: any) {
                      setError(`Error: ${err.message}`);
                      setLoading(false);
                    }
                  }}
                >
                  Forgot password?
                </Link>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center"
                disabled={loading}
              >
                {loading && <Icons.Search className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  New to JobBoard?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/auth/signup"
                className="w-full flex justify-center btn-secondary"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 