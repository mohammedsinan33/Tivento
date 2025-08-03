/**
 * Utility functions for tier-based permissions and restrictions
 */

// Tier type definitions - updated to match database enum values
export type UserTier = 'free' | 'silver' | 'gold' | 'platinum' | 'silver(student)' | 'platinum(mentor)';
export type EventTier = 'free' | 'silver' | 'gold' | 'platinum';

// Helper function to normalize tier values from database enum to base tier
export const normalizeTier = (tier: string): EventTier => {
  if (tier.includes('(student)')) return 'silver';
  if (tier.includes('(mentor)')) return 'platinum';
  return tier.toLowerCase() as EventTier;
};

// Helper function to check if user has special status
export const getUserTierStatus = (tier: string): { baseTier: EventTier; isStudent: boolean; isMentor: boolean } => {
  return {
    baseTier: normalizeTier(tier),
    isStudent: tier.includes('(student)'),
    isMentor: tier.includes('(mentor)')
  };
};

// Tier hierarchy (user can access events at or below their tier level)
const TIER_HIERARCHY: { [key in EventTier]: EventTier[] } = {
  free: ['free'],
  silver: ['free', 'silver'],
  gold: ['free', 'silver', 'gold'],
  platinum: ['free', 'silver', 'gold', 'platinum']
};

// Check if user can create events at all
export const canCreateEvents = (userTier: UserTier): boolean => {
  const { baseTier, isStudent } = getUserTierStatus(userTier);
  
  // Free users cannot create any events
  if (baseTier === 'free') {
    return false;
  }
  
  // Students with silver(student) tier can create events
  if (isStudent && baseTier === 'silver') {
    return true;
  }
  
  // All other non-free tiers can create events
  return true; // At this point we know baseTier is not 'free'
};

// Check if user can register for a specific event tier
export const canRegisterForEvent = (userTier: UserTier, eventTier: EventTier): boolean => {
  const { baseTier } = getUserTierStatus(userTier);
  const allowedTiers = TIER_HIERARCHY[baseTier] || ['free'];
  return allowedTiers.includes(eventTier);
};

// Check if user can create an event with a specific tier
export const canCreateEventWithTier = (userTier: UserTier, eventTier: EventTier): boolean => {
  const { baseTier, isStudent } = getUserTierStatus(userTier);
  
  // Free users cannot create any events
  if (baseTier === 'free') {
    return false;
  }
  
  // Students can only create FREE events (even with silver access)
  if (isStudent) {
    return eventTier === 'free';
  }
  
  // Regular users can create events at or below their tier level
  const allowedTiers = TIER_HIERARCHY[baseTier] || ['free'];
  return allowedTiers.includes(eventTier);
};

// Get maximum tier a user can create events for
export const getMaxCreatableTier = (userTier: UserTier): EventTier | null => {
  const { baseTier, isStudent } = getUserTierStatus(userTier);
  
  if (baseTier === 'free') {
    return null; // Free users cannot create events
  }
  
  // Students can only create free events
  if (isStudent) {
    return 'free';
  }
  
  const allowedTiers = TIER_HIERARCHY[baseTier];
  return allowedTiers[allowedTiers.length - 1]; // Return highest tier they can create
};

// Get list of tiers a user can create events for
export const getCreatableTiers = (userTier: UserTier): EventTier[] => {
  const { baseTier, isStudent } = getUserTierStatus(userTier);
  
  if (baseTier === 'free') {
    return []; // Free users cannot create events
  }
  
  // Students can only create free events
  if (isStudent) {
    return ['free'];
  }
  
  return TIER_HIERARCHY[baseTier] || [];
};

// Get display name for tier - helper function that works with both UserTier and EventTier
export const getTierDisplayName = (tier: UserTier | EventTier): string => {
  if (typeof tier === 'string' && tier.includes('(student)')) {
    return 'Silver Student';
  }
  if (typeof tier === 'string' && tier.includes('(mentor)')) {
    return 'Platinum Mentor';
  }
  return tier.charAt(0).toUpperCase() + tier.slice(1);
};

// Get CSS color classes for tier badges
export const getTierColor = (tier: UserTier): string => {
  const { baseTier, isStudent, isMentor } = getUserTierStatus(tier);
  
  switch (baseTier) {
    case 'free':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'silver':
      if (isStudent) {
        return 'bg-blue-100 text-blue-800 border-blue-300'; // Special blue for students
      }
      return 'bg-gray-200 text-gray-900 border-gray-300';
    case 'gold':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'platinum':
      if (isMentor) {
        return 'bg-indigo-100 text-indigo-800 border-indigo-300'; // Special indigo for mentors
      }
      return 'bg-purple-100 text-purple-800 border-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Get tier icon emoji
export const getTierIcon = (tier: UserTier): string => {
  if (tier.includes('(student)')) {
    return '🎓'; // Student icon
  }
  if (tier.includes('(mentor)')) {
    return '🏆'; // Mentor icon
  }
  
  const { baseTier } = getUserTierStatus(tier);
  switch (baseTier) {
    case 'free':
      return '🆓';
    case 'silver':
      return '🥈';
    case 'gold':
      return '🥇';
    case 'platinum':
      return '💎';
    default:
      return '🆓';
  }
};

// Get appropriate redirect reason for premium page
export const getRedirectReason = (action: 'create' | 'register', userTier: UserTier, eventTier?: EventTier): string => {
  const { baseTier } = getUserTierStatus(userTier);
  
  if (action === 'create') {
    if (baseTier === 'free') {
      return 'create-event';
    } else if (eventTier) {
      return `create-${eventTier}-event`;
    }
    return 'create-event';
  } else if (action === 'register' && eventTier) {
    return `register-${eventTier}-event`;
  }
  return 'upgrade';
};

// Validate event creation permission with detailed error message
export const validateEventCreation = (userTier: UserTier, eventTier: EventTier): { 
  allowed: boolean; 
  error?: string; 
  upgradeMessage?: string;
} => {
  const { baseTier, isStudent } = getUserTierStatus(userTier);
  
  if (baseTier === 'free') {
    return {
      allowed: false,
      error: 'Free users cannot create events',
      upgradeMessage: 'Upgrade to Silver or higher to start creating events!'
    };
  }
  
  // Special validation for students
  if (isStudent && eventTier !== 'free') {
    return {
      allowed: false,
      error: 'Student accounts can only create Free events',
      upgradeMessage: 'Your Student Silver plan gives you free access to Silver features, but you can only create Free events to keep them accessible to all students.'
    };
  }
  
  if (!canCreateEventWithTier(userTier, eventTier)) {
    const maxTier = getMaxCreatableTier(userTier);
    return {
      allowed: false,
      error: `${getTierDisplayName(userTier)} users cannot create ${getTierDisplayName(eventTier)} events`,
      upgradeMessage: `Your current ${getTierDisplayName(userTier)} plan allows creating events up to ${getTierDisplayName(maxTier!)} tier. Upgrade to ${getTierDisplayName(eventTier)} or higher to create ${getTierDisplayName(eventTier)} events.`
    };
  }
  
  return { allowed: true };
};