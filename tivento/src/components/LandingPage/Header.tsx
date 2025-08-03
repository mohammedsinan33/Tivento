'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useUserSync } from '@/pages/Authentication/useUserSync';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const { isSignedIn, user, isLoaded } = useUser();
  const { supabaseUser, syncLoading } = useUserSync();

  // Fetch event invitations
  const fetchNotifications = async () => {
    if (!supabaseUser?.email) return;

    try {
      const { data, error } = await supabase
        .from('event_invitations')
        .select(`
          *,
          events (
            UUID,
            title,
            event_date,
            starting_time
          )
        `)
        .eq('invited_email', supabaseUser.email)
        .eq('invitation_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data || []);
        setNotificationCount(data?.length || 0);
      }
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
    }
  };

  useEffect(() => {
    if (supabaseUser?.email) {
      fetchNotifications();
      // Set up real-time subscription for new invitations
      const subscription = supabase
        .channel('event_invitations')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'event_invitations' },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [supabaseUser?.email]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'silver':
        return 'bg-gray-200 text-gray-900';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'free':
        return '🆓';
      case 'silver':
        return '🥈';
      case 'gold':
        return '🥇';
      case 'platinum':
        return '💎';
      default:
        return '🆓';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Tivento</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Home
            </Link>
            <Link href="/?page=events" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Events
            </Link>
            <Link href="/?page=create-event" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Create Event
            </Link>
            {isSignedIn && (
              <Link href="/?page=profile" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Profile
              </Link>
            )}
            <Link href="/?page=premium" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 relative">
              Premium
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </span>
            </Link>
          </nav>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {!isLoaded ? (
              // Loading state
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isSignedIn ? (
              // Signed in state
              <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                {notificationCount > 0 && (
                  <div className="relative notification-dropdown">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </button>
                    
                    {/* Notification Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900">Event Invitations</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              No new invitations
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      New event invitation
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {notification.events?.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {formatNotificationTime(notification.created_at)}
                                    </p>
                                  </div>
                                  <Link
                                    href="/?page=invited-events"
                                    onClick={() => setShowNotifications(false)}
                                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                  >
                                    View
                                  </Link>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <div className="p-4 border-t border-gray-200">
                            <Link
                              href="/?page=invited-events"
                              onClick={() => setShowNotifications(false)}
                              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                            >
                              View all invitations →
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 hidden sm:block">
                    Welcome, {user.firstName || user.username}!
                  </span>
                  {supabaseUser && (
                    <div className="flex items-center space-x-2">
                      {/* Clickable Tier Badge - Desktop */}
                      <Link href="/?page=premium" className="hover:opacity-80 transition-opacity duration-200">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getTierColor(supabaseUser.tier)}`}>
                          <span className="mr-1">{getTierIcon(supabaseUser.tier)}</span>
                          {supabaseUser.tier.charAt(0).toUpperCase() + supabaseUser.tier.slice(1)}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}

                />
              </div>
            ) : (
              // Signed out state
              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Home
              </Link>
              <Link href="/?page=events" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Events
              </Link>
              <Link href="/?page=create-event" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Create Event
              </Link>
              <Link href="/?page=premium" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Premium
              </Link>
              {isSignedIn && (
                <Link href="/?page=profile" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Profile
                </Link>
              )}
              
              {/* Mobile Notifications */}
              {isSignedIn && notificationCount > 0 && (
                <Link href="/?page=invited-events" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center">
                  <span>Event Invitations</span>
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                </Link>
              )}
              
              {/* Mobile user info */}
              {isSignedIn && supabaseUser && (
                <div className="pt-4 border-t border-gray-100">
                  {/* Clickable Tier Badge - Mobile */}
                  <Link href="/?page=premium" className="hover:opacity-80 transition-opacity duration-200">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getTierColor(supabaseUser.tier)}`}>
                      <span className="mr-1">{getTierIcon(supabaseUser.tier)}</span>
                      {supabaseUser.tier.charAt(0).toUpperCase() + supabaseUser.tier.slice(1)}
                    </span>
                  </Link>
                </div>
              )}
              
              {!isLoaded ? null : !isSignedIn && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                  <SignInButton mode="modal">
                    <button className="text-left text-gray-600 hover:text-gray-900 transition-colors duration-200">
                      Log in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="text-left bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 w-fit">
                      Sign up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
            
            {/* Mobile Premium CTA */}
            {isMenuOpen && isSignedIn && supabaseUser && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Current Plan</h4>
                      {/* Another Clickable Tier Badge in Mobile CTA */}
                      <Link href="/?page=premium" className="hover:opacity-80 transition-opacity duration-200">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer mt-1 ${getTierColor(supabaseUser.tier)}`}>
                          <span className="mr-1">{getTierIcon(supabaseUser.tier)}</span>
                          {supabaseUser.tier.charAt(0).toUpperCase() + supabaseUser.tier.slice(1)} Member
                        </span>
                      </Link>
                    </div>
                    <Link href="/?page=premium">
                      <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200">
                        Upgrade
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;