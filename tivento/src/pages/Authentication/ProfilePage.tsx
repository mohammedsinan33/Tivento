'use client';

import { useUser, UserProfile } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  console.log('ProfilePage rendered - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);

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
              onClick={() => router.push('/sign-in')}
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              Manage your Tivento profile below
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
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
        </div>
      </div>
      <Footer />
    </div>
  );
}