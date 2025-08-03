'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useUserSync } from '@/pages/Authentication/useUserSync';
import { canCreateEvents } from '@/lib/tierUtils';
import { getUserNotifications, markNotificationAsRead, UserNotification } from '@/components/EventForm/Supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const { supabaseUser, syncLoading } = useUserSync();

  // Fetch notifications when user is loaded
  useEffect(() => {
    if (supabaseUser?.email) {
      fetchNotifications();
    }
  }, [supabaseUser?.email]);

  const fetchNotifications = async () => {
    if (!supabaseUser?.email) return;
    
    setNotificationLoading(true);
    try {
      const { data, error } = await getUserNotifications(supabaseUser.email);
      if (!error && data) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleNotificationClick = async (notification: UserNotification) => {
    if (!notification.is_read && notification.id) {
      await markNotificationAsRead(notification.id);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
    }
    
    // Close notification panel
    setIsNotificationOpen(false);
    
    // Navigate based on notification type
    if (notification.related_event_id) {
      window.location.href = `/?page=event-details&id=${notification.related_event_id}`;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

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

  // Determine the Create Event link based on user tier
  const getCreateEventLink = () => {
    if (!isSignedIn || !supabaseUser) {
      return '/?page=premium&reason=create-event&redirect=sign-in';
    }
    
    if (!canCreateEvents(supabaseUser.tier as any)) {
      return '/?page=premium&reason=create-event';
    }
    
    return '/?page=create-event';
  };

  const formatNotificationTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-orange-500">Tivento</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors duration-200">
              Home
            </Link>
            <Link href="/?page=events" className="text-gray-700 hover:text-orange-500 transition-colors duration-200">
              Events
            </Link>
            <Link href={getCreateEventLink()} className="text-gray-700 hover:text-orange-500 transition-colors duration-200">
              Create Event
            </Link>
            <Link href="/?page=premium" className="text-gray-700 hover:text-orange-500 transition-colors duration-200">
              Premium
            </Link>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isLoaded && isSignedIn ? (
              <div className="flex items-center space-x-4">
                {/* Notifications Bell */}
                {supabaseUser && (
                  <div className="relative">
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {isNotificationOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <p className="text-sm text-gray-600">{unreadCount} unread</p>
                          )}
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                          {notificationLoading ? (
                            <div className="p-4 text-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                              <p className="text-sm text-gray-600 mt-2">Loading notifications...</p>
                            </div>
                          ) : notifications.length === 0 ? (
                            <div className="p-4 text-center">
                              <p className="text-gray-600">No notifications yet</p>
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                                  !notification.is_read ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                    !notification.is_read ? 'bg-blue-500' : 'bg-gray-300'
                                  }`}></div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-medium ${
                                      !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                                    }`}>
                                      {notification.title}
                                    </h4>
                                    <p className={`text-sm mt-1 ${
                                      !notification.is_read ? 'text-gray-700' : 'text-gray-600'
                                    }`}>
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {notification.created_at && formatNotificationTime(notification.created_at)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        
                        {notifications.length > 0 && (
                          <div className="p-3 border-t border-gray-200 text-center">
                            <button
                              onClick={() => setIsNotificationOpen(false)}
                              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* User Info */}
                <div className="flex items-center space-x-3">
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
                  afterSignOutUrl="/"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <button className="text-gray-700 hover:text-orange-500 transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" className="block text-gray-700 hover:text-orange-500 transition-colors duration-200 py-2">
              Home
            </Link>
            <Link href="/?page=events" className="block text-gray-700 hover:text-orange-500 transition-colors duration-200 py-2">
              Events
            </Link>
            <Link href={getCreateEventLink()} className="block text-gray-700 hover:text-orange-500 transition-colors duration-200 py-2">
              Create Event
            </Link>
            <Link href="/?page=premium" className="block text-gray-700 hover:text-orange-500 transition-colors duration-200 py-2">
              Premium
            </Link>
            
            {/* Mobile Tier Badge */}
            {supabaseUser && (
              <div className="pt-2">
                <Link href="/?page=premium" className="inline-block hover:opacity-80 transition-opacity duration-200">
                  <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium cursor-pointer ${getTierColor(supabaseUser.tier)}`}>
                    <span className="mr-2">{getTierIcon(supabaseUser.tier)}</span>
                    {supabaseUser.tier.charAt(0).toUpperCase() + supabaseUser.tier.slice(1)} Plan
                  </span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close notifications */}
      {isNotificationOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsNotificationOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;