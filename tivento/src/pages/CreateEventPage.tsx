'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';
import FormHeader from '@/components/EventForm/FormHeader';
import BasicInformation from '@/components/EventForm/BasicInformation';
import DateTimeSection from '@/components/EventForm/DateTimeSection';
import LocationSection from '@/components/EventForm/LocationSection';
import PricingSection from '@/components/EventForm/PricingSection';
import AdditionalDetails from '@/components/EventForm/AdditionalDetails';
import ImageUpload from '@/components/EventForm/ImageUpload';
import FormActions from '@/components/EventForm/FormActions';
import { handleEventCreation } from '@/components/EventForm/Supabase'; // Import the correct function
import { useUserSync } from '@/lib/auth/useUserSync';
import { validateEventCreation, canCreateEvents, EventTier, getUserTierStatus } from '@/lib/tierUtils';

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  image_url: string;
  tier: 'free' | 'silver' | 'gold' | 'platinum';
  location: string;
  venue_name: string;
  max_attendees: number;
  price: number;
  currency: string;
  category: string;
  tags: string;
  group: string;
  is_online: boolean;
  meeting_link: string;
  requirements: string;
  age_restriction: string;
  contact_email: string;
  contact_phone: string;
  registration_deadline: string;
  // Updated field for email-based invites
  is_invite_only: boolean;
  invited_emails: string; // Changed from invited_usernames to invited_emails
}

const CreateEventPage = () => {
  const router = useRouter();
  const { supabaseUser, syncLoading } = useUserSync();
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    image_url: '',
    tier: 'free',
    location: '',
    venue_name: '',
    max_attendees: 50,
    price: 0,
    currency: 'USD',
    category: '',
    tags: '',
    group: '', 
    is_online: false,
    meeting_link: '',
    requirements: '',
    age_restriction: 'all ages',
    contact_email: '',
    contact_phone: '',
    registration_deadline: '',
    // Updated fields
    is_invite_only: false,
    invited_emails: '' // Changed from invited_usernames to invited_emails
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [tierValidationError, setTierValidationError] = useState<string>('');

  // Check if current user is Platinum tier
  const isPlatinumUser = supabaseUser ? 
    getUserTierStatus(supabaseUser.tier).baseTier === 'platinum' || getUserTierStatus(supabaseUser.tier).isMentor 
    : false;

  // Check if user has permission to access this page
  useEffect(() => {
    if (!syncLoading && supabaseUser) {
      if (!canCreateEvents(supabaseUser.tier as any)) {
        // Redirect to premium page if user cannot create events
        router.push('/?page=premium&reason=create-event');
        return;
      }
    }
  }, [supabaseUser, syncLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear tier validation error when tier changes
    if (name === 'tier') {
      setTierValidationError('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear image URL if file is selected
      setFormData(prev => ({
        ...prev,
        image_url: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate tier permissions before submission
    if (supabaseUser) {
      const validation = validateEventCreation(
        supabaseUser.tier as any, 
        formData.tier as EventTier
      );
      
      if (!validation.allowed) {
        setTierValidationError(validation.upgradeMessage || validation.error || '');
        
        // Redirect to premium page with specific reason
        const redirectReason = formData.tier === 'free' 
          ? 'create-event' 
          : `create-${formData.tier}-event`;
        
        router.push(`/?page=premium&reason=${redirectReason}`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Pass the creator email to the database function
      const result = await handleEventCreation(
        formData, 
        selectedImageFile || undefined,
        supabaseUser?.email // Pass the creator email here
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      if (formData.is_invite_only) {
        alert('Event created successfully! Invitations have been sent to the specified emails.');
      } else {
        alert('Event created successfully!');
      }
      
      router.push('/');
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert('Error creating event: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    alert('Draft functionality will be implemented soon!');
  };

  // Show loading while checking user permissions
  if (syncLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <p className="text-gray-600 mt-4">Checking your permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <FormHeader />

          {/* Tier Validation Error Display */}
          {tierValidationError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-8 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{tierValidationError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <BasicInformation 
              formData={formData} 
              onInputChange={handleInputChange}
              userTier={supabaseUser?.tier as any}
              showTierValidation={true}
            />
            
            <DateTimeSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
            
            <LocationSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
            
            <PricingSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />

            {/* Platinum Exclusive: Invite-Only Event Section */}
            {isPlatinumUser && (
              <section className="border-2 border-purple-200 rounded-xl p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">💎</span>
                  <div>
                    <h2 className="text-2xl font-bold text-purple-900">Platinum Exclusive</h2>
                    <p className="text-sm text-purple-700">Create invite-only events for exclusive networking</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Invite-Only Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_invite_only"
                      name="is_invite_only"
                      checked={formData.is_invite_only}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="is_invite_only" className="ml-3 text-sm font-medium text-gray-900">
                      Make this an invite-only event
                    </label>
                  </div>

                  {/* Invited Users Input */}
                  {formData.is_invite_only && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Invited Users Email Addresses *
                        <span className="text-xs text-gray-500 ml-2">(Enter email addresses separated by commas)</span>
                      </label>
                      <textarea
                        name="invited_emails"
                        value={formData.invited_emails}
                        onChange={handleInputChange}
                        required={formData.is_invite_only}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="john@example.com, sarah@example.com, alex@example.com"
                      />
                      <div className="mt-2 text-xs text-gray-600">
                        <p>📝 <strong>Tips:</strong></p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Enter email addresses of registered Tivento users only</li>
                          <li>Separate multiple email addresses with commas</li>
                          <li>Only invited users will be able to see and register for this event</li>
                          <li>You can invite up to 100 users for Platinum events</li>
                          <li>Invited users will receive email notifications about the event</li>
                        </ul>
                      </div>
                      
                      {/* Live Email Count */}
                      {formData.invited_emails.trim() && (
                        <div className="mt-3 p-2 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-700">
                            📧 <strong>{formData.invited_emails.split(',').filter(email => email.trim()).length}</strong> user(s) will be invited
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Invite-Only Benefits Info */}
                  {formData.is_invite_only && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">✨ Invite-Only Event Benefits</h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>🔒 <strong>Exclusive Access:</strong> Only invited users can see the event</li>
                        <li>📧 <strong>Personal Invitations:</strong> Invited users receive email notifications</li>
                        <li>👥 <strong>Quality Networking:</strong> Curated attendee list for better connections</li>
                        <li>🎯 <strong>Targeted Events:</strong> Perfect for team meetings, VIP sessions, or exclusive workshops</li>
                        <li>📊 <strong>Better Control:</strong> Manage exactly who can attend your event</li>
                        <li>✅ <strong>Email Validation:</strong> System verifies all invited emails are registered users</li>
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}
            
            <AdditionalDetails 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
            
            <ImageUpload 
              formData={formData}
              imagePreview={imagePreview}
              onInputChange={handleInputChange}
              onImageChange={handleImageChange}
            />
            
            <FormActions 
              isSubmitting={isSubmitting}
              onSaveDraft={handleSaveDraft}
            />
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateEventPage;