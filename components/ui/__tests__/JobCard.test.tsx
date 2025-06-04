import { render, screen } from '@testing-library/react';
import JobCard from '../JobCard';
import { JobDto } from '@/domains/job/application/dtos';
import { JobType } from '@/domains/job/domain/value-objects';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('JobCard', () => {
  const mockJob: JobDto = {
    id: 'job-123',
    title: 'Frontend Developer',
    company: 'Tech Company',
    description: 'We are looking for a frontend developer with React experience',
    salary: '$80,000 - $100,000',
    location: 'San Francisco, USA',
    locationObj: {
      city: 'San Francisco',
      country: 'USA',
      isRemote: false
    },
    type: JobType.FULL_TIME,
    applyUrl: 'https://example.com/apply',
    createdAt: '2023-06-01T00:00:00.000Z',
    updatedAt: '2023-06-01T00:00:00.000Z',
    userId: 'user-123'
  };

  it('renders job details correctly', () => {
    render(<JobCard job={mockJob} />);
    
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Company')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, USA')).toBeInTheDocument();
    expect(screen.getByText('We are looking for a frontend developer with React experience')).toBeInTheDocument();
    expect(screen.getByText('$80,000 - $100,000')).toBeInTheDocument();
    expect(screen.getByText('FULL TIME')).toBeInTheDocument();
  });

  it('links to the job details page', () => {
    render(<JobCard job={mockJob} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/jobs/job-123');
  });

  it('displays the formatted created date', () => {
    render(<JobCard job={mockJob} />);
    
    // The exact format depends on the user's locale, but should contain the date
    expect(screen.getByText(/Posted Jun 1, 2023/)).toBeInTheDocument();
  });

  it('renders a remote job correctly', () => {
    const remoteJob = {
      ...mockJob,
      location: 'Remote',
      locationObj: {
        isRemote: true
      }
    };
    
    render(<JobCard job={remoteJob} />);
    
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });

  it('renders a job without salary correctly', () => {
    const jobWithoutSalary = {
      ...mockJob,
      salary: undefined
    };
    
    render(<JobCard job={jobWithoutSalary} />);
    
    // Salary should not be in the document
    expect(screen.queryByText('$80,000 - $100,000')).not.toBeInTheDocument();
  });

  it('applies correct color for full time job type', () => {
    render(<JobCard job={mockJob} />);
    
    const badge = screen.getByText('FULL TIME');
    expect(badge.className).toContain('bg-green-100');
  });

  it('applies correct color for part time job type', () => {
    const partTimeJob = {
      ...mockJob,
      type: JobType.PART_TIME
    };
    
    render(<JobCard job={partTimeJob} />);
    
    const badge = screen.getByText('PART TIME');
    expect(badge.className).toContain('bg-blue-100');
  });
}); 