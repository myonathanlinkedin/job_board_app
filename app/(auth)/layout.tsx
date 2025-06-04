import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Job Board App',
  description: 'Sign in or create an account for the job board',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 