'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <button
              onClick={() => handleNavigation('create-event')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Create Event
            </button>
            <button
              onClick={() => handleNavigation('premium')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Premium
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleNavigation('sign-in')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavigation('sign-up')}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Sign Up
            </button>
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
              <button
                onClick={() => handleNavigation('create-event')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
              >
                Create Event
              </button>
              <button
                onClick={() => handleNavigation('premium')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
              >
                Premium
              </button>
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => handleNavigation('sign-in')}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigation('sign-up')}
                  className="block w-full text-left px-3 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-md mt-2"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;