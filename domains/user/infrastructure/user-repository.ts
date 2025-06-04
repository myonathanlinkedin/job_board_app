import { User } from '../domain/entities';

/**
 * Interface for the User repository
 * - Defines methods for interacting with user data
 * - Implementation will be provided by Supabase adapter
 */
export interface UserRepository {
  /**
   * Get a user by ID
   */
  getById(id: string): Promise<User | null>;
  
  /**
   * Get a user by email
   */
  getByEmail(email: string): Promise<User | null>;
  
  /**
   * Update a user's profile
   */
  updateProfile(userId: string, data: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>): Promise<User>;
}

/**
 * Note: Current implementation uses Supabase Auth directly rather than this repository,
 * but this interface is provided for future domain logic expansion.
 */ 