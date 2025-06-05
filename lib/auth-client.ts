import { supabase } from './supabase';
import { logger } from './logger';

/**
 * Checks if a user is currently logged in
 * @returns An object with user data if logged in, or null if not logged in
 */
export async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error.message);
      return null;
    }
    return data.user;
  } catch (error) {
    console.error('Unexpected error getting user:', error);
    return null;
  }
}

/**
 * Gets the current session
 * @returns The current session if it exists, or null
 */
export async function getSession() {
  try {
    logger.info('Getting session...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    
    if (data.session) {
      // Set bypass cookie to prevent immediate redirects
      if (typeof document !== 'undefined') {
        document.cookie = `bypass_auth_check=true;path=/;max-age=3600;SameSite=Lax${
          window.location.protocol === 'https:' ? ';Secure' : ''
        }`;
      }
      return data.session;
    }
    
    return null;
  } catch (error) {
    console.error('Unexpected error getting session:', error);
    return null;
  }
}

/**
 * Sets a cookie to indicate recent login
 * This helps prevent redirect loops by giving middleware a grace period
 */
function setJustLoggedInCookie() {
  if (typeof document !== 'undefined') {
    // Set for 5 seconds with SameSite=Lax for better security
    document.cookie = `just_logged_in=true;path=/;max-age=5;SameSite=Lax${
      window.location.protocol === 'https:' ? ';Secure' : ''
    }`;
    
    // Set bypass cookie for 1 hour
    document.cookie = `bypass_auth_check=true;path=/;max-age=3600;SameSite=Lax${
      window.location.protocol === 'https:' ? ';Secure' : ''
    }`;
    
    // Also clear any redirect prevention flags
    sessionStorage.removeItem('prevent_auth_redirect');
    sessionStorage.removeItem('auth_redirect_from_dashboard');
  }
}

/**
 * Signs in with email and password
 * @param email The user's email
 * @param password The user's password
 * @param redirectTo Optional path to redirect after login
 * @returns An object with the user and session if successful
 */
export async function signIn(email: string, password: string, redirectTo?: string) {
  try {
    // Clear any existing redirect counters before signing in
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_redirect_count');
      sessionStorage.removeItem('prevent_auth_redirect');
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error.message);
      throw error;
    }
    
    // Set a cookie to indicate recent login (helps prevent redirect loops)
    setJustLoggedInCookie();
    
    return data;
  } catch (error) {
    console.error('Unexpected error during sign in:', error);
    throw error;
  }
}

/**
 * Signs out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Unexpected error during sign out:', error);
    throw error;
  }
}

/**
 * Creates a new user account
 * @param email The user's email
 * @param password The user's password
 * @param userData Additional user data
 * @returns An object with the user and session if successful
 */
export async function signUp(email: string, password: string, userData: object = {}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: window.location.origin + '/auth/callback',
      },
    });
    
    if (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error during sign up:', error);
    throw error;
  }
}

/**
 * Resets the user's password
 * @param email The user's email
 * @param redirectTo The URL to redirect to after the password reset
 * @returns A promise that resolves when the password reset email is sent
 */
export async function resetPassword(email: string, redirectTo: string) {
  try {
    logger.info(`Requesting password reset for ${email} with redirect to ${redirectTo}`);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    
    if (error) {
      console.error('Error requesting password reset:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error during password reset request:', error);
    throw error;
  }
}

/**
 * Updates the user's password
 * @param newPassword The new password
 * @returns A promise that resolves when the password is updated
 */
export async function updatePassword(newPassword: string) {
  try {
    logger.info('Updating password');
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      console.error('Error updating password:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error during password update:', error);
    throw error;
  }
} 