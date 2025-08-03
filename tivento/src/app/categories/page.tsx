'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';
import { supabase } from '@/lib/supabase';

interface CategoryWithStats {
  id: number;
  name: string;
  dbName: string;
  image: string;
  color: string;
  eventCount: number;
  uniqueGroups: number;
}

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseCategoriesData = [
    {
      id: 1,
      name: 'Technology',
      dbName: 'technology',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 2,
      name: 'Outdoors & Adventure',
      dbName: 'outdoors & adventure',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 3,
      name: 'Health & Wellness',
      dbName: 'health & wellness',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 4,
      name: 'Arts & Culture',
      dbName: 'arts & culture',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 5,
      name: 'Social & Community',
      dbName: 'social & community',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 6,
      name: 'Career & Business',
      dbName: 'business & career',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      color: 'from-gray-600 to-gray-800'
    }
  ];

  useEffect(() => {
    fetchCategoriesWithStats();
  }, []);

  const fetchCategoriesWithStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all events to count by category
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('category, group');

      if (eventsError) throw eventsError;

      // Count events and unique groups for each category
      const categoryStats = baseCategoriesData.map(category => {
        const categoryEvents = eventsData?.filter(event => 
          event.category?.toLowerCase() === category.dbName.toLowerCase()
        ) || [];
        
        const uniqueGroups = new Set(
          categoryEvents
            .filter(event => event.group)
            .map(event => event.group)
        ).size;

        return {
          ...category,
          eventCount: categoryEvents.length,
          uniqueGroups
        };
      });

      // Sort by event count in descending order
      const sortedCategories = categoryStats.sort((a, b) => b.eventCount - a.eventCount);
      
      setCategories(sortedCategories);
    } catch (err: any) {
      console.error('Error fetching categories with stats:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: CategoryWithStats) => {
    router.push(`/?page=category&name=${encodeURIComponent(category.dbName)}&displayName=${encodeURIComponent(category.name)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Categories</h2>
            <p className="text-gray-600 mb-6">{error}</p>
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
        {/* Page Header */}
        <div className="mb-12">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-orange-600 hover:text-orange-700 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              All Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore all event categories, sorted by popularity
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={category.id} className="group cursor-pointer" onClick={() => handleCategoryClick(category)}>
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`}></div>
                
                {/* Ranking Badge */}
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">#{index + 1}</span>
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                    {category.name}
                  </h3>
                  <div className="flex justify-between items-center transform group-hover:translate-y-[-4px] transition-transform duration-300 delay-75">
                    <div className="text-white/90 font-medium">
                      <div className="text-lg font-bold">{category.eventCount} Events</div>
                      <div className="text-sm">{category.uniqueGroups} Groups</div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Summary */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Category Statistics</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500">
                {categories.reduce((sum, cat) => sum + cat.eventCount, 0)}
              </div>
              <div className="text-gray-600">Total Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">
                {categories.reduce((sum, cat) => sum + cat.uniqueGroups, 0)}
              </div>
              <div className="text-gray-600">Total Groups</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">
                {categories.length}
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoriesPage;