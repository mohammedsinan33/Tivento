'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { syncUserWithSupabase, UserProfile } from '@/pages/Authentication/userManagement';

export const useUserSync = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [supabaseUser, setSupabaseUser] = useState<UserProfile | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && isSignedIn && user) {
        setSyncLoading(true);
        setSyncError(null);

        try {
          const { data, error } = await syncUserWithSupabase(user);
          
          if (error) {
            setSyncError('Failed to sync user data');
            console.error('User sync error:', error);
          } else {
            setSupabaseUser(data);
            console.log('User synced successfully:', data);
          }
        } catch (error) {
          setSyncError('Failed to sync user data');
          console.error('User sync error:', error);
        } finally {
          setSyncLoading(false);
        }
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  return {
    supabaseUser,
    syncLoading,
    syncError,
    isLoaded,
    isSignedIn,
    clerkUser: user,
  };
};