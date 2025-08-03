'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserSync } from './useUserSync';
import { supabase } from '@/lib/supabase';

interface Event {
  UUID: number;
  title: string;
  description: string;
  category: string;
  tier: string;
  event_date: string;
  starting_time: string;
  ending_time: string;
  venue_name?: string;
  Address?: string;
  price: number;
  currency: string;
  is_online: boolean;
  image_url?: string;
  max_attendees: string;
  created_at: string;
}

interface EventRegistration {
  id: number;
  event_id: number;
  user_email: string;
  registration_date: string;
  registration_status: string;
  events: Event;
}

const MyRegistrations = () => {
  const { supabaseUser } = useUserSync();
  const router = useRouter();
  const [registeredEvents, setRegisteredEvents] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's registered events
  const fetchRegisteredEvents = async () => {
    if (!supabaseUser?.email) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events (
            UUID,
            title,
            description,
            category,
            tier,
            event_date,
            starting_time,
            ending_time,
            venue_name,
            Address,
            price,
            currency,
            is_online,
            image_url,
            max_attendees,
            created_at
          )
        `)
        .eq('user_email', supabaseUser.email)
        .eq('registration_status', 'registered')
        .order('registration_date', { ascending: false });

      if (error) {
        console.error('Error fetching registered events:', error);
      } else {
        setRegisteredEvents(data || []);
      }
    } catch (error) {
      console.error('Error in fetchRegisteredEvents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supabaseUser?.email) {
      fetchRegisteredEvents();
    }
  }, [supabaseUser]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBD';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Time TBD';
    
    try {
      const [hours, minutes] = timeString.split(":");
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? "PM" : "AM";
      return `${hour12}:${minutes || '00'} ${ampm}`;
    } catch (error) {
      return 'Invalid Time';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "free":
        return "bg-gray-100 text-gray-800";
      case "silver":
        return "bg-gray-200 text-gray-900";
      case "gold":
        return "bg-yellow-100 text-yellow-800";
      case "platinum":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEventClick = (eventUUID: number) => {
    router.push(`/?page=event-details&id=${eventUUID}`);
  };

  const handleBrowseEvents = () => {
    router.push('/?page=events');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Registered Events</h2>
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          {registeredEvents.length} Events
        </span>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your registered events...</p>
        </div>
      ) : registeredEvents.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Registered Events</h3>
          <p className="text-gray-600 mb-4">You haven't registered for any events yet.</p>
          <button
            onClick={handleBrowseEvents}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {registeredEvents.map((registration) => (
            <div key={registration.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={registration.events.image_url || "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                    alt={registration.events.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{registration.events.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(registration.events.tier)}`}>
                      {registration.events.tier.charAt(0).toUpperCase() + registration.events.tier.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{registration.events.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(registration.events.event_date)}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(registration.events.starting_time)}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {registration.events.is_online ? "Online" : registration.events.venue_name || registration.events.Address || "TBD"}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Registered on: {formatDate(registration.registration_date)}
                    </div>
                    <button
                      onClick={() => handleEventClick(registration.events.UUID)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      View Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
