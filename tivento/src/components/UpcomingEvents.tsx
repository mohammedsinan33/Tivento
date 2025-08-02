import React from 'react';

const UpcomingEvents = () => {
  const events = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 15',
      time: '7:00 PM',
      title: 'JavaScript Developers Meetup',
      groupName: 'NYC Tech Community',
      attendees: 47,
      tier: 'Free'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 18',
      time: '9:00 AM',
      title: 'Central Park Hiking Group',
      groupName: 'Manhattan Outdoor Adventures',
      attendees: 23,
      tier: 'Silver'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 20',
      time: '6:30 PM',
      title: 'Photography Workshop',
      groupName: 'Creative Lens Society',
      attendees: 15,
      tier: 'Gold'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 22',
      time: '7:30 PM',
      title: 'Book Club: Sci-Fi Classics',
      groupName: 'Literary Minds NYC',
      attendees: 12,
      tier: 'Free'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 25',
      time: '10:00 AM',
      title: 'Morning Yoga Session',
      groupName: 'Zen Wellness Community',
      attendees: 30,
      tier: 'Platinum'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      date: 'Dec 28',
      time: '8:00 PM',
      title: 'Board Game Night',
      groupName: 'Game Night Enthusiasts',
      attendees: 18,
      tier: 'Silver'
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Free': return 'bg-gray-100 text-gray-800';
      case 'Silver': return 'bg-gray-200 text-gray-900';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Events Near You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing events happening in your area and connect with like-minded people.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(event.tier)}`}>
                    {event.tier}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                  <div className="text-orange-600 font-bold text-lg">{event.date}</div>
                  <div className="text-gray-600 text-sm">{event.time}</div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-3">{event.groupName}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm">{event.attendees} attending</span>
                  </div>
                  <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                    Join Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
            See more events
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;