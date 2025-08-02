import React from 'react';

interface PageHeaderProps {
  totalEvents: number;
  filteredEvents: number;
}

const PageHeader: React.FC<PageHeaderProps> = ({ totalEvents, filteredEvents }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
        Discover Amazing
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
          Events
        </span>
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
        Join thousands of people connecting through shared interests and passions. Find your next adventure, 
        learn something new, or meet like-minded individuals.
      </p>
      <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
          <span>{totalEvents} Total Events</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>{filteredEvents} Matching Your Criteria</span>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;