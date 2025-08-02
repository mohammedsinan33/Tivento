'use client';

import React, { useState } from 'react';
import { Event } from '@/components/EventPage/Supabase';

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'location', label: 'Location' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'silver': return 'bg-gray-200 text-gray-900';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h3>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {event.tags && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {event.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {event.requirements && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">What to Bring</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.requirements}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Event Type</h4>
                  <p className="text-gray-700">{event.is_online ? 'Online Event' : 'In-Person Event'}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Category</h4>
                  <p className="text-gray-700">{event.Catogory}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Tier</h4>
                  <p className="text-gray-700 capitalize">{event.tier}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Max Attendees</h4>
                  <p className="text-gray-700">{event.max_attendees}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Price</h4>
                  <p className="text-gray-700 text-2xl font-bold text-orange-600">
                    {event.price === 0 ? 'Free' : `$${event.price} ${event.Currency}`}
                  </p>
                </div>
                
                {event.reg_deadline && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Registration Deadline</h4>
                    <p className="text-gray-700">
                      {new Date(event.reg_deadline).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Age Restriction</h4>
                  <p className="text-gray-700 capitalize">{event.Agerestriction || 'All ages'}</p>
                </div>
              </div>
            </div>

            {(event.contact_email || event.contact_phone) && (
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  {event.contact_email && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${event.contact_email}`} className="text-orange-600 hover:text-orange-700">
                        {event.contact_email}
                      </a>
                    </div>
                  )}
                  {event.contact_phone && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${event.contact_phone}`} className="text-orange-600 hover:text-orange-700">
                        {event.contact_phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-6">
            {event.is_online ? (
              <div className="text-center py-8">
                <div className="bg-blue-50 rounded-2xl p-8">
                  <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Online Event</h3>
                  <p className="text-blue-700 mb-4">
                    This is an online event. Meeting details will be provided after registration.
                  </p>
                  
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Event Location</h3>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <svg className="w-6 h-6 text-orange-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      {event.venue_name && (
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">{event.venue_name}</h4>
                      )}
                      {event.Address && (
                        <p className="text-gray-700 mb-4">{event.Address}</p>
                      )}
                      {event.Address && (
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(event.Address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                        >
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View on Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;