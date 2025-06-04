'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { JobDto, mapToJobDto } from '@/domains/job/application/dtos';
import { JobEntity } from '@/domains/job/domain/entities';
import { JobType, Location } from '@/domains/job/domain/value-objects';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardJobsTableProps {
  userId: string;
}

export default function DashboardJobsTable({ userId }: DashboardJobsTableProps) {
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      if (data) {
        const jobEntities = data.map(job => new JobEntity({
          id: job.id,
          title: job.title,
          company: job.company,
          description: job.description,
          salary: job.salary,
          location: new Location({
            city: job.location?.city,
            country: job.location?.country,
            isRemote: job.location?.isRemote ?? false,
          }),
          type: job.type as JobType,
          applyUrl: job.apply_url,
          createdAt: new Date(job.created_at),
          updatedAt: new Date(job.updated_at),
          userId: job.user_id,
        }));
        
        const jobDtos = jobEntities.map(mapToJobDto);
        setJobs(jobDtos);
      }
    } catch (err: any) {
      setError(err?.message || 'Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Refresh the job list
      await fetchJobs();
      
    } catch (err: any) {
      setError(err?.message || 'Error deleting job');
      setLoading(false);
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md p-4 text-red-700 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't posted any jobs yet.</p>
        <Link href="/dashboard/jobs/new" className="btn-primary">
          Post Your First Job
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Job Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Company
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Posted
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {jobs.map(job => (
            <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900 dark:text-white">{job.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-700 dark:text-gray-300">{job.company}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {job.type.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                {job.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {formatDate(job.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Link href={`/jobs/${job.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    View
                  </Link>
                  <Link href={`/dashboard/jobs/${job.id}/edit`} className="text-green-600 dark:text-green-400 hover:underline">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 