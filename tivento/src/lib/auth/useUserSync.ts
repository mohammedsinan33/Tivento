'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState, useCallback } from 'react';
import { syncUserWithSupabase, UserProfile } from '@/lib/auth/userManagement';

export const useUserSync = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [supabaseUser, setSupabaseUser] = useState<UserProfile | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const syncUser = useCallback(async () => {
    if (user && isLoaded) {
      setSyncLoading(true);
      setSyncError(null);

      try {
        const { data, error } = await syncUserWithSupabase(user);
        
        if (error) {
          setSyncError('Failed to sync user data');
          console.error('User sync error:', error);
        } else {
          setSupabaseUser(data);
          // Remove console.log('User synced successfully:', data);
        }
      } catch (error) {
        setSyncError('Failed to sync user data');
        console.error('User sync error:', error);
      } finally {
        setSyncLoading(false);
      }
    }
  }, [user, isLoaded]);

  useEffect(() => {
    syncUser();
  }, [syncUser]);

  return {
    supabaseUser,
    syncLoading,
    syncError,
    isLoaded,
    isSignedIn,
    clerkUser: user,
  };
};