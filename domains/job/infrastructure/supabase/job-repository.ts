import { JobEntity } from '../../domain/entities';
import { Location, JobType } from '../../domain/value-objects';
import { supabase } from '../../../../lib/supabase';

export interface JobRepository {
  createJob(job: JobEntity): Promise<string>;
  getJobById(id: string): Promise<JobEntity | null>;
  getJobs(limit?: number): Promise<JobEntity[]>;
  updateJob(job: JobEntity): Promise<void>;
  deleteJob(id: string): Promise<void>;
  getJobsByUser(userId: string): Promise<JobEntity[]>;
}

export class SupabaseJobRepository implements JobRepository {
  async createJob(job: JobEntity): Promise<string> {
    const { data, error } = await supabase.from('jobs').insert({
      id: job.id,
      title: job.title,
      company: job.company,
      description: job.description,
      salary: job.salary,
      location: {
        city: job.location.city,
        country: job.location.country,
        isRemote: job.location.isRemote,
      },
      type: job.type,
      apply_url: job.applyUrl,
      created_at: job.createdAt,
      updated_at: job.updatedAt,
      user_id: job.userId,
    }).select('id').single();
    
    if (error) throw error;
    return data?.id;
  }

  async getJobById(id: string): Promise<JobEntity | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    return this.mapDatabaseRecordToEntity(data);
  }

  async getJobs(limit: number = 100): Promise<JobEntity[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data.map(this.mapDatabaseRecordToEntity);
  }

  async updateJob(job: JobEntity): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .update({
        title: job.title,
        company: job.company,
        description: job.description,
        salary: job.salary,
        location: {
          city: job.location.city,
          country: job.location.country,
          isRemote: job.location.isRemote,
        },
        type: job.type,
        apply_url: job.applyUrl,
        updated_at: new Date(),
      })
      .eq('id', job.id);
    
    if (error) throw error;
  }

  async deleteJob(id: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async getJobsByUser(userId: string): Promise<JobEntity[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(this.mapDatabaseRecordToEntity);
  }

  private mapDatabaseRecordToEntity(record: any): JobEntity {
    return new JobEntity({
      id: record.id,
      title: record.title,
      company: record.company,
      description: record.description,
      salary: record.salary,
      location: new Location({
        city: record.location?.city,
        country: record.location?.country,
        isRemote: record.location?.isRemote ?? false,
      }),
      type: record.type as JobType,
      applyUrl: record.apply_url,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      userId: record.user_id,
    });
  }
} 