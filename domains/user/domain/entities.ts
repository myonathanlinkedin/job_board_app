/**
 * User entity representing the core user domain model
 */
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: Date;
}

/**
 * Factory function to create a User entity from raw data
 */
export function createUser(data: {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  createdAt?: string | Date;
}): User {
  return {
    id: data.id,
    email: data.email,
    fullName: data.fullName,
    avatarUrl: data.avatarUrl,
    emailVerified: data.emailVerified ?? false,
    createdAt: data.createdAt ? 
      (typeof data.createdAt === 'string' ? new Date(data.createdAt) : data.createdAt) : 
      new Date()
  };
} 