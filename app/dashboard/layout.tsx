import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard | Job Board App',
  description: 'Manage your job postings',
};

// This is a server component to keep the metadata
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Suspense fallback={<div className="flex justify-center p-8">Loading dashboard...</div>}>
        {children}
      </Suspense>
    </main>
  );
} 