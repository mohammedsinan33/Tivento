import React from 'react';
import { validateEventCreation, getCreatableTiers, getTierDisplayName, getUserTierStatus, UserTier, EventTier } from '@/lib/tierUtils';

interface BasicInformationProps {
  formData: {
    title: string;
    description: string;
    category: string;
    tier: 'free' | 'silver' | 'gold' | 'platinum';
    tags: string;
    max_attendees: number;
    group: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  userTier?: UserTier;
  showTierValidation?: boolean;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ 
  formData, 
  onInputChange, 
  userTier = 'free',
  showTierValidation = false 
}) => {
  const categories = [
    'Technology',
    'Health & Wellness',
    'Arts & Culture',
    'Business & Career',
    'Sports & Fitness',
    'Education',
    'Food & Drink',
    'Music',
    'Outdoors & Adventure',
    'Social & Community'
  ];

  // Get user tier status
  const { baseTier, isStudent, isMentor } = getUserTierStatus(userTier);
  
  // Get tiers user can create events for
  const creatableTiers = getCreatableTiers(userTier);
  
  // Validate current tier selection
  const tierValidation = showTierValidation 
    ? validateEventCreation(userTier, formData.tier as EventTier)
    : { allowed: true };

  // Get tier option color based on validation
  const getTierOptionColor = (tier: string) => {
    if (!showTierValidation) return '';
    
    const canCreate = creatableTiers.includes(tier as EventTier);
    if (canCreate) {
      return 'text-green-700 bg-green-50';
    } else {
      return 'text-red-500 bg-red-50';
    }
  };

  // Get option text for tier dropdown
  const getTierOptionText = (tier: string, emoji: string, name: string) => {
    const canCreate = creatableTiers.includes(tier as EventTier);
    
    if (isStudent && tier !== 'free') {
      return `${emoji} ${name} (Students: Free events only)`;
    }
    
    if (!canCreate) {
      return `${emoji} ${name} (Requires upgrade)`;
    }
    
    return `${emoji} ${name}`;
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter event title"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Describe your event..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event Tier *
            {showTierValidation && (
              <span className="text-xs text-gray-500 ml-2">
                (Shows who can attend your event)
              </span>
            )}
          </label>
          <select
            name="tier"
            value={formData.tier}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select event tier</option>
            <option value="free" className={getTierOptionColor('free')}>
              {getTierOptionText('free', '🆓', 'Free')}
            </option>
            <option value="silver" className={getTierOptionColor('silver')}>
              {getTierOptionText('silver', '🥈', 'Silver')}
            </option>
            <option value="gold" className={getTierOptionColor('gold')}>
              {getTierOptionText('gold', '🥇', 'Gold')}
            </option>
            <option value="platinum" className={getTierOptionColor('platinum')}>
              {getTierOptionText('platinum', '💎', 'Platinum')}
            </option>
          </select>

          {/* Special Student Information */}
          {showTierValidation && isStudent && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-blue-600 text-lg mr-2">🎓</span>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Student Account Information</p>
                  <p className="text-xs text-blue-700 mt-1">
                    As a student with Silver access, you can join Silver events for free, but you can only create Free events to keep them accessible to all students.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tier Validation Message */}
          {showTierValidation && !tierValidation.allowed && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-red-700 font-medium">{tierValidation.error}</p>
                  {tierValidation.upgradeMessage && (
                    <p className="text-xs text-red-600 mt-1">{tierValidation.upgradeMessage}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tier Permission Info */}
          {showTierValidation && tierValidation.allowed && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="h-4 w-4 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-700">
                  ✅ You can create {getTierDisplayName(formData.tier as UserTier)} events with your {getTierDisplayName(userTier)} plan
                  {isStudent && formData.tier === 'free' && " (Perfect for student events!)"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags *
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g. networking, tech, beginner (comma separated)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Group/Community Name *
          </label>
          <input
            type="text"
            name="group"
            value={formData.group}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g. Tech Enthusiasts, Business Network, Local Community"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Max Attendees *
          </label>
          <input
            type="number"
            name="max_attendees"
            value={formData.max_attendees}
            onChange={onInputChange}
            min="1"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default BasicInformation;