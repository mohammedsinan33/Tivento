'use client';

import React from 'react';
import EventCard from './EventCard';

interface EventListProps {
  events: any[];
  loading: boolean;
  error: string | null;
}

const EventList: React.FC<EventListProps> = ({ events, loading, error }) => {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Events</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or check back later for new events.</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200">
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCard key={event.id || event.event_id || `event-${Math.random()}`} event={event} />
      ))}
    </div>
  );
};

export default EventList;