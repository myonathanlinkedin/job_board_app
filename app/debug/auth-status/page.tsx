'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AuthDebugPage() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Get and display raw session data
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          return;
        }
        
        setSession(sessionData.session);
        
        // Get user data directly
        if (sessionData.session) {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("User error:", userError);
            setError(userError.message);
            return;
          }
          
          setUser(userData.user);
        }
      } catch (err: any) {
        console.error("Auth check error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);
  
  function refreshPage() {
    window.location.reload();
  }
  
  function clearAndRedirect() {
    localStorage.clear();
    window.location.href = '/auth/login';
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-lg">Checking authentication status...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      )}
      
      <div className="grid gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="mb-4">
            <span className="mr-2 font-medium">Status:</span>
            {session ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Authenticated
              </span>
            ) : (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                Not Authenticated
              </span>
            )}
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button 
              onClick={refreshPage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Refresh Status
            </button>
            <button 
              onClick={clearAndRedirect}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Clear Auth & Redirect
            </button>
          </div>
        </div>
        
        {session && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Session Info</h2>
            <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify({
                expires_at: session.expires_at,
                token_type: session.token_type,
                access_token: `${session.access_token.substring(0, 20)}...`,
              }, null, 2)}
            </pre>
          </div>
        )}
        
        {user && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User Info</h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium">User ID:</p>
                <p className="text-sm truncate">{user.id}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <p className="font-medium">Name:</p>
                <p className="text-sm">{user.user_metadata?.full_name || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Email Verified:</p>
                <p className="text-sm">
                  {user.email_confirmed_at || user.user_metadata?.email_verified ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md">
              Home
            </Link>
            <Link href="/dashboard" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md">
              Dashboard
            </Link>
            <Link href="/auth/login" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md">
              Login
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md">
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 