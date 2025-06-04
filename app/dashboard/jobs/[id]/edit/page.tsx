'use client';

import { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import JobForm from '@/components/forms/JobForm';
import { JobEntity } from '@/domains/job/domain/entities';
import { Location, JobType } from '@/domains/job/domain/value-objects';
import { mapToJobDto } from '@/domains/job/application/dtos';

interface Props {
  params: { id: string };
}

export default function EditJobPage({ params }: Props) {
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { id } = params;
  
  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        
        // Check authentication status
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        // Set user ID either from session or use a demo ID
        const currentUserId = session?.user?.id || 'demo-user-id';
        setUserId(currentUserId);
        
        // Fetch the job data
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error || !data) {
          console.error('Error fetching job:', error);
          setError("This job doesn't exist or you don't have permission to edit it.");
          return;
        }
        
        // Check if user owns this job (for authenticated users only)
        if (session && data.user_id !== session.user.id) {
          setError("You don't have permission to edit this job.");
          return;
        }
        
        // Convert database record to domain entity
        const jobEntity = new JobEntity({
          id: data.id,
          title: data.title,
          company: data.company,
          description: data.description,
          salary: data.salary,
          location: new Location({
            city: data.location?.city,
            country: data.location?.country,
            isRemote: data.location?.isRemote ?? false,
          }),
          type: data.type as JobType,
          applyUrl: data.apply_url,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          userId: data.user_id,
        });
        
        // Map entity to DTO for presentation
        const jobDto = mapToJobDto(jobEntity);
        setJob(jobDto);
      } catch (err) {
        console.error('Error loading job:', err);
        setError('An error occurred while loading the job. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadJob();
  }, [id]);
  
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading job details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-6">
          <h1 className="text-xl font-medium text-red-800 dark:text-red-500">Error</h1>
          <p className="mt-2 text-red-700 dark:text-red-400">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-6">
          <h1 className="text-xl font-medium text-yellow-800 dark:text-yellow-500">Job Not Found</h1>
          <p className="mt-2 text-yellow-700 dark:text-yellow-400">
            The job you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                You are viewing in demo mode. To save changes, please <a href="/auth/login" className="font-medium underline text-yellow-700 hover:text-yellow-600">log in</a> first.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Job
      </h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {userId && job && (
          <JobForm
            initialData={job}
            userId={job.userId || userId}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
} 