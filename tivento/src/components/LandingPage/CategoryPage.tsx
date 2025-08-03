'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';
import EventCard from '@/components/EventPage/EventCard';
import { supabase } from '@/lib/supabase';
import { Event } from '@/components/EventPage/Supabase'; // Import the correct Event interface

interface CategoryStats {
  totalEvents: number;
  uniqueGroups: number;
}

const CategoryPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryName = searchParams?.get('name');
  const displayName = searchParams?.get('displayName');
  
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<CategoryStats>({ totalEvents: 0, uniqueGroups: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryName) {
      fetchCategoryData();
    }
  }, [categoryName]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      
      // Fetch events by category
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('category', categoryName)
        .order('starting_time', { ascending: true });

      if (eventsError) throw eventsError;

      // Count unique groups in this category
      const { data: groupsData, error: groupsError } = await supabase
        .from('events')
        .select('group')
        .eq('category', categoryName)
        .not('group', 'is', null);

      if (groupsError) throw groupsError;

      const uniqueGroups = new Set(groupsData?.map(item => item.group)).size;
      
      setEvents(eventsData || []);
      setStats({
        totalEvents: eventsData?.length || 0,
        uniqueGroups
      });
    } catch (err: any) {
      console.error('Error fetching category data:', err);
      setError('Failed to load category data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading category data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !categoryName) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The category you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <div className="mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center text-orange-600 hover:text-orange-700 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Categories
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {displayName || categoryName}
            </h1>
            <div className="flex justify-center space-x-8 text-lg">
              <div className="text-gray-600">
                <span className="font-semibold text-orange-600">{events.length}</span> Events
              </div>
              <div className="text-gray-600">
                <span className="font-semibold text-orange-600">{stats.uniqueGroups}</span> Groups
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.UUID} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600">There are currently no events in this category.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;