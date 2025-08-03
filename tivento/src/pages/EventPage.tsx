'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';
import PageHeader from '@/components/EventPage/PageHeader';
import EventFilters from '@/components/EventPage/EventFilters';
import EventList from '@/components/EventPage/EventList';
import { 
  getAllEvents, 
  Event 
} from '@/components/EventPage/Supabase';

const EventPage = () => {
  const searchParams = useSearchParams();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTier, setSelectedTier] = useState('All Tiers');
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlSearch = searchParams?.get('search') || '';
    const urlLocation = searchParams?.get('location') || '';
    const urlCategory = searchParams?.get('category') || '';
    
    // Set initial search term from URL
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
    
    // Set initial category from URL
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
    
    // Handle location parameter - you might want to add location filtering later
    // For now, we'll include it in the search term if no specific search was provided
    if (urlLocation && !urlSearch) {
      setSearchTerm(urlLocation);
    }
  }, [searchParams]);

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

    

    // Apply search filter first
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(event => {
        // Cast event to any to access fields that might not be in the interface
        const eventWithExtraFields = event as any;
        
        return (
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          (event.tags && event.tags.toLowerCase().includes(searchLower)) ||
          // Also search in location fields
          (event.venue_name && event.venue_name.toLowerCase().includes(searchLower)) ||
          (event.Address && event.Address.toLowerCase().includes(searchLower)) ||
          // Search in group field (using type assertion)
          (eventWithExtraFields.group && eventWithExtraFields.group.toLowerCase().includes(searchLower)) ||
          // Search in category field (using type assertion for different possible field names)
          (eventWithExtraFields.category && eventWithExtraFields.category.toLowerCase().includes(searchLower))
        );
      });
      
    }

    // Apply category filter - Using the property that actually works
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(event => {
        // Use bracket notation to access 'category' property to avoid TypeScript error
        const eventCategory = (event as any).category || event.Catogory || '';
        const normalizedEventCategory = eventCategory.toLowerCase().trim();
        const normalizedSelectedCategory = selectedCategory.toLowerCase().trim();
        
        
        return normalizedEventCategory === normalizedSelectedCategory;
      });
    
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
  
    }


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
      </main>
      
      <Footer />
    </div>
  );
};

export default EventPage;