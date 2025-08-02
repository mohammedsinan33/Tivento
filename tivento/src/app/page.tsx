'use client';

import { useSearchParams } from 'next/navigation';
import LandingPage from '@/pages/LandingPage';
import CreateEventPage from '@/pages/CreateEventPage';
import EventPage from '@/pages/EventPage';

export default function Home() {
  const searchParams = useSearchParams();
  const page = searchParams?.get('page');

  if (page === 'create-event') {
    return <CreateEventPage />;
  }

  if (page === 'events') {
    return <EventPage />;
  }

  return <LandingPage />;
}
