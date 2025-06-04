import { JobEntity } from '../entities';
import { JobType, Location } from '../value-objects';

describe('JobEntity', () => {
  const mockJob = {
    id: '123',
    title: 'Software Developer',
    company: 'Tech Co',
    description: 'A job description',
    salary: '$100,000',
    location: new Location({ city: 'San Francisco', country: 'USA', isRemote: false }),
    type: JobType.FULL_TIME,
    applyUrl: 'https://example.com/apply',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
    userId: 'user123',
  };

  it('should create a job entity with all properties', () => {
    const job = new JobEntity(mockJob);
    
    expect(job.id).toBe('123');
    expect(job.title).toBe('Software Developer');
    expect(job.company).toBe('Tech Co');
    expect(job.description).toBe('A job description');
    expect(job.salary).toBe('$100,000');
    expect(job.location).toEqual(mockJob.location);
    expect(job.type).toBe(JobType.FULL_TIME);
    expect(job.applyUrl).toBe('https://example.com/apply');
    expect(job.createdAt).toEqual(new Date('2023-01-01'));
    expect(job.updatedAt).toEqual(new Date('2023-01-02'));
    expect(job.userId).toBe('user123');
  });

  it('should return false for isRemote when job is not remote', () => {
    const job = new JobEntity(mockJob);
    expect(job.isRemote()).toBe(false);
  });

  it('should return true for isRemote when job is remote', () => {
    const remoteJob = {
      ...mockJob,
      location: new Location({ isRemote: true }),
    };
    
    const job = new JobEntity(remoteJob);
    expect(job.isRemote()).toBe(true);
  });

  it('should return true for isFullTime when job is full-time', () => {
    const job = new JobEntity(mockJob);
    expect(job.isFullTime()).toBe(true);
  });

  it('should return false for isFullTime when job is not full-time', () => {
    const partTimeJob = {
      ...mockJob,
      type: JobType.PART_TIME,
    };
    
    const job = new JobEntity(partTimeJob);
    expect(job.isFullTime()).toBe(false);
  });
}); 