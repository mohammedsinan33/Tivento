'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useUserSync } from '@/pages/Authentication/useUserSync';
import { canRegisterForEvent } from '@/lib/tierUtils';

const UpcomingEvents = () => {
  const { isSignedIn } = useUser();
  const { supabaseUser } = useUserSync();

  const events = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 15',
      time: '7:00 PM',
      title: 'Tech Startup Networking',
      groupName: 'Innovation Hub',
      attendees: 24,
      tier: 'Free'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 18',
      time: '9:00 AM',
      title: 'Mountain Hiking Adventure',
      groupName: 'Outdoor Enthusiasts',
      attendees: 12,
      tier: 'Silver'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 20',
      time: '6:30 PM',
      title: 'Photography Workshop',
      groupName: 'Creative Lens Society',
      attendees: 15,
      tier: 'Gold'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 22',
      time: '2:00 PM',
      title: 'Gourmet Cooking Class',
      groupName: 'Culinary Masters',
      attendees: 8,
      tier: 'Free'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 25',
      time: '10:00 AM',
      title: 'Morning Yoga Session',
      groupName: 'Zen Wellness Community',
      attendees: 30,
      tier: 'Platinum'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 28',
      time: '8:00 PM',
      title: 'Board Game Night',
      groupName: 'Game Night Enthusiasts',
      attendees: 18,
      tier: 'Silver'
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Free': return 'bg-gray-100 text-gray-800';
      case 'Silver': return 'bg-gray-200 text-gray-900';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJoinEvent = (event: any) => {
    if (!isSignedIn) {
      window.location.href = `/?page=premium&reason=register-${event.tier.toLowerCase()}&redirect=sign-in`;
      return;
    }

    if (!supabaseUser) {
      return; // Wait for user data to load
    }

    const eventTier = event.tier.toLowerCase() as 'free' | 'silver' | 'gold' | 'platinum';
    const userTier = supabaseUser.tier as 'free' | 'silver' | 'gold' | 'platinum';

    if (!canRegisterForEvent(userTier, eventTier)) {
      window.location.href = `/?page=premium&reason=register-${eventTier}`;
      return;
    }

    // User can register - implement actual registration logic here
    alert(`Registration for ${event.title} would be implemented here!`);
  };

  const getJoinButtonText = (event: any) => {
    if (!isSignedIn) {
      return 'Sign In to Join';
    }

    if (!supabaseUser) {
      return 'Loading...';
    }

    const eventTier = event.tier.toLowerCase() as 'free' | 'silver' | 'gold' | 'platinum';
    const userTier = supabaseUser.tier as 'free' | 'silver' | 'gold' | 'platinum';

    if (!canRegisterForEvent(userTier, eventTier)) {
      return 'Upgrade to Join';
    }

    return 'Join Event';
  };

  const getJoinButtonColor = (event: any) => {
    if (!isSignedIn || !supabaseUser) {
      return 'text-orange-600 hover:text-orange-700';
    }

    const eventTier = event.tier.toLowerCase() as 'free' | 'silver' | 'gold' | 'platinum';
    const userTier = supabaseUser.tier as 'free' | 'silver' | 'gold' | 'platinum';

    if (!canRegisterForEvent(userTier, eventTier)) {
      return 'text-red-600 hover:text-red-700';
    }

    return 'text-orange-600 hover:text-orange-700';
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join these exciting events happening near you. Connect with like-minded people and explore new experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(event.tier)}`}>
                    {event.tier}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                  <div className="text-orange-600 font-bold text-lg">{event.date}</div>
                  <div className="text-gray-600 text-sm">{event.time}</div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4">{event.groupName}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm">{event.attendees} attending</span>
                  </div>
                  <button 
                    onClick={() => handleJoinEvent(event)}
                    className={`font-medium text-sm transition-colors duration-200 ${getJoinButtonColor(event)}`}
                  >
                    {getJoinButtonText(event)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/?page=events">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
            See more events
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;