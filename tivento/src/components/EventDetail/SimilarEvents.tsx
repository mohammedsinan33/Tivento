'use client';

import React, { useState, useEffect } from 'react';
import { Event, getAllEvents } from '@/components/EventPage/Supabase';
import EventCard from '@/components/EventPage/EventCard';

interface SimilarEventsProps {
  event: Event;
}

const SimilarEvents: React.FC<SimilarEventsProps> = ({ event }) => {
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarEvents = async () => {
      try {
        const { data, error } = await getAllEvents();
        
        if (!error && data) {
          // Filter events by same category, excluding current event
          const filtered = data
            .filter(e => 
              e.id !== event.id && 
              e.Catogory?.toLowerCase() === event.Catogory?.toLowerCase()
            )
            .slice(0, 3); // Limit to 3 events
          
          setSimilarEvents(filtered);
        }
      } catch (error) {
        console.error('Error fetching similar events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarEvents();
  }, [event.id, event.Catogory]);

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Similar Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
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
      </div>
    );
  }

  if (similarEvents.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Similar Events</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {similarEvents.map((similarEvent) => (
          <EventCard key={similarEvent.id} event={similarEvent} />
        ))}
      </div>
    </div>
  );
};

export default SimilarEvents;