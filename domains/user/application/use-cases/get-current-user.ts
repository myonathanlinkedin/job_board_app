import { User } from '../../domain/entities';
import { UserRepository } from '../../infrastructure/user-repository';

/**
 * Use case for getting the current authenticated user
 */
export class GetCurrentUserUseCase {
  constructor(private userRepository: UserRepository) {}

  /**
   * Get the current user by their ID
   */
  async execute(userId: string): Promise<User | null> {
    if (!userId) return null;
    return this.userRepository.getById(userId);
  }
}

/**
 * Note: This is a placeholder for future implementation.
 * Currently, the application uses Supabase Auth directly
 * but this structure allows for proper domain logic separation
 * when the application grows.
 */ 