'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link href="/?page=events" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200">
              Explore Events
            </Link>
            <Link href="/create-group" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200">
              Create a group
            </Link>
            <Link href="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200">
              Log in
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none focus:text-orange-600"
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
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link href="/?page=events" className="text-gray-700 hover:text-orange-600 font-medium py-2">
                Explore Events
              </Link>
              <Link href="/create-group" className="text-gray-700 hover:text-orange-600 font-medium py-2">
                Create a group
              </Link>
              <Link href="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium text-center">
                Log in
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;