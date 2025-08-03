'use client';

import React, { useState } from 'react';
import { useUser, UserProfile } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';
import MyRegistrations from './MyRegistrations';
import MyEvents from './MyEvents';

const ProfilePage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'registered' | 'created'>('profile');

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Please sign in to view your profile
            </h1>
            <p className="text-gray-600 mb-6">
              You need to be signed in to access your profile page.
            </p>
            <button
              onClick={() => router.push('/?page=sign-in')}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200"
            >
              Sign In
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Welcome Message */}
        <div className="mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4">
          <div className="text-white text-center">
            <h2 className="text-xl font-semibold">
              Welcome, {user.firstName || user.username || 'User'}!
            </h2>
            <p className="text-orange-100">
              Manage your Tivento profile and events below
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </div>
              </button>
              <button
                onClick={() => setActiveTab('registered')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                  activeTab === 'registered'
                    ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  My Registrations
                </div>
              </button>
              <button
                onClick={() => setActiveTab('created')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                  activeTab === 'created'
                    ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  My Events
                </div>
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  My Profile
                </h1>
                <UserProfile 
                  routing="hash"
                  appearance={{
                    elements: {
                      card: "shadow-none",
                      navbar: "bg-orange-50",
                      navbarButton: "text-orange-600 hover:bg-orange-100",
                      formButtonPrimary: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
                    },
                  }}
                />
              </div>
            )}

            {/* Registered Events Tab */}
            {activeTab === 'registered' && (
              <div>
                <MyRegistrations />
              </div>
            )}

            {/* Created Events Tab */}
            {activeTab === 'created' && (
              <div>
                <MyEvents />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;