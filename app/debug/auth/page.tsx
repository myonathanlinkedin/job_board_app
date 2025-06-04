'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import * as auth from '@/lib/auth-client';

export default function AuthDebugPage() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookies] = useState<any>({});

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        
        // Get session using our helper
        const sessionData = await auth.getSession();
        setSession(sessionData);
        
        // Get user using our helper
        const userData = await auth.getUser();
        setUser(userData);
        
        // Check cookies
        const allCookies = document.cookie.split(';')
          .map(cookie => cookie.trim().split('='))
          .reduce((acc, [key, value]) => {
            if (key) acc[key] = `${value?.substring(0, 5)}...`;
            return acc;
          }, {} as Record<string, string>);
        
        setCookies(allCookies);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);
  
  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.user);
      setMessage('Session refreshed successfully');
    } catch (err: any) {
      setError(`Error refreshing session: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const formatJSON = (data: any) => {
    if (!data) return "null";
    try {
      // For tokens, truncate the middle to avoid displaying too much data
      const processed = JSON.parse(JSON.stringify(data));
      
      // Truncate access token if present
      if (processed.access_token) {
        processed.access_token = `${processed.access_token.substring(0, 10)}...${processed.access_token.substring(processed.access_token.length - 10)}`;
      }
      
      // Truncate refresh token if present
      if (processed.refresh_token) {
        processed.refresh_token = `${processed.refresh_token.substring(0, 5)}...`;
      }
      
      return JSON.stringify(processed, null, 2);
    } catch (e) {
      return String(data);
    }
  };
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Auth Debugging</h1>
      
      {loading && <div className="mb-4">Loading auth state...</div>}
      
      {error && (
        <div className="p-4 mb-6 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900/30 rounded">
          {error}
        </div>
      )}
      
      {message && (
        <div className="p-4 mb-6 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-900/30 rounded">
          {message}
        </div>
      )}
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={refreshSession}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Refresh Session
        </button>
        
        <Link 
          href="/auth/login"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Go to Login
        </Link>
        
        <Link 
          href="/dashboard"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Try Dashboard
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4">Session</h2>
          <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded overflow-auto text-sm max-h-96">
            {formatJSON(session)}
          </pre>
        </div>
        
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4">User</h2>
          <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded overflow-auto text-sm max-h-96">
            {formatJSON(user)}
          </pre>
        </div>
        
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Cookies</h2>
          <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded overflow-auto text-sm">
            {formatJSON(cookies)}
          </pre>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Common Issues</h2>
        
        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="font-medium">Missing session:</span> If session is null but user shows data, try refreshing the session.
          </li>
          <li>
            <span className="font-medium">CORS issues:</span> Check that your Supabase project's URL configuration is set up correctly.
          </li>
          <li>
            <span className="font-medium">Cookie problems:</span> Ensure cookies are not being blocked by browser privacy settings.
          </li>
          <li>
            <span className="font-medium">Missing middleware:</span> The Next.js middleware needs to be configured correctly to manage Supabase auth.
          </li>
          <li>
            <span className="font-medium">Missing redirect URL:</span> Email confirmation needs the right redirect URL in Supabase settings.
          </li>
        </ul>
      </div>
    </div>
  );
} 