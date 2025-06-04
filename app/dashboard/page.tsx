'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

export const metadata = {
  title: 'Dashboard | Job Board App',
  description: 'Manage your job postings',
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    async function checkUser() {
      try {
        setLoading(true);
        
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        console.log('Dashboard auth check:', { currentUser, error });
        
        if (error || !currentUser) {
          console.log('User not authenticated, redirecting to login');
          router.push('/auth/login');
          return;
        }
        
        setUser(currentUser);
        
        // Fetch user's jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });
        
        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
        } else {
          setJobs(jobsData || []);
        }
      } catch (error) {
        console.error('Error in dashboard initialization:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }
    
    checkUser();
  }, [router]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Icons.Search className="w-10 h-10 mx-auto animate-spin text-blue-500" />
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Link href="/dashboard/jobs/new" className="btn-primary">
          Post a New Job
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Job Listings</h2>
        
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <Icons.Briefcase className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No job listings yet</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Get started by posting your first job listing.</p>
            <div className="mt-6">
              <Link href="/dashboard/jobs/new" className="btn-primary">
                Post a Job
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date Posted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/jobs/${job.id}/edit`} className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                          Edit
                        </Link>
                        <Link href={`/jobs/${job.id}`} className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 