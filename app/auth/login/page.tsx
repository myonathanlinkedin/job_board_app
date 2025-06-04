'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import * as auth from '@/lib/auth-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [authData, setAuthData] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get error from URL if present
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
        const session = await auth.getSession();
        if (session) {
          console.log('User already has a session, redirecting to dashboard');
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Error checking auth state:', err);
      }
    }
    
    checkAuth();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Debug info
      console.log('Attempting login with email:', email);
      
      // Sign in using our helper
      const data = await auth.signIn(email, password);
      console.log('Login successful:', data);
      
      if (data?.session) {
        setAuthData({
          session: {
            ...data.session,
            access_token: data.session.access_token.substring(0, 20) + '...',
          },
          user: data.user
        });
        
        // Use hard navigation instead of client-side routing for proper page reload
        window.location.href = '/dashboard';
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
                <a 
                  href="/dashboard"
                  className="btn-primary inline-block"
                >
                  Go to Dashboard Now
                </a>
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
                <Link href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
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