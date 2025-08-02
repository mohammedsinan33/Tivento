'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FormHeader from '@/components/EventForm/FormHeader';
import BasicInformation from '@/components/EventForm/BasicInformation';
import DateTimeSection from '@/components/EventForm/DateTimeSection';
import LocationSection from '@/components/EventForm/LocationSection';
import PricingSection from '@/components/EventForm/PricingSection';
import AdditionalDetails from '@/components/EventForm/AdditionalDetails';
import ImageUpload from '@/components/EventForm/ImageUpload';
import FormActions from '@/components/EventForm/FormActions';
import { createEventInDatabase } from '@/components/EventForm/Supabase';

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
  is_online: boolean;
  meeting_link: string;
  requirements: string;
  age_restriction: string;
  contact_email: string;
  contact_phone: string;
  registration_deadline: string;
}

const CreateEventPage = () => {
  const router = useRouter();
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
    is_online: false,
    meeting_link: '',
    requirements: '',
    age_restriction: 'all ages',
    contact_email: '',
    contact_phone: '',
    registration_deadline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

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
    setIsSubmitting(true);

    try {
      const { data, error } = await createEventInDatabase(formData, selectedImageFile || undefined);

      if (error) {
        throw error;
      }

      alert('Event created successfully!');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <FormHeader />

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <BasicInformation 
              formData={formData} 
              onInputChange={handleInputChange} 
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