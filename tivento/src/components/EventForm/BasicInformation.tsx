import React from 'react';

interface BasicInformationProps {
  formData: {
    title: string;
    description: string;
    category: string;
    tier: 'free' | 'silver' | 'gold' | 'platinum';
    tags: string;
    max_attendees: number;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ formData, onInputChange }) => {
  const categories = [
    'Technology',
    'Health & Wellness',
    'Arts & Culture',
    'Business & Career',
    'Sports & Fitness',
    'Education',
    'Food & Drink',
    'Music',
    'Outdoors & Adventure',
    'Social & Community'
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter event title"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Describe your event..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            User Tier *
          </label>
          <select
            name="tier"
            value={formData.tier}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="free">Free</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g. networking, tech, beginner (comma separated)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Max Attendees
          </label>
          <input
            type="number"
            name="max_attendees"
            value={formData.max_attendees}
            onChange={onInputChange}
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default BasicInformation;