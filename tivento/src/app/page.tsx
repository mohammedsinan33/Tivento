'use client';

import { useSearchParams } from 'next/navigation';
import LandingPage from '@/pages/LandingPage';
import CreateEventPage from '@/pages/CreateEventPage';
import EventPage from '@/pages/EventPage';
import EventDetailsPage from '@/pages/EventDetailsPage';
import PremiumPage from '@/pages/PremiumPage';
import ProfilePage from '@/pages/Authentication/ProfilePage';
import SignInPage from '@/pages/Authentication/SignInPage';
import SignUpPage from '@/pages/Authentication/SignUpPage';
import InvitedEventsPage from '@/pages/InvitedEventsPage';
import Categories from '@/components/LandingPage/Categories';
import CategoryPage from '@/components/LandingPage/CategoryPage';

export default function Home() {
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
