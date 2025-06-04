import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Jobs | Job Board App',
  description: 'Create, edit, and manage your job listings',
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 