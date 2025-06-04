'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import JobList from '@/components/dashboard/JobList';

interface Job {
  id: string;
  title: string;
  company: string;
  created_at: string;
  [key: string]: any; // Allow other properties
}

// Metadata needs to be in a separate layout.tsx file for client components
// export const metadata = {
//   title: 'Dashboard | Job Board App',
//   description: 'Manage your job postings',
// };

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      
      try {
        // Check authentication status
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        // Get jobs from the current user if authenticated
        if (session?.user) {
          const { data } = await supabase
            .from('jobs')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
          
          setJobs(data || []);
        } else {
          // Just show an empty list if not authenticated
          setJobs([]);
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadJobs();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {!isAuthenticated && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You are viewing the dashboard in demo mode. To create or manage jobs, please <Link href="/auth/login" className="font-medium underline text-yellow-700 hover:text-yellow-600">log in</Link>.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Job Listings</h1>
        <Link 
          href="/dashboard/jobs/new"
          className="btn-primary"
        >
          Post New Job
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your jobs...</p>
        </div>
      ) : (
        <JobList jobs={jobs} isLoading={loading} />
      )}
      
      {!loading && jobs.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 shadow rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No jobs yet</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating a new job listing.</p>
          <div className="mt-6">
            <Link
              href="/dashboard/jobs/new"
              className="btn-primary inline-flex items-center"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Post New Job
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 