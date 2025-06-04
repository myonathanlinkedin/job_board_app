'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { JobType } from '@/domains/job/domain/value-objects';
import { JobDto } from '@/domains/job/application/dtos';

interface JobFormProps {
  initialData?: JobDto;
  userId: string;
  isEditing?: boolean;
}

export default function JobForm({ initialData, userId, isEditing = false }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [salary, setSalary] = useState(initialData?.salary || '');
  const [city, setCity] = useState(initialData?.locationObj.city || '');
  const [country, setCountry] = useState(initialData?.locationObj.country || '');
  const [isRemote, setIsRemote] = useState(initialData?.locationObj.isRemote || false);
  const [jobType, setJobType] = useState<JobType>(initialData?.type || JobType.FULL_TIME);
  const [applyUrl, setApplyUrl] = useState(initialData?.applyUrl || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const jobData = {
        title,
        company,
        description,
        salary,
        location: {
          city: city || null,
          country: country || null,
          isRemote,
        },
        type: jobType,
        apply_url: applyUrl,
        user_id: userId,
      };

      if (isEditing && initialData) {
        // Update existing job
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', initialData.id)
          .eq('user_id', userId); // Ensure user owns this job
          
        if (error) throw error;
        
        router.push('/dashboard');
        router.refresh();
      } else {
        // Create new job
        const { error } = await supabase
          .from('jobs')
          .insert({
            ...jobData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          
        if (error) throw error;
        
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while saving the job');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="form-label">
          Job Title*
        </label>
        <input
          id="title"
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Senior Frontend Developer"
        />
      </div>
      
      <div>
        <label htmlFor="company" className="form-label">
          Company Name*
        </label>
        <input
          id="company"
          type="text"
          className="form-input"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          placeholder="e.g. Acme Inc."
        />
      </div>
      
      <div>
        <label htmlFor="job-type" className="form-label">
          Job Type*
        </label>
        <select
          id="job-type"
          className="form-input"
          value={jobType}
          onChange={(e) => setJobType(e.target.value as JobType)}
          required
        >
          <option value={JobType.FULL_TIME}>Full-Time</option>
          <option value={JobType.PART_TIME}>Part-Time</option>
          <option value={JobType.CONTRACT}>Contract</option>
          <option value={JobType.INTERNSHIP}>Internship</option>
          <option value={JobType.FREELANCE}>Freelance</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            id="city"
            type="text"
            className="form-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. San Francisco"
          />
        </div>
        
        <div className="md:col-span-1">
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <input
            id="country"
            type="text"
            className="form-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. USA"
          />
        </div>
        
        <div className="md:col-span-1 flex items-center">
          <div className="mt-5">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Remote OK</span>
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="salary" className="form-label">
          Salary (Optional)
        </label>
        <input
          id="salary"
          type="text"
          className="form-input"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="e.g. $100,000 - $120,000"
        />
      </div>
      
      <div>
        <label htmlFor="apply-url" className="form-label">
          Application URL*
        </label>
        <input
          id="apply-url"
          type="url"
          className="form-input"
          value={applyUrl}
          onChange={(e) => setApplyUrl(e.target.value)}
          required
          placeholder="e.g. https://yourcompany.com/careers/apply"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="form-label">
          Job Description*
        </label>
        <textarea
          id="description"
          rows={8}
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Describe the job responsibilities, requirements, benefits, etc."
        />
      </div>
      
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="btn-secondary mr-3"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : isEditing ? 'Update Job' : 'Post Job'}
          </button>
        </div>
      </div>
    </form>
  );
} 