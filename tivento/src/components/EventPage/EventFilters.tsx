'use client';

import React from 'react';

interface EventFiltersProps {
  selectedCategory: string;
  selectedTier: string;
  searchTerm: string;
  onCategoryChange: (category: string) => void;
  onTierChange: (tier: string) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  selectedCategory,
  selectedTier,
  searchTerm,
  onCategoryChange,
  onTierChange,
  onSearchChange,
  onClearFilters,
}) => {
  // Categories exactly matching how they're stored in database (lowercase)
  // Based on BasicInformation.tsx line 76: value={cat.toLowerCase()}
  const categories = [
    'All Categories',
    'technology',
    'health & wellness',
    'arts & culture',
    'business & career',
    'sports & fitness',
    'education',
    'food & drink',
    'music',
    'outdoors & adventure',
    'social & community'
  ];

  const tiers = ['All Tiers', 'free', 'silver', 'gold', 'platinum'];

  // Format category display name for better UX
  const formatCategoryName = (category: string) => {
    if (category === 'All Categories') return category;
    return category.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format tier display name  
  const formatTierName = (tier: string) => {
    if (tier === 'All Tiers') return tier;
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  // Fixed: Only include the actual state values in dependency array
  React.useEffect(() => {
    console.log('🔍 FILTER DEBUGGING:');
    console.log('Selected Category:', selectedCategory);
    console.log('Selected Tier:', selectedTier);
    console.log('Search Term:', searchTerm);
    console.log('--- End Filter Debug ---');
  }, [selectedCategory, selectedTier, searchTerm]); // Removed 'categories' from dependencies

  const handleCategoryChange = (value: string) => {
    console.log('🔄 Category changing from', selectedCategory, 'to', value);
    onCategoryChange(value);
  };

  const handleTierChange = (value: string) => {
    console.log('🔄 Tier changing from', selectedTier, 'to', value);
    onTierChange(value);
  };

  const handleSearchChange = (value: string) => {
    console.log('🔍 Search changing from', searchTerm, 'to', value);
    onSearchChange(value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter Events</h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Search Bar */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Events
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by title, description, or tags..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {formatCategoryName(category)}
              </option>
            ))}
          </select>
        </div>

        {/* Tier Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            User Tier
          </label>
          <select
            value={selectedTier}
            onChange={(e) => handleTierChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {tiers.map((tier) => (
              <option key={tier} value={tier}>
                {formatTierName(tier)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-6 text-center">
        <button
          onClick={onClearFilters}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default EventFilters;