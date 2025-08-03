'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserByClerkId, UserProfile } from '@/lib/auth/userManagement';
import { UserTier } from '@/lib/tierUtils';

export const useUserTier = () => {
  const { user, isSignedIn } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userTier, setUserTier] = useState<UserTier>('free');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTier = async () => {
      if (!isSignedIn || !user) {
        setUserTier('free');
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: profile, error: fetchError } = await getUserByClerkId(user.id);
        
        if (fetchError) {
          console.error('Error fetching user profile:', fetchError);
          setError('Failed to load user profile');
          setUserTier('free');
          setUserProfile(null);
        } else if (profile) {
          setUserProfile(profile);
          setUserTier(profile.tier as UserTier);
          setError(null);
        } else {
          // User not found in database, default to free
          setUserTier('free');
          setUserProfile(null);
          setError(null);
        }
      } catch (err) {
        console.error('Exception fetching user tier:', err);
        setError('Failed to load user profile');
        setUserTier('free');
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTier();
  }, [user, isSignedIn]);

  return {
    userProfile,
    userTier,
    loading,
    error,
    refreshUserTier: () => {
      if (isSignedIn && user) {
        // Re-fetch user tier
        getUserByClerkId(user.id).then(({ data: profile }) => {
          if (profile) {
            setUserProfile(profile);
            setUserTier(profile.tier as UserTier);
          }
        });
      }
    }
  };
};
