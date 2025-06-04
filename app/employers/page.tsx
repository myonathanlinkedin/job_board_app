'use client';

import { Icons } from '@/components/ui/Icons';
import Link from 'next/link';

export default function EmployersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="page-heading text-center">For Employers</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Post jobs and find the right candidates</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Reach thousands of qualified candidates and hire the talent your business needs to succeed.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 shrink-0">
                <Icons.Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Easy Job Posting</h3>
                <p className="text-gray-600 dark:text-gray-400">Create and publish job listings in minutes with our user-friendly dashboard.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4 shrink-0">
                <Icons.User className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Quality Candidates</h3>
                <p className="text-gray-600 dark:text-gray-400">Connect with pre-screened candidates that match your requirements.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4 shrink-0">
                <Icons.Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Advanced Filtering</h3>
                <p className="text-gray-600 dark:text-gray-400">Find candidates with the exact skills and experience you're looking for.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-4 shrink-0">
                <Icons.Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Fast Hiring Process</h3>
                <p className="text-gray-600 dark:text-gray-400">Streamlined recruitment workflow to help you hire faster.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icons.Briefcase className="w-5 h-5 mr-2" />
              Post a Job
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Pricing Plans</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Perfect for small businesses</p>
              <div className="text-3xl font-bold mb-4">$99<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  Up to 5 job postings
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  Basic candidate filtering
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  Email support
                </li>
              </ul>
              <Link 
                href="/auth/signup" 
                className="mt-auto text-center py-2 px-4 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Choose Basic
              </Link>
            </div>
            
            <div className="border-2 border-blue-600 dark:border-blue-500 rounded-lg p-6 flex flex-col relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">Popular</div>
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">For growing companies</p>
              <div className="text-3xl font-bold mb-4">$199<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  Up to 15 job postings
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  Advanced candidate filtering
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  Priority email support
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  Analytics dashboard
                </li>
              </ul>
              <Link 
                href="/auth/signup" 
                className="mt-auto text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Choose Professional
              </Link>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">For large organizations</p>
              <div className="text-3xl font-bold mb-4">$399<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  Unlimited job postings
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  Premium candidate filtering
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  Dedicated support manager
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  Advanced analytics & reporting
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Icons.Search className="w-4 h-4 mr-2 text-green-500" />
                  API access
                </li>
              </ul>
              <Link 
                href="/auth/signup" 
                className="mt-auto text-center py-2 px-4 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Choose Enterprise
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 