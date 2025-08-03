'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useUserSync } from '@/pages/Authentication/useUserSync';
import { canRegisterForEvent } from '@/lib/tierUtils';
import { supabase } from '@/lib/supabase';

interface EventWithRegistrations {
  UUID: number;
  title: string;
  description: string;
  starting_time: string;
  location: string;
  image_url: string;
  category: string;
  tier: string;
  group?: string;
  max_attendees?: number;
  registrationCount: number;
}

const UpcomingEvents = () => {
  const { isSignedIn } = useUser();
  const { supabaseUser } = useUserSync();
  const [events, setEvents] = useState<EventWithRegistrations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      
      // Get current time in format that matches database
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 8); // Format: "HH:MM:SS"
      const currentDate = now.toISOString().slice(0, 10); // Format: "YYYY-MM-DD"
      
      console.log('Current time:', currentTime, 'Current date:', currentDate);
      
      // Fetch all events to ensure we have enough data
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('starting_time', { ascending: true })
        .limit(50); // Get more events to filter properly

      if (eventsError) throw eventsError;

      console.log('Raw events data:', eventsData);

      if (!eventsData || eventsData.length === 0) {
        setEvents([]);
        return;
      }

      // Separate upcoming and past events
      const upcomingEvents: EventWithRegistrations[] = [];
      const pastEvents: EventWithRegistrations[] = [];

      eventsData.forEach(event => {
        try {
          // Check if starting_time is null or undefined
          if (!event.starting_time) {
            console.log(`Event ${event.title} has null/undefined starting_time, skipping time parsing`);
            // Add to past events as fallback for events without time
            pastEvents.push(event);
            return;
          }

          // Try different time parsing approaches
          let eventDateTime;
          
          if (event.starting_time.includes('T')) {
            // If it's already an ISO string
            eventDateTime = new Date(event.starting_time);
          } else if (event.starting_time.includes(':')) {
            // If it's just a time string, combine with today's date
            eventDateTime = new Date(`${currentDate}T${event.starting_time}`);
          } else {
            // If it's in some other format, try direct parsing
            eventDateTime = new Date(event.starting_time);
          }
          
          // Check if the parsed date is valid
          const isValidDate = !isNaN(eventDateTime.getTime());
          const isFuture = eventDateTime > now;
          
          console.log(`Event: ${event.title}, Time: ${event.starting_time}, Parsed: ${eventDateTime}, Valid: ${isValidDate}, Future: ${isFuture}`);
          
          if (isValidDate) {
            if (isFuture) {
              upcomingEvents.push(event);
            } else {
              pastEvents.push(event);
            }
          } else {
            // If invalid date, add to past events as fallback
            pastEvents.push(event);
          }
        } catch (error) {
          console.error('Error parsing event time:', event.starting_time, error);
          // If we can't parse the time, add it to past events as fallback
          pastEvents.push(event);
        }
      });

      console.log('Upcoming events:', upcomingEvents.length, 'Past events:', pastEvents.length);

      // Combine events: prioritize upcoming events, then fill with most recent past events if needed
      let selectedEvents = [...upcomingEvents];
      
      // If we don't have enough upcoming events, add recent past events
      if (selectedEvents.length < 6) {
        const neededEvents = 6 - selectedEvents.length;
        // Sort past events by time (most recent first) and take what we need
        const recentPastEvents = pastEvents
          .sort((a, b) => {
            try {
              // Handle null/undefined times
              if (!a.starting_time && !b.starting_time) return 0;
              if (!a.starting_time) return 1; // Put null times at the end
              if (!b.starting_time) return -1;

              const dateA = new Date(a.starting_time.includes('T') ? a.starting_time : `${currentDate}T${a.starting_time}`).getTime();
              const dateB = new Date(b.starting_time.includes('T') ? b.starting_time : `${currentDate}T${b.starting_time}`).getTime();
              return dateB - dateA; // Most recent first
            } catch (error) {
              return 0;
            }
          })
          .slice(0, neededEvents);
        
        selectedEvents = [...selectedEvents, ...recentPastEvents];
        console.log(`Added ${recentPastEvents.length} past events to reach minimum of 6`);
      }

      // If we still don't have 6 events, just take the first 6 from all events
      if (selectedEvents.length < 6) {
        selectedEvents = eventsData.slice(0, 6);
        console.log('Using first 6 events from database as fallback');
      }

      // Get registration counts for selected events
      const eventIds = selectedEvents.map(event => event.UUID);
      
      let registrationCounts: Record<number, number> = {};
      
      if (eventIds.length > 0) {
        const { data: registrationsData, error: registrationsError } = await supabase
          .from('event_registrations')
          .select('event_id')
          .in('event_id', eventIds);

        if (registrationsError) {
          console.error('Error fetching registrations:', registrationsError);
        } else {
          // Count registrations per event
          registrationCounts = registrationsData?.reduce((acc, reg) => {
            acc[reg.event_id] = (acc[reg.event_id] || 0) + 1;
            return acc;
          }, {} as Record<number, number>) || {};
        }
      }

      // Add registration counts to events
      const eventsWithRegistrations = selectedEvents.map(event => ({
        ...event,
        registrationCount: registrationCounts[event.UUID] || 0
      }));

      // Sort events by priority:
      // 1. Upcoming events first (by registration count, then by date)
      // 2. Past events second (by registration count, then by recency)
      const sortedEvents = eventsWithRegistrations.sort((a, b) => {
        // Check if events are upcoming or past
        const now = new Date();
        let aIsFuture = false;
        let bIsFuture = false;
        
        try {
          // Handle null times
          if (a.starting_time && b.starting_time) {
            const dateA = new Date(a.starting_time.includes('T') ? a.starting_time : `${currentDate}T${a.starting_time}`);
            const dateB = new Date(b.starting_time.includes('T') ? b.starting_time : `${currentDate}T${b.starting_time}`);
            aIsFuture = dateA > now;
            bIsFuture = dateB > now;
          }
        } catch (error) {
          // If can't parse, assume past
        }

        // Prioritize upcoming events
        if (aIsFuture && !bIsFuture) return -1;
        if (!aIsFuture && bIsFuture) return 1;

        // Both are upcoming or both are past - sort by registration count first
        const registrationDiff = b.registrationCount - a.registrationCount;
        if (registrationDiff !== 0) return registrationDiff;

        // Then sort by date (upcoming: sooner first, past: more recent first)
        try {
          // Handle null times
          if (!a.starting_time && !b.starting_time) return 0;
          if (!a.starting_time) return 1;
          if (!b.starting_time) return -1;

          const dateA = new Date(a.starting_time.includes('T') ? a.starting_time : `${currentDate}T${a.starting_time}`).getTime();
          const dateB = new Date(b.starting_time.includes('T') ? b.starting_time : `${currentDate}T${b.starting_time}`).getTime();
          
          if (aIsFuture && bIsFuture) {
            // Both upcoming: sooner events first
            return dateA - dateB;
          } else {
            // Both past: more recent events first
            return dateB - dateA;
          }
        } catch (error) {
          console.error('Error sorting by date:', error);
          return 0;
        }
      });

      // Take exactly 6 events
      setEvents(sortedEvents.slice(0, 6));
      console.log(`Final events selected: ${sortedEvents.slice(0, 6).length}`);
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateTimeString: string) => {
    try {
      // Handle null/undefined times
      if (!dateTimeString) {
        return 'TBD';
      }

      let date;
      if (dateTimeString.includes('T')) {
        date = new Date(dateTimeString);
      } else if (dateTimeString.includes(':')) {
        // If it's just a time, use today's date
        const today = new Date().toISOString().slice(0, 10);
        date = new Date(`${today}T${dateTimeString}`);
      } else {
        date = new Date(dateTimeString);
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', dateTimeString, error);
      return 'TBD';
    }
  };

  const formatTime = (dateTimeString: string) => {
    try {
      // Handle null/undefined times
      if (!dateTimeString) {
        return 'TBD';
      }

      let date;
      if (dateTimeString.includes('T')) {
        date = new Date(dateTimeString);
      } else if (dateTimeString.includes(':')) {
        // If it's just a time, use today's date
        const today = new Date().toISOString().slice(0, 10);
        date = new Date(`${today}T${dateTimeString}`);
      } else {
        date = new Date(dateTimeString);
      }
      
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      console.error('Error formatting time:', dateTimeString, error);
      return 'TBD';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'silver': return 'bg-gray-200 text-gray-900';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJoinEvent = (event: EventWithRegistrations) => {
    if (!isSignedIn) {
      window.location.href = `/?page=premium&reason=register-${event.tier?.toLowerCase()}&redirect=sign-in`;
      return;
    }

    if (!supabaseUser) {
      return; // Wait for user data to load
    }

    const eventTier = event.tier?.toLowerCase() as 'free' | 'silver' | 'gold' | 'platinum';
    const userTier = supabaseUser.tier as 'free' | 'silver' | 'gold' | 'platinum';

    if (!canRegisterForEvent(userTier, eventTier)) {
      window.location.href = `/?page=premium&reason=register-${eventTier}`;
      return;
    }

    // Navigate to event details page for registration
    window.location.href = `/?page=event-details&id=${event.UUID}`;
  };

  const getJoinButtonText = (event: EventWithRegistrations) => {
    if (!isSignedIn) {
      return 'Sign In to Join';
    }

    if (!supabaseUser) {
      return 'Loading...';
    }

    const eventTier = event.tier?.toLowerCase() as 'free' | 'silver' | 'gold' | 'platinum';
    const userTier = supabaseUser.tier as 'free' | 'silver' | 'gold' | 'platinum';

    if (!canRegisterForEvent(userTier, eventTier)) {
      return 'Upgrade to Join';
    }

    // Check if event is in the past
    try {
      // Handle null/undefined times
      if (!event.starting_time) {
        return 'View Event';
      }

      const now = new Date();
      const currentDate = now.toISOString().slice(0, 10);
      const eventDateTime = new Date(event.starting_time.includes('T') ? event.starting_time : `${currentDate}T${event.starting_time}`);
      
      if (eventDateTime < now) {
        return 'View Event';
      }
    } catch (error) {
      // If can't parse date, default to join
    }

    return 'Join Event';
  };

  const getJoinButtonColor = (event: EventWithRegistrations) => {
    if (!isSignedIn || !supabaseUser) {
      return 'text-orange-600 hover:text-orange-700';
    }

    const eventTier = event.tier?.toLowerCase() as 'free' | 'silver' | 'gold' | 'platinum';
    const userTier = supabaseUser.tier as 'free' | 'silver' | 'gold' | 'platinum';

    if (!canRegisterForEvent(userTier, eventTier)) {
      return 'text-red-600 hover:text-red-700';
    }

    return 'text-orange-600 hover:text-orange-700';
  };

  const getDefaultImage = (category: string) => {
    const categoryImages = {
      'technology': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'health & wellness': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'arts & culture': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'business & career': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'sports & fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'outdoors & adventure': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'social & community': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'education': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'food & drink': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    };
    return categoryImages[category?.toLowerCase() as keyof typeof categoryImages] || categoryImages['technology'];
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Loading the most popular upcoming events...
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join these exciting events happening near you. Connect with like-minded people and explore new experiences.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.UUID} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img 
                    src={event.image_url || getDefaultImage(event.category)}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(event.tier)}`}>
                      {event.tier?.charAt(0).toUpperCase() + event.tier?.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                    <div className="text-orange-600 font-bold text-lg">{formatDate(event.starting_time)}</div>
                    <div className="text-gray-600 text-sm">{formatTime(event.starting_time)}</div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{event.group || 'Community Event'}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm">{event.registrationCount} attending</span>
                    </div>
                    <button 
                      onClick={() => handleJoinEvent(event)}
                      className={`font-medium text-sm transition-colors duration-200 ${getJoinButtonColor(event)}`}
                    >
                      {getJoinButtonText(event)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Available</h3>
            <p className="text-gray-600">Check back soon for new events!</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/?page=events">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
            See more events
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;