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
  // Updated fields for email-based invite system
  is_invite_only?: boolean;
  invited_emails?: string;
  username?: string; // This is your existing column that references users.email
}

export interface EventInvitation {
  id?: number;
  event_id: number;
  invited_email: string;
  invited_by_username: string;
  invitation_status: 'pending' | 'accepted' | 'declined';
  created_at?: string;
  updated_at?: string;
}

export interface EventRegistration {
  id?: number;
  event_id: number;
  user_email: string;
  registration_date?: string;
  registration_status: 'registered' | 'cancelled';
}

export interface UserNotification {
  id?: number;
  user_email: string;
  notification_type: string;
  title: string;
  message: string;
  related_event_id?: number;
  is_read: boolean;
  created_at?: string;
}

// Function to validate emails exist in users table
export const validateEmailsExist = async (emails: string[]): Promise<{ validEmails: string[]; invalidEmails: string[] }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .in('email', emails);

    if (error) {
      console.error('Error validating emails:', error);
      return { validEmails: [], invalidEmails: emails };
    }

    const validEmails = data.map(user => user.email);
    const invalidEmails = emails.filter(email => !validEmails.includes(email));

    return { validEmails, invalidEmails };
  } catch (error) {
    console.error('Error in validateEmailsExist:', error);
    return { validEmails: [], invalidEmails: emails };
  }
};

// Function to create event invitations
export const createEventInvitations = async (
  eventId: number, 
  invitedEmails: string[], 
  creatorUsername: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const invitations = invitedEmails.map(email => ({
      event_id: eventId,
      invited_email: email,
      invited_by_username: creatorUsername,
      invitation_status: 'pending' as const
    }));

    const { error } = await supabase
      .from('event_invitations')
      .insert(invitations);

    if (error) {
      console.error('Error creating invitations:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in createEventInvitations:', error);
    return { success: false, error };
  }
};

// Function to create notifications for invited users
export const createInvitationNotifications = async (
  invitedEmails: string[],
  eventTitle: string,
  eventId: number,
  creatorUsername: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const notifications = invitedEmails.map(email => ({
      user_email: email,
      notification_type: 'event_invitation',
      title: 'New Event Invitation',
      message: `You've been invited to "${eventTitle}" by ${creatorUsername}`,
      related_event_id: eventId,
      is_read: false
    }));

    const { error } = await supabase
      .from('user_notifications')
      .insert(notifications);

    if (error) {
      console.error('Error creating notifications:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in createInvitationNotifications:', error);
    return { success: false, error };
  }
};

// Function to register user for event
export const registerUserForEvent = async (
  eventId: number,
  userEmail: string
): Promise<{ success: boolean; error?: any; data?: any }> => {
  try {
    // Check if user is already registered
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_email', userEmail)
      .single();

    if (existingRegistration) {
      return { success: false, error: 'User already registered for this event' };
    }

    // Register the user
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        user_email: userEmail,
        registration_status: 'registered'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error registering user:', error);
      return { success: false, error };
    }

    // Create a registration confirmation notification
    await supabase
      .from('user_notifications')
      .insert([{
        user_email: userEmail,
        notification_type: 'registration_confirmation',
        title: 'Event Registration Confirmed',
        message: `You have successfully registered for the event.`,
        related_event_id: eventId,
        is_read: false
      }]);

    return { success: true, data };
  } catch (error) {
    console.error('Error in registerUserForEvent:', error);
    return { success: false, error };
  }
};

// Function to check if user can access invite-only event
export const canUserAccessInviteOnlyEvent = async (
  eventId: number,
  userEmail: string
): Promise<{ canAccess: boolean; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('event_invitations')
      .select('*')
      .eq('event_id', eventId)
      .eq('invited_email', userEmail)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking invitation:', error);
      return { canAccess: false, error };
    }

    return { canAccess: !!data };
  } catch (error) {
    console.error('Error in canUserAccessInviteOnlyEvent:', error);
    return { canAccess: false, error };
  }
};

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

