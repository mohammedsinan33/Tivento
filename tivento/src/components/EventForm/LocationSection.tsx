import React from 'react';

interface LocationSectionProps {
  formData: {
    is_online: boolean;
    location: string;
    venue_name: string;
    meeting_link: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({ formData, onInputChange }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
      
      <div className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_online"
            checked={formData.is_online}
            onChange={onInputChange}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            This is an online event
          </label>
        </div>

        {formData.is_online ? (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meeting Link
            </label>
            <input
              type="url"
              name="meeting_link"
              value={formData.meeting_link}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://zoom.us/j/..."
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Venue Name
              </label>
              <input
                type="text"
                name="venue_name"
                value={formData.venue_name}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Conference Center, Park, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="123 Main St, City, State"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationSection;