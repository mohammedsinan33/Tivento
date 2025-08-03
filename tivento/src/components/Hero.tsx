'use client';

import React, { useState } from 'react';

const Hero = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your search logic here
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
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search for 'Data Science', 'Yoga', 'Board Games'..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
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
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-8">
            <p className="text-gray-500 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Photography', 'Hiking', 'Tech Meetup', 'Book Club', 'Yoga'].map((tag) => (
                <button
                  key={tag}
                  className="bg-white/80 hover:bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 shadow-sm"
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