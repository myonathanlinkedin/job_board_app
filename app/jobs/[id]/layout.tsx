import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

// Generate dynamic metadata based on job ID
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { data } = await supabase
      .from('jobs')
      .select('title, company')
      .eq('id', params.id)
      .single();

    if (!data) {
      return {
        title: 'Job Not Found | Job Board App',
      };
    }

    return {
      title: `${data.title} at ${data.company} | Job Board App`,
      description: `View details for ${data.title} position at ${data.company}`,
    };
  } catch (error) {
    console.error('Error generating job metadata:', error);
    return {
      title: 'Job Details | Job Board App',
    };
  }
}

export default function JobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 