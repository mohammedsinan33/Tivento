'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  const handleNavigation = (page: string) => {
    router.push(`/?page=${page}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              Tivento
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('events')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Events
            </button>
            <button
              onClick={() => handleNavigation('categories')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Categories
            </button>
            {isSignedIn && (
              <button
                onClick={() => handleNavigation('create-event')}
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                Create Event
              </button>
            )}
            <button
              onClick={() => handleNavigation('premium')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Premium
            </button>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                {/* User Profile Link */}
                <button
                  onClick={() => handleNavigation('profile')}
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Profile
                </button>
                {/* My Events Link */}
                <button
                  onClick={() => handleNavigation('my-events')}
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  My Events
                </button>
                {/* User Button with Avatar */}
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "shadow-lg",
                      userButtonPopoverActionButton: "hover:bg-orange-50"
                    }
                  }}
                  showName={false}
                  userProfileMode="navigation"
                  userProfileUrl="/?page=profile"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <button className="text-gray-700 hover:text-orange-600 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <button
                onClick={() => handleNavigation('events')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
              >
                Events
              </button>
              <button
                onClick={() => handleNavigation('categories')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
              >
                Categories
              </button>
              {isSignedIn && (
                <button
                  onClick={() => handleNavigation('create-event')}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                >
                  Create Event
                </button>
              )}
              <button
                onClick={() => handleNavigation('premium')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
              >
                Premium
              </button>
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4">
                {isSignedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8"
                          }
                        }}
                        showName={false}
                      />
                      <span className="text-gray-900 font-medium">
                        {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavigation('profile')}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleNavigation('my-events')}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                    >
                      My Events
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <SignInButton mode="modal">
                      <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="block w-full text-left px-3 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-md">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;