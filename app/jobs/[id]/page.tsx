import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { JobEntity } from '@/domains/job/domain/entities';
import { Location, JobType } from '@/domains/job/domain/value-objects';
import { mapToJobDto } from '@/domains/job/application/dtos';

type Props = {
  params: { id: string };
};

// Generate metadata for the page
export async function generateMetadata({ params }: Props) {
  const { data } = await supabase
    .from('jobs')
    .select('title, company')
    .eq('id', params.id)
    .single();

  if (!data) {
    return {
      title: 'Job Not Found',
    };
  }

  return {
    title: `${data.title} at ${data.company} | Job Board`,
    description: `View details for ${data.title} position at ${data.company}`,
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = params;
  
  const { data, error } = await supabase
    .from('jobs')
    .select('*, profiles(*)') // Join with profiles table to get company info
    .eq('id', id)
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
  const job = mapToJobDto(jobEntity);
  
  // Format date for display
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
  }).format(new Date(job.createdAt));
  
  const jobTypeBadgeColors = {
    [JobType.FULL_TIME]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [JobType.PART_TIME]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [JobType.CONTRACT]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    [JobType.INTERNSHIP]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [JobType.FREELANCE]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/jobs" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Jobs
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {job.title}
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                {job.company}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center">
                  <svg className="mr-1.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </div>
                <div className="flex items-center">
                  <svg className="mr-1.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Posted {formattedDate}
                </div>
                {job.salary && (
                  <div className="flex items-center">
                    <svg className="mr-1.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.salary}
                  </div>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${jobTypeBadgeColors[job.type] || ''}`}>
                  {job.type.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <a 
              href={job.applyUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary text-center"
            >
              Apply Now
              <span className="ml-1">↗</span>
            </a>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Job Description</h2>
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{job.description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 