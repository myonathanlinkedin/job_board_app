'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import * as auth from '@/lib/auth-client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const router = useRouter();

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
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Debug info
      console.log('Attempting signup with:', { email, fullName });
      
      // Sign up using our helper
      const data = await auth.signUp(email, password, { full_name: fullName });
      console.log('Signup response:', data);

      if (data?.user) {
        console.log('User created successfully:', data.user);
        
        // Some Supabase configurations require email confirmation
        if (data.user.identities?.[0]?.identity_data?.email_verified) {
          // User is verified immediately
          setSuccess(true);
          setDebugInfo('Account created! Redirecting to dashboard...');
          
          setTimeout(() => {
            router.push('/dashboard');
            router.refresh();
          }, 2000);
        } else {
          // Email verification required
          setSuccess(true);
          setDebugInfo('Please check your email for a confirmation link to complete your registration.');
        }
      }
    } catch (error: any) {
      console.error('Signup error details:', error);
      
      // Handle common errors with more user-friendly messages
      if (error.message?.includes('configuration')) {
        setError('The authentication system is not properly set up. Please check server configuration.');
      } else if (error.message?.includes('network')) {
        setError('Network error. Please check your internet connection.');
      } else if (error.message?.includes('already')) {
        setError('This email is already registered. Try logging in instead.');
      } else {
        setError(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-md p-4 text-sm text-green-600 dark:text-green-400 text-center">
              <Icons.User className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Account created successfully!</p>
              {debugInfo && <p className="mt-2 text-xs">{debugInfo}</p>}
              <p className="mt-2">You'll be redirected to the dashboard shortly...</p>
            </div>
          ) : (
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
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                />
              </div>
              
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
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center"
                  disabled={loading}
                >
                  {loading && <Icons.Search className="w-4 h-4 mr-2 animate-spin" />}
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/auth/login"
                className="w-full flex justify-center btn-secondary"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 