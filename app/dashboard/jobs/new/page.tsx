'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import JobForm from '@/components/forms/JobForm';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';

export default function NewJobPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUserId(session.user.id);
        } else {
          // Just use a demo ID for non-authenticated users
          setUserId("demo-user-id");
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Post a New Job
        </h1>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {userId && <JobForm userId={userId} />}
          {!userId && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Unable to load the job form. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <DashboardWrapper requireAuth={true}>
      {renderContent()}
    </DashboardWrapper>
  );
} 