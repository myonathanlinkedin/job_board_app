'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/ui/Icons';

export default function ResetPasswordDirectAccessPage() {
  const router = useRouter();
  const [error, setError] = useState(false);
  
  useEffect(() => {
    try {
      // Set cookies to help bypass middleware guards
      document.cookie = `password_reset_flow=true;path=/;max-age=600;SameSite=Lax`;
      document.cookie = `bypass_reset_redirect=true;path=/;max-age=600;SameSite=Lax`;
      document.cookie = `prevent_auth_redirect=true;path=/;max-age=600;SameSite=Lax`;
      
      console.log('Set bypass cookies for reset password flow');
      
      // Redirect to the proper reset password page
      setTimeout(() => {
        router.push('/auth/change-password?from=reset&direct=true');
      }, 500);
    } catch (err) {
      console.error('Error in reset password redirect:', err);
      setError(true);
    }
  }, [router]);

  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {error ? (
            <>
              <Icons.Close className="w-10 h-10 mx-auto text-red-500" />
              <h2 className="mt-4 text-2xl font-semibold">Error</h2>
              <p className="mt-2 text-sm text-gray-500">
                There was an error redirecting to the change password page.
                <br />
                <button 
                  onClick={() => window.location.href = '/auth/change-password?from=reset'}
                  className="mt-2 text-blue-600 hover:text-blue-500"
                >
                  Try again
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 mx-auto animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
              <h2 className="mt-4 text-2xl font-semibold">Redirecting to Change Password</h2>
              <p className="mt-2 text-sm text-gray-500">Please wait...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 