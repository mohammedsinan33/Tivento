'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useUserSync } from '@/pages/Authentication/useUserSync';
import { canCreateEvents } from '@/lib/tierUtils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const { supabaseUser, syncLoading } = useUserSync();

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
            <Link href={getCreateEventLink()} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
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
                  afterSignOutUrl="/"
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
              <Link href={getCreateEventLink()} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
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