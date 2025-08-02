'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventHeader from '@/components/EventDetail/EventHeader';
import EventDetails from '@/components/EventDetail/EventHeader';
import EventRegistration from '@/components/EventDetail/EventRegistration';
import SimilarEvents from '@/components/EventDetail/SimilarEvents';
import { getEventById, Event } from '@/components/EventPage/Supabase';

interface EventDetailPageProps {
  eventId: string;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ eventId }) => {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getEventById(eventId);
        
        if (error) {
          setError('Failed to load event details. Please try again.');
          return;
        }
        
        if (!data) {
          setError('Event not found.');
          return;
        }
        
        setEvent(data);
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-2xl mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
              <div className="h-96 bg-gray-300 rounded-2xl"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Event</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={() => router.back()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventHeader event={event} />
        
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <EventDetails event={event} />
          </div>
          
          <div className="lg:col-span-1">
            <EventRegistration event={event} />
          </div>
        </div>
        
        <SimilarEvents event={event} />
      </main>

      <Footer />
    </div>
  );
};

export default EventDetailPage;