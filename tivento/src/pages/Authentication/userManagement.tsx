import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id?: number;
  clerk_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  tier: 'free' | 'silver' | 'gold' | 'platinum';
  created_at?: string;
  updated_at?: string;
}

// Check if user exists in Supabase
export const getUserByClerkId = async (clerkUserId: string): Promise<{ data: UserProfile | null; error: any }> => {
  try {
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();


    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user:', error);
      return { data: null, error };
    }

    return { data: data || null, error: null };
  } catch (error) {
    console.error('Exception in getUserByClerkId:', error);
    return { data: null, error };
  }
};

// Create new user in Supabase
export const createUser = async (userData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: UserProfile | null; error: any }> => {
  try {

    const { data, error } = await supabase
      .from('users')
      .insert([{
        clerk_user_id: userData.clerk_user_id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        tier: userData.tier || 'free', // Default to free tier for NEW users only
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception in createUser:', error);
    return { data: null, error };
  }
};

// Update existing user in Supabase (preserves tier)
export const updateUser = async (clerkUserId: string, updates: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single();


    if (error) {
      console.error('Error updating user:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception in updateUser:', error);
    return { data: null, error };
  }
};

// Update user tier specifically (for premium upgrades)
export const updateUserTier = async (clerkUserId: string, newTier: 'free' | 'silver' | 'gold' | 'platinum'): Promise<{ data: UserProfile | null; error: any }> => {
  try {
    
    const { data, error } = await supabase
      .from('users')
      .update({
        tier: newTier,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user tier:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception in updateUserTier:', error);
    return { data: null, error };
  }
};

// Sync Clerk user with Supabase (preserves existing tier)
export const syncUserWithSupabase = async (clerkUser: any): Promise<{ data: UserProfile | null; error: any }> => {
  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await getUserByClerkId(clerkUser.id);
    
    if (fetchError) {
      console.error('Error checking for existing user:', fetchError);
      return { data: null, error: fetchError };
    }

    const userData = {
      clerk_user_id: clerkUser.id,
      email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
      first_name: clerkUser.firstName || '',
      last_name: clerkUser.lastName || '',
      username: clerkUser.username || clerkUser.emailAddresses?.[0]?.emailAddress.split('@')[0] || '',
      tier: 'free' as const, // Only used for NEW users
    };

    if (existingUser) {
      // Update existing user - PRESERVE EXISTING TIER!
      return await updateUser(clerkUser.id, {
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        // DO NOT UPDATE TIER - preserve existing tier from database
      });
    } else {
      // Create new user with default 'free' tier
      return await createUser(userData);
    }
  } catch (error) {
    console.error('Exception in syncUserWithSupabase:', error);
    return { data: null, error };
  }
};