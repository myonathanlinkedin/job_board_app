import JobsListing from './JobsListing';

export const metadata = {
  title: 'Browse Jobs | Job Board App',
  description: 'Browse job listings from top companies',
};

export default function JobsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Browse Jobs
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
        Find your next opportunity from our curated list of job openings. 
        Use the filters to narrow down your search.
      </p>
      
      <JobsListing />
    </div>
  );
} 