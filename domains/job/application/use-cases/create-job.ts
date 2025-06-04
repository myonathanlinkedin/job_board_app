import { CreateJobDto, mapToJobEntity } from '../dtos';
import { JobRepository } from '../../infrastructure/supabase/job-repository';

export class CreateJobUseCase {
  constructor(private jobRepository: JobRepository) {}

  async execute(createJobDto: CreateJobDto): Promise<string> {
    const jobEntity = mapToJobEntity(createJobDto);
    
    // Validate entity
    if (!jobEntity.title || jobEntity.title.trim() === '') {
      throw new Error('Job title is required');
    }

    if (!jobEntity.company || jobEntity.company.trim() === '') {
      throw new Error('Company name is required');
    }

    if (!jobEntity.description || jobEntity.description.trim() === '') {
      throw new Error('Job description is required');
    }

    if (!jobEntity.applyUrl || jobEntity.applyUrl.trim() === '') {
      throw new Error('Application URL is required');
    }

    // Save job
    const jobId = await this.jobRepository.createJob(jobEntity);
    return jobId;
  }
} 