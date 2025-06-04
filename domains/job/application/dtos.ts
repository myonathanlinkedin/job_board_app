import { Job, JobEntity } from '../domain/entities';
import { JobType, Location } from '../domain/value-objects';

// Input DTOs
export interface CreateJobDto {
  title: string;
  company: string;
  description: string;
  salary?: string;
  location: {
    city?: string;
    country?: string;
    isRemote: boolean;
  };
  type: JobType;
  applyUrl: string;
  userId: string;
}

export interface UpdateJobDto {
  id: string;
  title?: string;
  company?: string;
  description?: string;
  salary?: string;
  location?: {
    city?: string;
    country?: string;
    isRemote: boolean;
  };
  type?: JobType;
  applyUrl?: string;
}

// Output DTOs
export interface JobDto {
  id: string;
  title: string;
  company: string;
  description: string;
  salary?: string;
  location: string;
  locationObj: {
    city?: string;
    country?: string;
    isRemote: boolean;
  };
  type: JobType;
  applyUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Mappers
export function mapToJobDto(job: Job): JobDto {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    description: job.description,
    salary: job.salary,
    location: job.location.toString(),
    locationObj: {
      city: job.location.city,
      country: job.location.country,
      isRemote: job.location.isRemote,
    },
    type: job.type,
    applyUrl: job.applyUrl,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    userId: job.userId,
  };
}

export function mapToJobEntity(dto: CreateJobDto, id?: string): JobEntity {
  return new JobEntity({
    id: id || crypto.randomUUID(),
    title: dto.title,
    company: dto.company,
    description: dto.description,
    salary: dto.salary,
    location: new Location(dto.location),
    type: dto.type,
    applyUrl: dto.applyUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: dto.userId,
  });
} 