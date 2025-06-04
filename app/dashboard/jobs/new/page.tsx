import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import JobForm from '@/components/forms/JobForm';

export const metadata = {
  title: 'Post a Job | Job Board App',
  description: 'Create a new job posting',
};

export default async function NewJobPage() {
  const user = await getCurrentUser();
  
  // Redirect if not authenticated
  if (!user) {
    redirect('/auth/login');
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Post a New Job
      </h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <JobForm userId={user.id} />
      </div>
    </div>
  );
} 