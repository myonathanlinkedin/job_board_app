'use client';

import { useState, useEffect } from 'react';
import JobCard from '@/components/ui/JobCard';
import { supabase } from '@/lib/supabase';
import { JobDto, mapToJobDto } from '@/domains/job/application/dtos';
import { JobEntity } from '@/domains/job/domain/entities';
import { JobType, Location } from '@/domains/job/domain/value-objects';
import { Icons } from '@/components/ui/Icons';

export default function JobsListing() {
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<JobType | ''>('');
  
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
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
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    }
    
    fetchJobs();
  }, []);
  
  const filteredJobs = jobs.filter(job => {
    let matchesLocation = true;
    let matchesType = true;
    
    if (locationFilter) {
      matchesLocation = job.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
        (job.locationObj.isRemote && locationFilter.toLowerCase() === 'remote');
    }
    
    if (typeFilter) {
      matchesType = job.type === typeFilter;
    }
    
    return matchesLocation && matchesType;
  });

  return (
    <div>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location-filter" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Icons.Location className="h-4 w-4 mr-1" />
            Filter by Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icons.Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="location-filter"
              type="text"
              placeholder="City, Country, or Remote"
              className="form-input pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="type-filter" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Icons.Clock className="h-4 w-4 mr-1" />
            Filter by Job Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icons.Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              id="type-filter"
              className="form-input pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as JobType | '')}
            >
              <option value="">All Types</option>
              <option value={JobType.FULL_TIME}>Full-Time</option>
              <option value={JobType.PART_TIME}>Part-Time</option>
              <option value={JobType.CONTRACT}>Contract</option>
              <option value={JobType.INTERNSHIP}>Internship</option>
              <option value={JobType.FREELANCE}>Freelance</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md p-4 text-red-700 dark:text-red-400">
          <div className="flex items-center">
            <Icons.Close className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <Icons.Briefcase className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">No jobs found matching your filters.</p>
          {(locationFilter || typeFilter) && (
            <button 
              className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => {
                setLocationFilter('');
                setTypeFilter('');
              }}
            >
              <Icons.Close className="h-4 w-4 mr-1" />
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
} 