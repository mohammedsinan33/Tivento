'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';
import { getEventById, Event } from '@/components/EventPage/Supabase';
import { registerUserForEvent } from '@/components/EventForm/Supabase';
import { useUserSync } from '@/lib/auth/useUserSync';
import { canRegisterForEvent, getTierDisplayName, getRedirectReason, EventTier, UserTier } from '@/lib/tierUtils';

const EventDetailsPage = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { supabaseUser, syncLoading } = useUserSync();
  const eventId = searchParams?.get('id');

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      checkRegistrationStatus();
    }
  }, [eventId, supabaseUser]);

  const fetchEventDetails = async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const { data, error } = await getEventById(eventId);
      if (error) {
        setError('Failed to load event details');
      } else {
        setEvent(data);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    if (!eventId || !supabaseUser?.email) return;

    try {
      const { supabase } = await import('@/lib/supabase');
      const { data } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', parseInt(eventId))
        .eq('user_email', supabaseUser.email)
        .eq('registration_status', 'registered')
        .single();

      setIsRegistered(!!data);
    } catch (err) {
      // User not registered yet
      setIsRegistered(false);
    }
  };

  const handleRegister = () => {
    if (!event) return;

    // Check if user is signed in
    if (!isSignedIn) {
      // Redirect to sign-in for non-authenticated users
      window.location.href = '/?page=sign-in';
      return;
    }

    // Wait for user data to load
    if (syncLoading || !supabaseUser) {
      return;
    }

    // Check if user can register for this event tier
    const eventTier = event.tier.toLowerCase() as EventTier;
    const userTier = supabaseUser.tier as UserTier;

    if (!canRegisterForEvent(userTier, eventTier)) {
      // User cannot register - redirect to premium page
      const redirectReason = getRedirectReason('register', userTier, eventTier);
      router.push(`/?page=premium&reason=${redirectReason}`);
      return;
    }

    // User can register - proceed with registration
    handleEventRegistration();
  };

  const handleEventRegistration = async () => {
    if (!event || !supabaseUser?.email) {
      console.error('Missing event or user email');
      return;
    }

    setRegistering(true);

    try {
      const result = await registerUserForEvent(
        event.UUID, // UUID is already a number
        supabaseUser.email
      );

      if (result.success) {
        setIsRegistered(true);
        alert(`✅ Successfully registered for "${event.title}"!\n\nRegistration confirmation will be sent to your email.`);
        // Refresh registration status
        await checkRegistrationStatus();
      } else {
        // Handle different error types properly
        let errorMessage = 'Registration failed';
        
        if (typeof result.error === 'string') {
          errorMessage = result.error;
        } else if (result.error?.message) {
          errorMessage = result.error.message;
        } else if (result.error?.code) {
          errorMessage = `Database error: ${result.error.code}`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Properly handle different error types
      let errorMessage = 'Failed to register for event';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = typeof error.error === 'string' ? error.error : 'Registration failed';
      }
      
      alert(`❌ Registration failed: ${errorMessage}`);
    } finally {
      setRegistering(false);
    }
  };

  const getRegisterButtonText = (): string => {
    if (!isSignedIn) {
      return 'Sign In to Register';
    }

    if (syncLoading || !supabaseUser) {
      return 'Loading...';
    }

    if (registering) {
      return 'Registering...';
    }

    if (isRegistered) {
      return '✅ Already Registered';
    }

    if (!event) {
      return 'Register for Event';
    }

    const eventTier = event.tier.toLowerCase() as EventTier;
    const userTier = supabaseUser.tier as UserTier;

    if (!canRegisterForEvent(userTier, eventTier)) {
      return `Upgrade to Register`;
    }

    return 'Register for Event';
  };

  const getRegisterButtonStyle = (): string => {
    const baseStyle = "flex-1 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg";
    
    if (isRegistered) {
      return `${baseStyle} bg-green-500 text-white cursor-not-allowed opacity-75`;
    }

    if (registering) {
      return `${baseStyle} bg-gray-400 text-white cursor-not-allowed`;
    }
    
    if (!isSignedIn || syncLoading || !supabaseUser) {
      return `${baseStyle} bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white`;
    }

    if (!event) {
      return `${baseStyle} bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white`;
    }

    const eventTier = event.tier.toLowerCase() as EventTier;
    const userTier = supabaseUser.tier as UserTier;

    if (!canRegisterForEvent(userTier, eventTier)) {
      // Show upgrade styling
      return `${baseStyle} bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white`;
    }

    // Standard registration styling
    return `${baseStyle} bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBD';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatTime = (timeString: string) => {
    // Add null/undefined check
    if (!timeString || timeString === null || timeString === undefined) {
      return 'Time TBD';
    }

    try {
      // Ensure timeString is a string and contains ':'
      const timeStr = String(timeString);
      if (!timeStr.includes(':')) {
        return 'Invalid Time';
      }

      const [hours, minutes] = timeStr.split(":");
      const hour24 = parseInt(hours);
      
      // Check if parsing was successful
      if (isNaN(hour24)) {
        return 'Invalid Time';
      }

      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? "PM" : "AM";
      return `${hour12}:${minutes || '00'} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-xl mb-8"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-red-900 mb-2">Event Not Found</h3>
              <p className="text-red-700 mb-4">{error || 'The event you are looking for does not exist.'}</p>
              <button 
                onClick={() => router.push('/?page=events')}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Event Image */}
          <div className="relative h-64 md:h-96">
            <img
              src={
                event.image_url ||
                "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              }
              alt={event.title}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay with badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Tier Badge */}
            <div className="absolute top-6 left-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTierColor(event.tier)}`}>
                {event.tier.charAt(0).toUpperCase() + event.tier.slice(1)} Event
              </span>
            </div>

            {/* Online/Offline Badge */}
            <div className="absolute top-6 right-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                event.is_online
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}>
                {event.is_online ? "Online Event" : "In-Person Event"}
              </span>
            </div>

            {/* Registration Status Badge */}
            {isRegistered && (
              <div className="absolute bottom-6 right-6">
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  ✅ You're Registered
                </span>
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Event Title and Category */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full">
                {event.Catogory}
              </span>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">
                  {event.price === 0 ? "Free" : `${event.Currency} ${event.price}`}
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {event.title}
            </h1>

            {/* Registration Status Notice */}
            {isRegistered && supabaseUser && (
              <div className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm text-green-800 font-medium">
                        ✅ You're registered for this event!
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Registered as: {supabaseUser.first_name} {supabaseUser.last_name} ({supabaseUser.email})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tier Access Notice */}
            {isSignedIn && supabaseUser && !syncLoading && !isRegistered && (
              <div className="mb-6">
                {canRegisterForEvent(supabaseUser.tier as UserTier, event.tier.toLowerCase() as EventTier) ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-green-800">
                        ✅ You can register for this {getTierDisplayName(event.tier.toLowerCase() as EventTier)} event with your {getTierDisplayName(supabaseUser.tier as UserTier)} plan
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm text-yellow-800 font-medium">Upgrade Required</p>
                        <p className="text-xs text-yellow-700 mt-1">
                          This {getTierDisplayName(event.tier.toLowerCase() as EventTier)} event requires {getTierDisplayName(event.tier.toLowerCase() as EventTier)} or higher plan. Your current plan: {getTierDisplayName(supabaseUser.tier as UserTier)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Event Date and Time */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(event.event_date)}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold text-gray-900">
                    {formatTime(event.starting_time)} - {formatTime(event.ending_time)}
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center p-4 bg-gray-50 rounded-xl mb-8">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold text-gray-900">
                  {event.is_online
                    ? "Online Event"
                    : event.venue_name || event.Address || "Location TBD"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About This Event</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Event Capacity</h4>
                  <p className="text-gray-600">Maximum {event.max_attendees} attendees</p>
                </div>
                
                {event.Agerestriction && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Age Restriction</h4>
                    <p className="text-gray-600">{event.Agerestriction}</p>
                  </div>
                )}

                {event.reg_deadline && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Registration Deadline</h4>
                    <p className="text-gray-600">{formatDate(event.reg_deadline)}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {event.contact_email && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Email</h4>
                    <p className="text-gray-600">{event.contact_email}</p>
                  </div>
                )}

                {event.contact_phone && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Phone</h4>
                    <p className="text-gray-600">{event.contact_phone}</p>
                  </div>
                )}

                {event.requirements && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                    <p className="text-gray-600">{event.requirements}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {event.tags && (
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {event.tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleRegister}
                className={getRegisterButtonStyle()}
                disabled={syncLoading || registering || isRegistered}
              >
                {getRegisterButtonText()}
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-colors duration-200">
                Share Event
              </button>
            </div>

            {/* User Profile Info for Registration */}
            {isSignedIn && supabaseUser && !isRegistered && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">🎫 Registration Details</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Name:</strong> {supabaseUser.first_name} {supabaseUser.last_name}</p>
                  <p><strong>Email:</strong> {supabaseUser.email}</p>
                  <p><strong>Plan:</strong> {getTierDisplayName(supabaseUser.tier as UserTier)}</p>
                  <p className="text-xs text-blue-600 mt-2">
                    ℹ️ Your registration will use the above profile information
                  </p>
                </div>
              </div>
            )}

            {/* Event ID for debugging */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Event UUID: {event.UUID}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetailsPage;