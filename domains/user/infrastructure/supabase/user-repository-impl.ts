import { supabase } from '@/lib/supabase';
import { User, createUser } from '../../domain/entities';
import { UserRepository } from '../user-repository';

/**
 * Supabase implementation of the UserRepository
 */
export class SupabaseUserRepository implements UserRepository {
  /**
   * Get a user by ID
   */
  async getById(id: string): Promise<User | null> {
    // First check auth.users through getUser API
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('Error fetching user from auth:', userError);
      return null;
    }
    
    // Then get additional profile data if needed
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError);
    }
    
    // Merge auth and profile data
    return createUser({
      id: userData.user.id,
      email: userData.user.email || '',
      fullName: profileData?.full_name || userData.user.user_metadata?.full_name,
      avatarUrl: profileData?.avatar_url,
      emailVerified: !!userData.user.email_confirmed_at || !!userData.user.user_metadata?.email_verified,
      createdAt: userData.user.created_at
    });
  }
  
  /**
   * Get a user by email
   */
  async getByEmail(email: string): Promise<User | null> {
    // In Supabase, we can't directly query auth.users by email
    // This is just a placeholder that would need admin API access
    // or a server-side function to implement properly
    console.warn('getByEmail not fully implemented - requires admin access');
    return null;
  }
  
  /**
   * Update a user's profile
   */
  async updateProfile(userId: string, data: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>): Promise<User> {
    const { data: updated, error } = await supabase
      .from('profiles')
      .update({
        full_name: data.fullName,
        avatar_url: data.avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating profile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
    
    // Get the full user to return
    const user = await this.getById(userId);
    if (!user) {
      throw new Error('User not found after update');
    }
    
    return user;
  }
} 