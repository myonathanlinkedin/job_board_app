'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        // Check multiple indicators that we're coming from a password reset flow
        const url = new URL(window.location.href);
        const fromResetParam = url.searchParams.has('from') && url.searchParams.get('from') === 'reset';
        const directAccess = url.searchParams.has('direct') && url.searchParams.get('direct') === 'true';
        
        // Check for the reset cookies
        const cookies = document.cookie.split(';');
        const resetCookie = cookies.some(cookie => 
          cookie.trim().startsWith('password_reset_flow=')
        );
        const bypassResetCookie = cookies.some(cookie => 
          cookie.trim().startsWith('bypass_reset_redirect=')
        );
        
        const fromReset = fromResetParam || resetCookie || bypassResetCookie || directAccess;
        
        console.log('Checking auth session, fromReset indicators:', { 
          fromResetParam, 
          resetCookie, 
          bypassResetCookie,
          directAccess
        });

        // Set a stronger bypass cookie just in case
        if (fromReset) {
          document.cookie = `bypass_reset_redirect=true;path=/;max-age=600;SameSite=Lax`;
        }

        const { data, error } = await supabase.auth.getSession();
        console.log('Auth session check:', data, error);
        
        if (error) {
          setError('Password reset session has expired or is invalid. Please try again.');
          setValidSession(false);
          return;
        }
        
        if (data.session) {
          setValidSession(true);
          
          // Important: If any reset flow indicators are present, treat it as a password reset flow
          // regardless of whether the user was already logged in or not
          if (fromReset) {
            console.log('Password reset flow detected');
            setIsChangePassword(false); // Do NOT require old password
          } else {
            // Regular change password flow
            console.log('Regular change password flow detected');
            setIsChangePassword(true);
          }
        } else {
          setError('Please use the reset link from your email to access this page.');
          setValidSession(false);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setError('An error occurred. Please try again.');
        setValidSession(false);
      }
    }
    
    checkSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validSession) {
      setError('Invalid session. Please request a new password reset link.');
      return;
    }
    
    if (password.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Only validate current password if this is a regular change password flow (not from reset link)
      // This is important - from a reset link, we should NOT require the current password
      if (isChangePassword && currentPassword) {
        // First validate the current password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: (await supabase.auth.getUser()).data.user?.email || '',
          password: currentPassword,
        });
        
        if (signInError) {
          setError('Current password is incorrect');
          setLoading(false);
          return;
        }
      } else if (isChangePassword && !currentPassword) {
        // If changing password normally (not from reset link) but no current password provided
        setError('Current password is required');
        setLoading(false);
        return;
      }
      
      console.log('Updating password...');
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      // Show a toast notification if available
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast({
          message: 'Password updated successfully!',
          type: 'success',
          duration: 5000
        });
      }
      
      setMessage('Password updated successfully!');
      
      // Different behavior based on the scenario
      if (isChangePassword) {
        // If changing password while logged in, stay on dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        // If coming from password reset flow, redirect to login
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      }
      
    } catch (error: any) {
      setError(error.message || 'Failed to update password');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (validSession === null) {
    return (
      <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Icons.Search className="w-10 h-10 mx-auto animate-spin text-blue-500" />
            <h2 className="mt-4 text-2xl font-semibold">Verifying your session...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Change your password
        </h2>
        {isChangePassword && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Update your password to keep your account secure
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-md p-4 mb-4 text-sm text-green-600 dark:text-green-400 flex items-start">
              <Icons.Check className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md p-4 mb-4 text-sm text-red-600 dark:text-red-400 flex items-start">
              <Icons.Close className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {validSession ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {isChangePassword && (
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required={isChangePassword}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
              )}

              {!isChangePassword && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-md p-4 mb-4 text-sm text-blue-600 dark:text-blue-400 flex items-start">
                  <Icons.Info className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Set your new password below. You don't need to know your old password.</span>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
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
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full btn-primary flex justify-center items-center"
                  disabled={loading}
                >
                  {loading && <Icons.Search className="w-4 h-4 mr-2 animate-spin" />}
                  {loading ? 'Updating Password...' : 'Change Password'}
                </button>
              </div>
              
              {isChangePassword && (
                <div className="text-center mt-4">
                  <Link 
                    href="/dashboard" 
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Cancel and return to dashboard
                  </Link>
                </div>
              )}
            </form>
          ) : (
            <div className="text-center">
              <div className="mb-4 text-amber-600 dark:text-amber-400">
                <Icons.Warning className="w-10 h-10 mx-auto mb-2" />
                <p>Your reset session is invalid or expired.</p>
              </div>
              <Link 
                href="/auth/login" 
                className="btn-secondary inline-block"
              >
                Return to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 