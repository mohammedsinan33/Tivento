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

interface RegisteredUser {
  id: number;
  event_id: number;
  user_email: string;
  registration_date: string;
  registration_status: string;
  users: {
    first_name: string;
    last_name: string;
    email: string;
    tier: string;
  };
}

const MyEvents = () => {
  const { supabaseUser } = useUserSync();
  const router = useRouter();
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [selectedEventUsers, setSelectedEventUsers] = useState<RegisteredUser[]>([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string>('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch user's created events
  const fetchCreatedEvents = async () => {
    if (!supabaseUser?.email) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('username', supabaseUser.email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching created events:', error);
      } else {
        setCreatedEvents(data || []);
      }
    } catch (error) {
      console.error('Error in fetchCreatedEvents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch registered users for a specific event
  const fetchEventRegistrations = async (eventId: number, eventTitle: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          users (
            first_name,
            last_name,
            email,
            tier
          )
        `)
        .eq('event_id', eventId)
        .eq('registration_status', 'registered')
        .order('registration_date', { ascending: false });

      if (error) {
        console.error('Error fetching event registrations:', error);
      } else {
        setSelectedEventUsers(data || []);
        setSelectedEventTitle(eventTitle);
        setShowUserModal(true);
      }
    } catch (error) {
      console.error('Error in fetchEventRegistrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supabaseUser?.email) {
      fetchCreatedEvents();
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

  const handleCreateEvent = () => {
    router.push('/?page=create-event');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Created Events</h2>
        <div className="flex items-center gap-4">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            {createdEvents.length} Events
          </span>
          <button
            onClick={handleCreateEvent}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Create New Event
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your created events...</p>
        </div>
      ) : createdEvents.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Created Events</h3>
          <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
          <button
            onClick={handleCreateEvent}
            className="px-6 py-2 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 text-white font-medium rounded-lg transition-all duration-200"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {createdEvents.map((event) => (
            <div key={event.UUID} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={event.image_url || "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(event.tier)}`}>
                      {event.tier.charAt(0).toUpperCase() + event.tier.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(event.event_date)}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(event.starting_time)}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {event.is_online ? "Online" : event.venue_name || event.Address || "TBD"}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      Max: {event.max_attendees}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Created on: {formatDate(event.created_at)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchEventRegistrations(event.UUID, event.title)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        View Registrations
                      </button>
                      <button
                        onClick={() => handleEventClick(event.UUID)}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        View Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registered Users Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Registered Users - {selectedEventTitle}
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading registrations...</p>
                </div>
              ) : selectedEventUsers.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Registrations Yet</h4>
                  <p className="text-gray-600">No one has registered for this event yet.</p>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedEventUsers.length} Registered User{selectedEventUsers.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Registration Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedEventUsers.map((registration) => (
                          <tr key={registration.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {registration.users.first_name} {registration.users.last_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                {registration.users.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(registration.users.tier)}`}>
                                {registration.users.tier.charAt(0).toUpperCase() + registration.users.tier.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatDate(registration.registration_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {registration.registration_status.charAt(0).toUpperCase() + registration.registration_status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
