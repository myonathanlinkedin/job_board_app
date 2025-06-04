import { JobType, Location } from './value-objects';

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  salary?: string;
  location: Location;
  type: JobType;
  applyUrl: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export class JobEntity implements Job {
  id: string;
  title: string;
  company: string;
  description: string;
  salary?: string;
  location: Location;
  type: JobType;
  applyUrl: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;

  constructor(job: Job) {
    this.id = job.id;
    this.title = job.title;
    this.company = job.company;
    this.description = job.description;
    this.salary = job.salary;
    this.location = job.location;
    this.type = job.type;
    this.applyUrl = job.applyUrl;
    this.createdAt = job.createdAt;
    this.updatedAt = job.updatedAt;
    this.userId = job.userId;
  }

  // Domain logic for jobs
  isRemote(): boolean {
    return this.location.isRemote;
  }

  isFullTime(): boolean {
    return this.type === JobType.FULL_TIME;
  }
} 