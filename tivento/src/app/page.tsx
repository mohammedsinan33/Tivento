'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LandingPage from '@/pages/LandingPage';
import CreateEventPage from '@/pages/CreateEventPage';
import EventPage from '@/pages/EventPage';
import EventDetailsPage from '@/pages/EventDetailsPage';
import PremiumPage from '@/pages/PremiumPage';
import ProfilePage from '@/components/Authentication/ProfilePage';
import SignInPage from '@/components/Authentication/SignInPage';
import SignUpPage from '@/components/Authentication/SignUpPage';
import InvitedEventsPage from '@/pages/InvitedEventsPage';
import Categories from '@/components/LandingPage/Categories';
import CategoryPage from '@/components/LandingPage/CategoryPage';

function PageContent() {
  const searchParams = useSearchParams();
  const page = searchParams?.get('page');
  const eventId = searchParams?.get('id');

  if (page === 'create-event') {
    return <CreateEventPage />;
  }

  if (page === 'events') {
    return <EventPage />;
  }

  if (page === 'event-details' && eventId) {
    return <EventDetailsPage />;
  }

  if (page === 'premium') {
    return <PremiumPage />;
  }

  if (page === 'profile') {
    return <ProfilePage />;
  }

  if (page === 'sign-in') {
    return <SignInPage />;
  }

  if (page === 'sign-up') {
    return <SignUpPage />;
  }

  if (page === 'invited-events') {
    return <InvitedEventsPage />;
  }

  if (page === 'categories') {
    return <Categories />;
  }

  if (page === 'category') {
    return <CategoryPage />;
  }

  return <LandingPage />;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading Tivento...</p>
        </div>
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}
