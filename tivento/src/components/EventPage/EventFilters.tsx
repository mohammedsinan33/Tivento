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

  // Debug effect to log filter changes
  React.useEffect(() => {
  }, [selectedCategory, selectedTier, searchTerm]);

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value);
  };

  const handleTierChange = (value: string) => {
    onTierChange(value);
  };

  const handleSearchChange = (value: string) => {
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
            Event Tier
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

      {/* Active Filters Display */}
      {(selectedCategory !== 'All Categories' || selectedTier !== 'All Tiers' || searchTerm.trim()) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'All Categories' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Category: {formatCategoryName(selectedCategory)}
                <button
                  onClick={() => handleCategoryChange('All Categories')}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTier !== 'All Tiers' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Tier: {formatTierName(selectedTier)}
                <button
                  onClick={() => handleTierChange('All Tiers')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {searchTerm.trim() && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

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