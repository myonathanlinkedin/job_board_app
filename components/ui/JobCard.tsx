'use client';

import Link from 'next/link';
import { JobDto } from '@/domains/job/application/dtos';
import { JobType } from '@/domains/job/domain/value-objects';

interface JobCardProps {
  job: JobDto;
}

export default function JobCard({ job }: JobCardProps) {
  const getJobTypeBadgeColor = (type: JobType) => {
    switch (type) {
      case JobType.FULL_TIME:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case JobType.PART_TIME:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case JobType.CONTRACT:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case JobType.INTERNSHIP:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case JobType.FREELANCE:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700">
      <Link href={`/jobs/${job.id}`} className="block p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {job.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
              {job.company}
            </p>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
              <span>{job.location}</span>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeBadgeColor(job.type)}`}>
            {job.type.replace('_', ' ')}
          </span>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {job.description}
          </p>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          {job.salary && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {job.salary}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Posted {formatDate(job.createdAt)}
          </span>
        </div>
      </Link>
    </div>
  );
} 