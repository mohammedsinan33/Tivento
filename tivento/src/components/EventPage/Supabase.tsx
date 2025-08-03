import { supabase } from "@/lib/supabase";

export interface Event {
  UUID: number; // Changed from 'id' to 'UUID' to match database column
  title: string;
  description: string;
  Catogory: string;
  tier: "free" | "silver" | "gold" | "platinum";
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
export const getAllEvents = async (): Promise<{
  data: Event[] | null;
  error: any;
}> => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return { data: null, error };
    }

    // Remove all debug console.logs from here
    return { data, error: null };
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    return { data: null, error };
  }
};

// Fetch events by category
export const getEventsByCategory = async (
  category: string
): Promise<{ data: Event[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("Catogory", category)
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching events by category:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in getEventsByCategory:", error);
    return { data: null, error };
  }
};

// Fetch events with filters
export const getEventsWithFilters = async (filters: {
  category?: string;
  tier?: string;
  location?: string;
  searchTerm?: string;
}): Promise<{ data: Event[] | null; error: any }> => {
  try {
    let query = supabase.from("events").select("*");

    if (filters.category) {
      query = query.eq("Catogory", filters.category);
    }

    if (filters.tier) {
      query = query.eq("tier", filters.tier);
    }

    if (filters.searchTerm) {
      query = query.or(
        `title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`
      );
    }

    const { data, error } = await query.order("event_date", {
      ascending: true,
    });

    if (error) {
      console.error("Error fetching events with filters:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in getEventsWithFilters:", error);
    return { data: null, error };
  }
};

// Additional functions for event details page
export const getEventById = async (
  id: string
): Promise<{ data: Event | null; error: any }> => {
  try {
    if (!id || id === "undefined" || id === undefined) {
      console.error("Invalid event ID provided:", id);
      return { data: null, error: "Invalid event ID" };
    }

    // Convert string to number for integer primary key
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      console.error("Invalid numeric ID format:", id);
      return { data: null, error: "Invalid numeric ID format" };
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("UUID", numericId) // Use UUID column instead of id
      .single();

    if (error) {
      console.error("Error fetching event by ID:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in getEventById:", error);
    return { data: null, error };
  }
};

export const getRelatedEvents = async (
  currentEventId: string,
  category: string,
  limit: number = 3
): Promise<{ data: Event[] | null; error: any }> => {
  try {
    const numericId = parseInt(currentEventId, 10);
    
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("Catogory", category)
      .neq("id", numericId)
      .limit(limit)
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching related events:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in getRelatedEvents:", error);
    return { data: null, error };
  }
};
