import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import DashboardJobsTable from './DashboardJobsTable';

export const metadata = {
  title: 'Dashboard | Job Board App',
  description: 'Manage your job postings',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  // Redirect if not authenticated
  if (!user) {
    redirect('/auth/login');
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <a href="/dashboard/jobs/new" className="btn-primary">
          Post a New Job
        </a>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Job Listings</h2>
        <DashboardJobsTable userId={user.id} />
      </div>
    </div>
  );
} 