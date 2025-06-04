'use client';

import { useEffect, useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import Link from 'next/link';

export default function DashboardRedirect() {
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  
  useEffect(() => {
    // Count down before redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Force a browser navigation to dashboard
          window.location.href = '/dashboard';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <Icons.Search className="w-12 h-12 mx-auto animate-spin text-blue-500" />
          <h1 className="text-2xl font-bold mt-6 mb-2">Redirecting to Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You will be redirected to your dashboard in {countdown} seconds...
          </p>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <div className="flex flex-col gap-3 mt-6">
            <a 
              href="/dashboard" 
              className="btn-primary text-center"
            >
              Go to Dashboard Now
            </a>
            
            <Link 
              href="/debug/auth-status"
              className="text-sm text-blue-500 hover:underline"
            >
              Check Auth Status
            </Link>
            
            <Link 
              href="/"
              className="text-sm text-gray-500 hover:underline"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 