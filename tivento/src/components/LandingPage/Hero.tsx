'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface SearchSuggestion {
  type: 'event' | 'category' | 'group' | 'location';
  value: string;
  count?: number;
}

const Hero = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const keywordInputRef = useRef<HTMLInputElement>(null);

  // Fetch all events on component mount for suggestions
  useEffect(() => {
    fetchAllEvents();
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchAllEvents = async () => {
    try {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('title, category, venue_name, Address, group')
        .limit(1000);

      if (error) throw error;
      setAllEvents(eventsData || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const generateSuggestions = (searchTerm: string): SearchSuggestion[] => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();
    const suggestionMap = new Map<string, SearchSuggestion>();

    // Add event title suggestions
    allEvents.forEach(event => {
      if (event.title && event.title.toLowerCase().includes(lowerSearchTerm)) {
        const key = `event_${event.title}`;
        if (!suggestionMap.has(key)) {
          suggestionMap.set(key, {
            type: 'event',
            value: event.title,
            count: 1
          });
        } else {
          suggestionMap.get(key)!.count!++;
        }
      }
    });

    // Add category suggestions
    const categoryCount = new Map<string, number>();
    allEvents.forEach(event => {
      if (event.category && event.category.toLowerCase().includes(lowerSearchTerm)) {
        const category = event.category;
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      }
    });

    categoryCount.forEach((count, category) => {
      suggestionMap.set(`category_${category}`, {
        type: 'category',
        value: category,
        count
      });
    });

    // Add group suggestions
    const groupCount = new Map<string, number>();
    allEvents.forEach(event => {
      if (event.group && event.group.toLowerCase().includes(lowerSearchTerm)) {
        const group = event.group;
        groupCount.set(group, (groupCount.get(group) || 0) + 1);
      }
    });

    groupCount.forEach((count, group) => {
      suggestionMap.set(`group_${group}`, {
        type: 'group',
        value: group,
        count
      });
    });

    // Add location suggestions (using venue_name and Address)
    const locationCount = new Map<string, number>();
    allEvents.forEach(event => {
      // Check venue_name
      if (event.venue_name && event.venue_name.toLowerCase().includes(lowerSearchTerm)) {
        const location = event.venue_name;
        locationCount.set(location, (locationCount.get(location) || 0) + 1);
      }
      // Check Address
      if (event.Address && event.Address.toLowerCase().includes(lowerSearchTerm)) {
        const location = event.Address;
        locationCount.set(location, (locationCount.get(location) || 0) + 1);
      }
    });

    locationCount.forEach((count, location) => {
      suggestionMap.set(`location_${location}`, {
        type: 'location',
        value: location,
        count
      });
    });

    // Convert to array and sort by relevance and count
    return Array.from(suggestionMap.values())
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.value.toLowerCase().startsWith(lowerSearchTerm);
        const bExact = b.value.toLowerCase().startsWith(lowerSearchTerm);
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then sort by count
        return (b.count || 0) - (a.count || 0);
      })
      .slice(0, 8); // Limit to 8 suggestions
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    
    if (value.length >= 2) {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setKeyword(suggestion.value);
    setShowSuggestions(false);
    
    // Perform search immediately with the suggestion
    performSearch(suggestion.value, location);
  };

  const handlePopularTagClick = (tag: string) => {
    setKeyword(tag);
    performSearch(tag, location);
  };

  const performSearch = (searchKeyword: string, searchLocation: string) => {
    setIsLoading(true);
    
    // Build search query parameters
    const params = new URLSearchParams();
    params.set('page', 'events');
    
    if (searchKeyword.trim()) {
      params.set('search', searchKeyword.trim());
    }
    
    if (searchLocation.trim()) {
      params.set('location', searchLocation.trim());
    }

    // Navigate to events page with search parameters
    router.push(`/?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() && !location.trim()) {
      // If no search terms, just go to events page
      router.push('/?page=events');
      return;
    }
    
    performSearch(keyword, location);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'event':
        return (
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'category':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'group':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'location':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getSuggestionTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Event';
      case 'category': return 'Category';
      case 'group': return 'Group';
      case 'location': return 'Location';
      default: return '';
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl"></div>
      
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><linearGradient id="a" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="%23ff6b35"/><stop offset="1" stop-color="%23f7931e"/></linearGradient></defs><g fill="none"><circle cx="200" cy="200" r="100" fill="url(%23a)" opacity="0.3"/><circle cx="800" cy="300" r="150" fill="url(%23a)" opacity="0.2"/><circle cx="400" cy="700" r="120" fill="url(%23a)" opacity="0.25"/></g></svg>')`
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your People.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Do Your Thing.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            From hiking and tech to book clubs and creative writing, discover events and groups for all your passions.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto relative">
            <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  ref={keywordInputRef}
                  type="text"
                  placeholder="Search for 'Data Science', 'Yoga', 'Board Games'..."
                  value={keyword}
                  onChange={handleKeywordChange}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="w-full px-6 py-4 text-lg border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 mt-1 max-h-80 overflow-y-auto"
                  >
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={`${suggestion.type}_${suggestion.value}_${index}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          {getSuggestionIcon(suggestion.type)}
                          <div>
                            <span className="text-gray-900 font-medium">{suggestion.value}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {getSuggestionTypeLabel(suggestion.type)}
                            </span>
                          </div>
                        </div>
                        {suggestion.count && suggestion.count > 1 && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {suggestion.count} events
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="New York, NY or Online"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-8">
            <p className="text-gray-500 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Technology', 'Health & Wellness', 'Arts & Culture', 'Sports & Fitness', 'Social & Community'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handlePopularTagClick(tag)}
                  className="bg-white/80 hover:bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;