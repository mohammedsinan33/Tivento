'use client';

import React, { useState, useEffect } from 'react';
import { Event, createEventRegistration, checkUserRegistration } from '@/components/EventPage/Supabase';

interface EventRegistrationProps {
  event: Event;
}

const EventRegistration: React.FC<EventRegistrationProps> = ({ event }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isEventPassed = () => {
    const eventDate = new Date(event.event_date);
    const now = new Date();
    return eventDate < now;
  };

  const isRegistrationClosed = () => {
    if (!event.reg_deadline) return false;
    const deadline = new Date(event.reg_deadline);
    const now = new Date();
    return deadline < now;
  };

  // Check if user is already registered (you might want to check this based on stored user info)
  useEffect(() => {
    const checkExistingRegistration = async () => {
      // For now, check localStorage for demo purposes
      // In a real app, you'd check against the logged-in user's email
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail && event.id) {
        try {
          const { data } = await checkUserRegistration(event.id.toString(), savedEmail);
          if (data) {
            setIsRegistered(true);
          }
        } catch (error) {
          console.error('Error checking registration:', error);
        }
      }
    };

    checkExistingRegistration();
  }, [event.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegistrationError(null);

    try {
      // Save email to localStorage for demo purposes
      localStorage.setItem('userEmail', formData.email);

      // Create registration in database
      const { data, error } = await createEventRegistration({
        event_id: event.id?.toString() || '',
        user_name: formData.name,
        user_email: formData.email,
        user_phone: formData.phone || undefined,
        message: formData.message || undefined
      });

      if (error) {
        throw new Error(error);
      }

      setIsRegistered(true);
      setShowRegistrationForm(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      // Show success message
      alert('Registration successful! You will receive a confirmation email shortly.');
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      setRegistrationError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRegisterClick = () => {
    if (event.price === 0) {
      setShowRegistrationForm(true);
    } else {
      // Handle paid event registration (redirect to payment)
      alert('Paid event registration will be implemented with payment gateway integration');
    }
  };

  const handleShareEvent = (platform: string) => {
    const eventUrl = window.location.href;
    const eventTitle = encodeURIComponent(event.title);
    const eventDescription = encodeURIComponent(event.description.substring(0, 100) + '...');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${eventTitle}&url=${encodeURIComponent(eventUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${eventTitle}%20${encodeURIComponent(eventUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const isEventUnavailable = isEventPassed() || isRegistrationClosed();

  return (
    <div className="space-y-6">
      {/* Registration Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
        <div className="p-6">
          {/* Price */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {event.price === 0 ? 'Free' : `$${event.price}`}
            </div>
            {event.price > 0 && (
              <p className="text-gray-600">{event.Currency}</p>
            )}
          </div>

          {/* Event Info Summary */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(event.event_date)}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(event.starting_time)} - {formatTime(event.ending_time)}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Max {event.max_attendees} attendees</span>
            </div>

            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">
                {event.is_online ? 'Online Event' : (event.venue_name || event.Address || 'Location TBD')}
              </span>
            </div>
          </div>

          {/* Registration Status/Button */}
          {isRegistered ? (
            <div className="text-center py-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="font-semibold text-green-900 mb-1">You're Registered!</h3>
                <p className="text-green-700 text-sm">Check your email for event details.</p>
              </div>
            </div>
          ) : isEventUnavailable ? (
            <div className="text-center py-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {isEventPassed() ? 'Event Passed' : 'Registration Closed'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {isEventPassed() 
                    ? 'This event has already occurred.'
                    : 'Registration deadline has passed.'
                  }
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleRegisterClick}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {event.price === 0 ? 'Register for Free' : 'Register & Pay'}
            </button>
          )}

          {/* Registration Deadline */}
          {event.reg_deadline && !isEventUnavailable && (
            <p className="text-sm text-gray-600 text-center mt-3">
              Registration closes on {formatDate(event.reg_deadline)}
            </p>
          )}
        </div>
      </div>

      {/* Share Event */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Share This Event</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => handleShareEvent('facebook')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Facebook
          </button>
          <button 
            onClick={() => handleShareEvent('twitter')}
            className="flex-1 bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Twitter
          </button>
          <button 
            onClick={() => handleShareEvent('whatsapp')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            WhatsApp
          </button>
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Register for Event</h3>
                <button
                  onClick={() => {
                    setShowRegistrationForm(false);
                    setRegistrationError(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {registrationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm">{registrationError}</p>
                </div>
              )}

              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Any questions or special requirements?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegistering ? 'Registering...' : 'Complete Registration'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistration;