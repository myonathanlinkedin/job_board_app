'use client';

import { useEffect, useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="mb-8 relative">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          
          <div className="mb-4 flex justify-center">
            <Image src="/logo.svg" width={120} height={120} alt="JB Logo" className="w-24 h-24 animate-bounce-slow" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-gradient">
            Job Board App
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with top employers and discover your next career opportunity
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link 
            href="/jobs" 
            className="flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icons.Search className="w-5 h-5 mr-2" />
            Browse Jobs
          </Link>
          <Link
            href="/auth/signup"
            className="flex items-center px-6 py-3 text-lg font-medium text-blue-600 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-gray-700 transition-colors"
          >
            <Icons.User className="w-5 h-5 mr-2" />
            Create Account
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <Icons.Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Find Jobs</h3>
            <p className="text-gray-600 dark:text-gray-300">Browse thousands of job listings from top companies.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <Icons.Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Apply Easily</h3>
            <p className="text-gray-600 dark:text-gray-300">Quick application process to get your dream job.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
              <Icons.User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Career Growth</h3>
            <p className="text-gray-600 dark:text-gray-300">Advance your career with the right opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 