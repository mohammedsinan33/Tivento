'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUserSync } from '@/pages/Authentication/useUserSync';

const PremiumPage = () => {
  const { isSignedIn, user } = useUser();
  const { supabaseUser } = useUserSync();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const currentTier = supabaseUser?.tier || 'free';

  const plans = {
    silver: {
      name: 'Silver',
      description: 'Perfect for casual event creators',
      icon: '🥈',
      monthlyPrice: 799,
      annualPrice: 7999,
      features: [
        'Create unlimited Free and Silver events',
        'Basic event analytics',
        'Email support',
        'Custom event branding',
        'Up to 100 attendees per event',
        'Basic invitation system'
      ],
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    gold: {
      name: 'Gold',
      description: 'For professional event organizers',
      icon: '🥇',
      monthlyPrice: 1599,
      annualPrice: 15999,
      features: [
        'All Silver features',
        'Create Gold tier events',
        'Advanced analytics dashboard',
        'Priority email support',
        'Custom domains',
        'Up to 500 attendees per event',
        'Advanced invitation management',
        'Event templates',
        'Integration with calendars'
      ],
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      popular: true
    },
    platinum: {
      name: 'Platinum',
      description: 'Ultimate event management solution',
      icon: '💎',
      monthlyPrice: 3199,
      annualPrice: 31999,
      features: [
        'All Gold features',
        'Create exclusive Platinum events',
        'White-label solution',
        'Dedicated account manager',
        'Phone support',
        'Unlimited attendees',
        'Advanced invitation system with friend invites',
        'Custom integrations',
        'API access',
        'Mentor program access'
      ],
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  };

  const specialPlans = {
    student: {
      name: 'Student Silver',
      description: 'Free plan for verified students',
      icon: '🎓',
      monthlyPrice: 0,
      annualPrice: 0,
      originalPrice: 799,
      features: [
        'All Silver features at no cost',
        'Can only create Free events',
        'Student verification required',
        'Valid student ID needed',
        'Limited to educational events',
        'Free forever for students'
      ],
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    mentor: {
      name: 'Platinum Mentor',
      description: 'For verified industry professionals',
      icon: '🏆',
      monthlyPrice: 2399,
      annualPrice: 23999,
      originalPrice: 3199,
      features: [
        'All Platinum features',
        'Mentor badge and verification',
        'Access to mentorship programs',
        'Exclusive networking events',
        'Professional verification required',
        'Industry leadership recognition'
      ],
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }
  };

  const getTierStatus = (planTier: string) => {
    const tierHierarchy = { free: 0, silver: 1, gold: 2, platinum: 3 };
    const currentTierLevel = tierHierarchy[currentTier as keyof typeof tierHierarchy] || 0;
    const planTierLevel = tierHierarchy[planTier as keyof typeof tierHierarchy] || 0;

    if (currentTierLevel === planTierLevel) return 'current';
    if (currentTierLevel > planTierLevel) return 'downgrade';
    return 'upgrade';
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const PlanCard = ({ plan, planKey, isSpecial = false }: any) => {
    const status = getTierStatus(planKey);
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    const originalPrice = plan.originalPrice;
    const isFree = price === 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative ${plan.bgColor} ${plan.borderColor} border-2 rounded-2xl p-8 ${
          plan.popular ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
        } hover:shadow-2xl transition-all duration-300 ${
          isFree ? 'ring-2 ring-green-400' : ''
        }`}
      >
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Most Popular
            </span>
          </div>
        )}

        {isFree && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              100% Free
            </span>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{plan.icon}</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600">{plan.description}</p>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2">
            {originalPrice && !isFree && (
              <span className="text-lg text-gray-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className={`text-4xl font-bold ${isFree ? 'text-green-600' : 'text-gray-900'}`}>
              {formatPrice(price)}
            </span>
          </div>
          {!isFree && (
            <>
              <span className="text-gray-600">
                per {billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
              {billingCycle === 'annual' && (
                <div className="text-green-600 text-sm font-semibold mt-1">
                  Save {Math.round((1 - (plan.annualPrice / 12) / plan.monthlyPrice) * 100)}%
                </div>
              )}
            </>
          )}
          {isFree && (
            <span className="text-green-600 font-semibold">
              Forever Free for Students
            </span>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            status === 'current'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : status === 'downgrade'
              ? 'bg-red-500 text-white hover:bg-red-600'
              : isFree
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-105'
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105'
          }`}
          disabled={status === 'current'}
        >
          {status === 'current' ? 'Current Plan' : 
           status === 'downgrade' ? 'Downgrade' : 
           isFree ? 'Get Free Access' :
           'Upgrade Now'}
        </button>

        {isSpecial && (
          <div className={`mt-4 p-3 rounded-lg ${
            isFree ? 'bg-green-100 border border-green-300' : 'bg-yellow-100 border border-yellow-300'
          }`}>
            <p className={`text-xs text-center ${
              isFree ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {planKey === 'student' ? 'Requires student verification' : 'Requires professional verification'}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Unlock Your Event
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Creation Potential
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan to elevate your event management experience. 
            From casual gatherings to exclusive platinum events. Prices in Indian Rupees.
          </p>

          {/* Current Tier Display */}
          {isSignedIn && supabaseUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg mb-8"
            >
              <span className="text-gray-600">Current Plan:</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                currentTier === 'free' ? 'bg-gray-100 text-gray-800' :
                currentTier === 'silver' ? 'bg-gray-200 text-gray-900' :
                currentTier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {currentTier === 'free' ? '🆓' :
                 currentTier === 'silver' ? '🥈' :
                 currentTier === 'gold' ? '🥇' : '💎'}
                <span className="ml-1">
                  {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
                </span>
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white p-1 rounded-xl shadow-lg">
            <div className="flex space-x-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 relative ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {Object.entries(plans).map(([key, plan], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <PlanCard plan={plan} planKey={key} />
            </motion.div>
          ))}
        </div>

        {/* Special Plans Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Special Plans</h2>
            <p className="text-lg text-gray-600">
              Free access for students and special pricing for verified professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {Object.entries(specialPlans).map(([key, plan], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + 0.1 * index, duration: 0.5 }}
              >
                <PlanCard plan={plan} planKey={key} isSpecial={true} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Event Creation Permissions
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">User Tier</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Can Create</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Special Access</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center">
                      🆓 <span className="ml-2 font-medium">Free</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-red-600 font-medium">
                    Cannot create events
                  </td>
                  <td className="py-4 px-6 text-center text-gray-500">-</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center">
                      🥈 <span className="ml-2 font-medium">Silver (Paid)</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-green-600 font-medium">
                    Free, Silver events
                  </td>
                  <td className="py-4 px-6 text-center text-gray-500">-</td>
                </tr>
                <tr className="border-b border-gray-100 bg-green-50">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center">
                      🎓 <span className="ml-2 font-medium">Silver (Student) - FREE</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-orange-600 font-medium">
                    Free events only
                  </td>
                  <td className="py-4 px-6 text-center text-green-600 font-medium">
                    100% Free Access
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center">
                      🥇 <span className="ml-2 font-medium">Gold</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-green-600 font-medium">
                    Free, Silver, Gold events
                  </td>
                  <td className="py-4 px-6 text-center text-gray-500">-</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center">
                      💎 <span className="ml-2 font-medium">Platinum</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-green-600 font-medium">
                    All event types
                  </td>
                  <td className="py-4 px-6 text-center text-purple-600 font-medium">
                    Friend invites
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center">
                      🏆 <span className="ml-2 font-medium">Platinum (Mentor)</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-green-600 font-medium">
                    All event types
                  </td>
                  <td className="py-4 px-6 text-center text-indigo-600 font-medium">
                    Mentor programs
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h4>
              <p className="text-gray-600 mb-4">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
              
              <h4 className="font-semibold text-gray-900 mb-2">
                What happens to my events if I downgrade?
              </h4>
              <p className="text-gray-600 mb-4">
                Your existing events remain active, but you won't be able to create new events above your tier level.
              </p>

              <h4 className="font-semibold text-gray-900 mb-2">
                Why is Student Silver completely free?
              </h4>
              <p className="text-gray-600">
                We believe in supporting education. Students get free access to Silver features to help them organize educational events and activities.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                How do I get student or mentor verification?
              </h4>
              <p className="text-gray-600 mb-4">
                Student verification requires a valid student ID. Mentor verification requires professional credentials and industry experience.
              </p>
              
              <h4 className="font-semibold text-gray-900 mb-2">
                Are there any payment gateways supported?
              </h4>
              <p className="text-gray-600 mb-4">
                Yes! We support all major Indian payment methods including UPI, Net Banking, Credit/Debit Cards, and digital wallets.
              </p>

              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h4>
              <p className="text-gray-600">
                Yes! New users get a 14-day free trial of Silver features to explore the platform.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PremiumPage;