// Function to create event in database with email validation
export const createEventInDatabase = async (
  formData: any, 
  imageFile?: File,
  creatorEmail?: string
): Promise<{ data: any; error: any }> => {
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

    // Validate invited emails if it's an invite-only event
    let validatedEmails = '';
    if (formData.is_invite_only && formData.invited_emails) {
      const emailArray = formData.invited_emails
        .split(',')
        .map((email: string) => email.trim())
        .filter((email: string) => email);

      const { validEmails, invalidEmails } = await validateEmailsExist(emailArray);

      if (invalidEmails.length > 0) {
        return {
          data: null,
          error: `The following emails are not registered users: ${invalidEmails.join(', ')}`
        };
      }

      validatedEmails = validEmails.join(', ');
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
      image_url: imageUrl,
      // Updated fields for email-based invite system
      is_invite_only: formData.is_invite_only || false,
      invited_emails: formData.is_invite_only ? validatedEmails : null,
      username: creatorEmail || null // Using existing username column for creator email
    };

    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    // Create invitations and notifications if it's an invite-only event
    if (formData.is_invite_only && validatedEmails && data && creatorEmail) {
      const emailArray = validatedEmails.split(', ').filter(email => email.trim());
      
      // Create invitations
      await createEventInvitations(data.UUID, emailArray, creatorEmail);
      
      // Create notifications
      await createInvitationNotifications(emailArray, formData.title, data.UUID, creatorEmail);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Main function to handle complete event creation process
export const handleEventCreation = async (
  formData: any, 
  imageFile?: File,
  creatorEmail?: string
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
      image_url: imageUrl,
      // Updated fields for email-based invite system
      is_invite_only: formData.is_invite_only || false,
      invited_emails: formData.is_invite_only ? formData.invited_emails : undefined,
      username: creatorEmail // Using existing username column
    };

    // Create event in database
    const { data, error } = await createEventInDatabase(eventData, imageFile, creatorEmail);

    if (error) {
      return { 
        success: false, 
        error: typeof error === 'string' ? error : `Database error: ${error.message}` 
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

// Function to get user notifications
export const getUserNotifications = async (userEmail: string): Promise<{ data: UserNotification[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserNotifications:', error);
    return { data: null, error };
  }
};

// Function to mark notification as read
export const markNotificationAsRead = async (notificationId: number): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return { success: false, error };
  }
};

// Function to get events by tier with invitation check
export const getEventsByTier = async (userTier: string, userEmail?: string): Promise<{ data: any[] | null; error: any }> => {
  const tierHierarchy: { [key: string]: string[] } = {
    'free': ['free'],
    'silver': ['free', 'silver'],
    'gold': ['free', 'silver', 'gold'],
    'platinum': ['free', 'silver', 'gold', 'platinum']
  };

  const allowedTiers = tierHierarchy[userTier] || ['free'];

  try {
    let query = supabase
      .from('events')
      .select('*')
      .in('tier', allowedTiers);

    // If user email is provided, include invite-only events they're invited to
    if (userEmail) {
      query = query.or(`is_invite_only.eq.false,and(is_invite_only.eq.true,invited_emails.ilike.%${userEmail}%)`);
    } else {
      // If no user email, exclude invite-only events
      query = query.eq('is_invite_only', false);
    }

    const { data, error } = await query.order('event_date', { ascending: true });

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

// Function to get all events (with invitation filtering)
export const getAllEvents = async (userEmail?: string): Promise<{ data: any[] | null; error: any }> => {
  try {
    let query = supabase
      .from('events')
      .select('*');

    // Filter invite-only events based on user email
    if (userEmail) {
      query = query.or(`is_invite_only.eq.false,and(is_invite_only.eq.true,invited_emails.ilike.%${userEmail}%)`);
    } else {
      query = query.eq('is_invite_only', false);
    }

    const { data, error } = await query.order('event_date', { ascending: true });

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

// Validation function for form data (updated for emails)
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

  // Invite-only validation (updated for emails)
  if (formData.is_invite_only && !formData.invited_emails?.trim()) {
    errors.push('Invited emails are required for invite-only events');
  }

  // Validate email format and count for invite-only events
  if (formData.is_invite_only && formData.invited_emails?.trim()) {
    const emails = formData.invited_emails.split(',').map((email: string) => email.trim()).filter((email: string) => email);
    
    if (emails.length === 0) {
      errors.push('At least one email is required for invite-only events');
    }
    
    if (emails.length > 100) {
      errors.push('Maximum 100 users can be invited to an event');
    }

    // Validate email format - Fixed TypeScript error
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter((email: string) => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      errors.push(`Invalid email format: ${invalidEmails.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};