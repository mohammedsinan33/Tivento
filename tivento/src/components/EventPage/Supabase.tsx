import { supabase } from '@/lib/supabase';

export interface Event {
  id: string;
  title: string;
  description: string;
  Catogory: string;
  tier: 'free' | 'silver' | 'gold' | 'platinum';
  tags: string;
  max_attendees: string;
  event_date: string;
  starting_time: string;
  ending_time: string;
  reg_deadline?: string;
  venue_name?: string;
  Address?: string;
  price: number;
  Currency: string;
  requirements?: string;
  Agerestriction: string;
  contact_email?: string;
  contact_phone?: number;
  is_online: boolean;
  image_url?: string;
  created_at: string;
}

// Fetch all events
export const getAllEvents = async (): Promise<{ data: Event[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    return { data: null, error };
  }
};

// Fetch events by category
export const getEventsByCategory = async (category: string): Promise<{ data: Event[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('Catogory', category)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events by category:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getEventsByCategory:', error);
    return { data: null, error };
  }
};

// Fetch events by tier
export const getEventsByTier = async (tier: string): Promise<{ data: Event[] | null; error: any }> => {
  const tierHierarchy: { [key: string]: string[] } = {
    'free': ['free'],
    'silver': ['free', 'silver'],
    'gold': ['free', 'silver', 'gold'],
    'platinum': ['free', 'silver', 'gold', 'platinum']
  };

  const allowedTiers = tierHierarchy[tier] || ['free'];

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .in('tier', allowedTiers)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events by tier:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getEventsByTier:', error);
    return { data: null, error };
  }
};

// Search events by title or description
export const searchEvents = async (searchTerm: string): Promise<{ data: Event[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.ilike.%${searchTerm}%`)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error searching events:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in searchEvents:', error);
    return { data: null, error };
  }
};

// Get event by ID
export const getEventById = async (id: string): Promise<{ data: Event | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event by ID:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getEventById:', error);
    return { data: null, error };
  }
};

// Get events with pagination
export const getEventsWithPagination = async (
  page: number = 1, 
  limit: number = 12
): Promise<{ data: Event[] | null; error: any; count: number | null }> => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('event_date', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('Error fetching events with pagination:', error);
      return { data: null, error, count: null };
    }

    return { data, error: null, count };
  } catch (error) {
    console.error('Error in getEventsWithPagination:', error);
    return { data: null, error, count: null };
  }
};