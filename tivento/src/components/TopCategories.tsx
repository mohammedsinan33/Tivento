import React from 'react';

const TopCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Technology',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      count: '1,247 groups',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 2,
      name: 'Outdoors & Adventure',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      count: '892 groups',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 3,
      name: 'Health & Wellness',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      count: '673 groups',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 4,
      name: 'Arts & Culture',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      count: '534 groups',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 5,
      name: 'Social & Community',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      count: '1,089 groups',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 6,
      name: 'Career & Business',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      count: '745 groups',
      color: 'from-gray-600 to-gray-800'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Top Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From tech meetups to outdoor adventures, find your community in our most popular categories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-white/90 font-medium transform group-hover:translate-y-[-4px] transition-transform duration-300 delay-75">
                    {category.count}
                  </p>
                </div>

                {/* Hover Effect Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
            Browse All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopCategories;