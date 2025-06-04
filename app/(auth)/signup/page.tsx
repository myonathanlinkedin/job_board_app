import AuthForm from '@/components/forms/AuthForm';

export const metadata = {
  title: 'Sign Up | Job Board App',
  description: 'Create a new account for the job board',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <AuthForm mode="signup" />
    </div>
  );
} 