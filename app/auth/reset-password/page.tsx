import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid build errors
const DynamicResetPasswordPage = dynamic(
  () => import('@/components/auth/ResetPasswordForm'),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <h2 className="mt-4 text-2xl font-semibold">Loading...</h2>
          </div>
        </div>
      </div>
    )
  }
);

export default function ResetPasswordPage() {
  return <DynamicResetPasswordPage />;
} 