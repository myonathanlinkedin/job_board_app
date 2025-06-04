import { supabase } from './supabase';

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
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Unexpected error getting session:', error);
    return null;
  }
}

/**
 * Signs in with email and password
 * @param email The user's email
 * @param password The user's password
 * @returns An object with the user and session if successful
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error.message);
      throw error;
    }
    
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