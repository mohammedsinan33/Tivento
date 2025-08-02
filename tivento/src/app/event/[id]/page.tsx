'use client';

import { useParams } from 'next/navigation';
import EventDetailPage from '@/pages/EventDetailPage';

export default function EventDetail() {
  const params = useParams();
  const eventId = params?.id as string;

  return <EventDetailPage eventId={eventId} />;
}