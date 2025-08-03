'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';
import { useUserSync } from '@/lib/auth/useUserSync';
import { supabase } from '@/lib/supabase';

// Event interface
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
  username: string;
}

// Event invitation interface
interface EventInvitation {
  id: number;
  event_id: number;
  invited_email: string;
  invited_by_username: string;
  invitation_status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at?: string;
  event?: Event;
}

const InvitedEventsPage = () => {
  const { supabaseUser } = useUserSync();
  const router = useRouter();
  const [invitations, setInvitations] = useState<EventInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingInvitations, setProcessingInvitations] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (supabaseUser?.email) {
      fetchInvitedEvents();
    }
  }, [supabaseUser]);

  const fetchInvitedEvents = async () => {
    if (!supabaseUser?.email) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_invitations')
        .select(`
          *,
          event:events!inner (
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
            created_at,
            username
          )
        `)
        .eq('invited_email', supabaseUser.email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invited events:', error);
      } else {
        setInvitations(data || []);
      }
    } catch (error) {
      console.error('Error in fetchInvitedEvents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationResponse = async (invitationId: number, status: 'accepted' | 'declined') => {
    setProcessingInvitations(prev => new Set(prev).add(invitationId));

    try {
      // Update invitation status
      const { error: updateError } = await supabase
        .from('event_invitations')
        .update({ 
          invitation_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (updateError) {
        console.error('Error updating invitation:', updateError);
        alert('Failed to update invitation status');
        return;
      }

      // If accepted, add to event registrations
      if (status === 'accepted') {
        const invitation = invitations.find(inv => inv.id === invitationId);
        if (invitation?.event) {
          const { error: registrationError } = await supabase
            .from('event_registrations')
            .insert({
              event_id: invitation.event.UUID,
              user_email: supabaseUser?.email,
              registration_status: 'registered',
              registration_date: new Date().toISOString()
            });

          if (registrationError) {
            console.error('Error creating registration:', registrationError);
            // Don't show error to user since invitation was updated successfully
          }
        }
      }

      // Refresh invitations

    } catch (error) {
      console.error('Error handling invitation response:', error);
      alert('Failed to update invitation status');
    } finally {
      setProcessingInvitations(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitationId);
        return newSet;
      });
    }
  };

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
    switch (tier?.toLowerCase()) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'accepted':
        return "bg-green-100 text-green-800";
      case 'declined':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTierName = (tier?: string) => {
    if (!tier) return 'Free';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const handleEventClick = (eventUUID: number) => {
    router.push(`/?page=event-details&id=${eventUUID}`);
  };

  const pendingInvitations = invitations.filter(inv => inv.invitation_status === 'pending');
  const respondedInvitations = invitations.filter(inv => inv.invitation_status !== 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Page Header */}
        <div className="mb-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6">
          <div className="text-white text-center">
            <h1 className="text-3xl font-bold mb-2">Event Invitations</h1>
            <p className="text-blue-100">
              Manage your exclusive event invitations
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your invitations...</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Invitations</h3>
            <p className="text-gray-600 mb-6">You don't have any event invitations at the moment.</p>
            <button
              onClick={() => router.push('/?page=events')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200"
            >
              Browse Public Events
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending Invitations */}
            {pendingInvitations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Pending Invitations</h2>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pendingInvitations.length} Pending
                  </span>
                </div>

                <div className="grid gap-6">
                  {pendingInvitations.map((invitation) => (
                    <div key={invitation.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-64 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={invitation.event?.image_url || "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                            alt={invitation.event?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {invitation.event?.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Invited by: {invitation.invited_by_username}
                              </p>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(invitation.event?.tier || '')}`}>
                                {formatTierName(invitation.event?.tier)} Event
                              </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invitation.invitation_status)}`}>
                              {invitation.invitation_status.charAt(0).toUpperCase() + invitation.invitation_status.slice(1)}
                            </span>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {invitation.event?.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-6">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(invitation.event?.event_date || '')}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {formatTime(invitation.event?.starting_time || '')}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {invitation.event?.is_online 
                                ? "Online Event" 
                                : invitation.event?.venue_name || invitation.event?.Address || "Location TBD"
                              }
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <button
                              onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                              disabled={processingInvitations.has(invitation.id)}
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingInvitations.has(invitation.id) ? 'Processing...' : '✅ Accept Invitation'}
                            </button>
                            <button
                              onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                              disabled={processingInvitations.has(invitation.id)}
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingInvitations.has(invitation.id) ? 'Processing...' : '❌ Decline'}
                            </button>
                            <button
                              onClick={() => handleEventClick(invitation.event?.UUID || 0)}
                              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Responded Invitations */}
            {respondedInvitations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Previous Responses</h2>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {respondedInvitations.length} Responded
                  </span>
                </div>

                <div className="grid gap-6">
                  {respondedInvitations.map((invitation) => (
                    <div key={invitation.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-64 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 opacity-75">
                          <img
                            src={invitation.event?.image_url || "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                            alt={invitation.event?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {invitation.event?.title}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2">
                                Invited by: {invitation.invited_by_username}
                              </p>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(invitation.event?.tier || '')} opacity-75`}>
                                {formatTierName(invitation.event?.tier)} Event
                              </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invitation.invitation_status)}`}>
                              {invitation.invitation_status.charAt(0).toUpperCase() + invitation.invitation_status.slice(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 mb-4">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(invitation.event?.event_date || '')}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {formatTime(invitation.event?.starting_time || '')}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {invitation.event?.is_online 
                                ? "Online Event" 
                                : invitation.event?.venue_name || invitation.event?.Address || "Location TBD"
                              }
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              Responded on: {formatDate(invitation.updated_at || invitation.created_at)}
                            </p>
                            <button
                              onClick={() => handleEventClick(invitation.event?.UUID || 0)}
                              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default InvitedEventsPage;