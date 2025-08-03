import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Discover Events',
      description: 'Browse thousands of events across different categories and tiers to find what excites you',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      title: 'Join Events',
      description: 'Register for events that match your interests and tier level - from free community events to premium experiences',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      title: 'Create Events',
      description: 'Host your own events and build communities around your passions with our easy-to-use event creation tools',
      color: 'from-green-500 to-teal-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Tivento Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of people using Tivento to discover events, meet like-minded individuals, and create meaningful connections.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="text-center group relative">
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-2 border-orange-500 rounded-full flex items-center justify-center text-orange-500 font-bold text-sm z-10">
                {index + 1}
              </div>
              
              {/* Icon Container */}
              <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-2xl`}>
                {step.icon}
              </div>
              
              {/* Content */}
              <div className="bg-white rounded-xl p-6 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
              </div>
              
              {/* Connection Arrow (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-6 lg:-right-8 z-0">
                  <svg className="w-12 h-8 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;