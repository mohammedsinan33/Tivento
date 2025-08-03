'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/EventPage/PageHeader';
import EventFilters from '@/components/EventPage/EventFilters';
import EventList from '@/components/EventPage/EventList';
import { 
  getAllEvents, 
  Event 
} from '@/components/EventPage/Supabase';

const EventPage = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTier, setSelectedTier] = useState('All Tiers');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data, error } = await getAllEvents();
        if (error) {
          console.error('Error fetching events:', error);
          setError('Failed to load events');
        } else {
          setAllEvents(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [allEvents, selectedCategory, selectedTier, searchTerm]);

  const applyFilters = () => {
    let filtered = [...allEvents];

    console.log('Applying filters:', {
      selectedCategory,
      selectedTier,
      searchTerm,
      totalEvents: allEvents.length
    });

    // Apply search filter first
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        (event.tags && event.tags.toLowerCase().includes(searchLower))
      );
      console.log('After search filter:', filtered.length);
    }

    // Apply category filter - Using the property that actually works
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(event => {
        // Use bracket notation to access 'category' property to avoid TypeScript error
        const eventCategory = (event as any).category || event.Catogory || '';
        const normalizedEventCategory = eventCategory.toLowerCase().trim();
        const normalizedSelectedCategory = selectedCategory.toLowerCase().trim();
        
        console.log('Category comparison:', {
          eventCategory,
          normalizedEventCategory,
          selectedCategory,
          normalizedSelectedCategory,
          matches: normalizedEventCategory === normalizedSelectedCategory
        });
        
        return normalizedEventCategory === normalizedSelectedCategory;
      });
      console.log('After category filter:', filtered.length);
    }

    // Apply tier filter
    if (selectedTier !== 'All Tiers') {
      const tierHierarchy: { [key: string]: string[] } = {
        'free': ['free'],
        'silver': ['free', 'silver'],
        'gold': ['free', 'silver', 'gold'],
        'platinum': ['free', 'silver', 'gold', 'platinum']
      };
      
      const allowedTiers = tierHierarchy[selectedTier] || ['free'];
      filtered = filtered.filter(event => allowedTiers.includes(event.tier));
      console.log('After tier filter:', filtered.length);
    }

    console.log('Final filtered events:', filtered.length);
    setFilteredEvents(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleTierChange = (tier: string) => {
    setSelectedTier(tier);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedTier('All Tiers');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader 
          totalEvents={allEvents.length}
          filteredEvents={filteredEvents.length}
        />
        
        <EventFilters
          selectedCategory={selectedCategory}
          selectedTier={selectedTier}
          searchTerm={searchTerm}
          onCategoryChange={handleCategoryChange}
          onTierChange={handleTierChange}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
        />
        
        <EventList
          events={filteredEvents}
          loading={loading}
          error={error}
        />
        
        {/* Load More Button */}
        {!loading && filteredEvents.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
              Load More Events
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EventPage;