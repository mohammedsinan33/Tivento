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
      description: 'Explore groups and events for all your interests',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Join a Group',
      description: 'Connect with people who share your passion',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Start a Group',
      description: 'Create your own group and host events',
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How ConnectSphere Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join millions of people using ConnectSphere to meet new people and do more of what they love.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
              
              {/* Connection Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-24 h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 transform translate-x-12"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;