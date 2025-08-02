import { supabase } from '@/lib/supabase';

export interface EventData {
  title: string;
  description: string;
  category: string;
  tier: 'free' | 'silver' | 'gold' | 'platinum';
  tags: string;
  max_attendees: number;
  event_date: string;
  starting_time: string;
  ending_time: string;
  reg_deadline?: string;
  venue_name?: string;
  Address?: string;
  price: number;
  currency: string;
  requirements?: string;
  agerestriction: string;
  contact_email?: string;
  contact_phone?: number;
  is_online: boolean;
  image_url?: string;
}

// Function to upload image to Supabase bucket
export const uploadImageToBucket = async (file: File): Promise<{ url: string | null; error: any }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('eventimage')
      .upload(fileName, file);

    if (error) {
      return { url: null, error };
    }

    const { data: urlData } = supabase.storage
      .from('eventimage')
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    return { url: null, error };
  }
};

// Function to create event in database
export const createEventInDatabase = async (formData: any, imageFile?: File): Promise<{ data: any; error: any }> => {
  try {
    let imageUrl = formData.image_url || '';

    // Upload image if file is provided
    if (imageFile) {
      const { url, error: uploadError } = await uploadImageToBucket(imageFile);
      if (uploadError) {
        return { data: null, error: uploadError };
      }
      if (url) {
        imageUrl = url;
      }
    }

    // Prepare data for database
    const eventData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tier: formData.tier,
      tags: formData.tags,
      max_attendees: formData.max_attendees.toString(),
      event_date: formData.event_date,
      starting_time: formData.start_time,
      ending_time: formData.end_time,
      reg_deadline: formData.registration_deadline || null,
      venue_name: formData.venue_name || null,
      Address: formData.location || null,
      price: formData.price,
      currency: formData.currency,
      requirements: formData.requirements || null,
      Agerestriction: formData.age_restriction,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone ? parseInt(formData.contact_phone) : null,
      is_online: formData.is_online,
      image_url: imageUrl
    };

    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Main function to handle complete event creation process
export const handleEventCreation = async (
  formData: any, 
  imageFile?: File
): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    let imageUrl = formData.image_url || '';

    // If user uploaded an image file, upload it to bucket first
    if (imageFile) {
      const { url, error: uploadError } = await uploadImageToBucket(imageFile);
      
      if (uploadError) {
        return { 
          success: false, 
          error: `Image upload failed: ${uploadError.message}` 
        };
      }
      
      if (url) {
        imageUrl = url;
      }
    }

    // Prepare event data for database
    const eventData: EventData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tier: formData.tier,
      tags: formData.tags,
      max_attendees: formData.max_attendees,
      event_date: formData.event_date,
      starting_time: formData.start_time,
      ending_time: formData.end_time,
      reg_deadline: formData.registration_deadline || null,
      venue_name: formData.venue_name || null,
      Address: formData.location || null,
      price: formData.price,
      currency: formData.currency,
      requirements: formData.requirements || null,
      agerestriction: formData.age_restriction,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone ? parseInt(formData.contact_phone) : undefined,
      is_online: formData.is_online,
      image_url: imageUrl
    };

    // Create event in database
    const { data, error } = await createEventInDatabase(eventData);

    if (error) {
      return { 
        success: false, 
        error: `Database error: ${error.message}` 
      };
    }

    return { 
      success: true, 
      data,
      error: null 
    };

  } catch (error: any) {
    console.error('Error in handleEventCreation:', error);
    return { 
      success: false, 
      error: `Unexpected error: ${error.message}` 
    };
  }
};

// Function to get all events
export const getAllEvents = async (): Promise<{ data: any[] | null; error: any }> => {
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

// Function to get events by tier
export const getEventsByTier = async (userTier: string): Promise<{ data: any[] | null; error: any }> => {
  const tierHierarchy: { [key: string]: string[] } = {
    'free': ['free'],
    'silver': ['free', 'silver'],
    'gold': ['free', 'silver', 'gold'],
    'platinum': ['free', 'silver', 'gold', 'platinum']
  };

  const allowedTiers = tierHierarchy[userTier] || ['free'];

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

// Function to delete image from bucket (useful for cleanup)
export const deleteImageFromBucket = async (imageUrl: string): Promise<{ success: boolean; error?: any }> => {
  try {
    // Extract filename from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from('eventimage')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting image:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteImageFromBucket:', error);
    return { success: false, error };
  }
};

// Validation function for form data
export const validateEventData = (formData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields validation
  if (!formData.title?.trim()) errors.push('Event title is required');
  if (!formData.description?.trim()) errors.push('Description is required');
  if (!formData.category?.trim()) errors.push('Category is required');
  if (!formData.event_date) errors.push('Event date is required');
  if (!formData.start_time) errors.push('Start time is required');
  if (!formData.end_time) errors.push('End time is required');

  // Date validation
  if (formData.event_date) {
    const eventDate = new Date(formData.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      errors.push('Event date cannot be in the past');
    }
  }

  // Time validation
  if (formData.start_time && formData.end_time) {
    if (formData.start_time >= formData.end_time) {
      errors.push('End time must be after start time');
    }
  }

  // Email validation
  if (formData.contact_email && formData.contact_email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact_email)) {
      errors.push('Please enter a valid email address');
    }
  }

  // Phone validation
  if (formData.contact_phone && formData.contact_phone.trim()) {
    const phoneNumber = formData.contact_phone.replace(/\D/g, '');
    if (phoneNumber.length < 10) {
      errors.push('Please enter a valid phone number');
    }
  }

  // Price validation
  if (formData.price < 0) {
    errors.push('Price cannot be negative');
  }

  // Max attendees validation
  if (formData.max_attendees < 1) {
    errors.push('Maximum attendees must be at least 1');
  }

  // Online event validation
  if (formData.is_online && !formData.meeting_link?.trim()) {
    errors.push('Meeting link is required for online events');
  }

  // Offline event validation
  if (!formData.is_online && !formData.location?.trim()) {
    errors.push('Address is required for offline events');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};