import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import JobForm from '@/components/forms/JobForm';
import { JobEntity } from '@/domains/job/domain/entities';
import { Location, JobType } from '@/domains/job/domain/value-objects';
import { mapToJobDto } from '@/domains/job/application/dtos';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const { data } = await supabase
    .from('jobs')
    .select('title')
    .eq('id', params.id)
    .single();

  return {
    title: data ? `Edit ${data.title} | Job Board App` : 'Edit Job | Job Board App',
  };
}

export default async function EditJobPage({ params }: Props) {
  const user = await getCurrentUser();
  
  // Redirect if not authenticated
  if (!user) {
    redirect('/auth/login');
  }
  
  const { id } = params;
  
  // Fetch the job data
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns this job
    .single();
  
  if (error || !data) {
    notFound();
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
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Job
      </h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <JobForm
          initialData={jobDto}
          userId={user.id}
          isEditing={true}
        />
      </div>
    </div>
  );
} 