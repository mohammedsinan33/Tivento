import React from 'react';

interface AdditionalDetailsProps {
  formData: {
    requirements: string;
    age_restriction: string;
    contact_email: string;
    contact_phone: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({ formData, onInputChange }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Details</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Requirements
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={onInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="What should attendees bring or know beforehand?"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Age Restriction *
            </label>
            <select
              name="age_restriction"
              value={formData.age_restriction}
              onChange={onInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select age restriction</option>
              <option value="all ages">All Ages</option>
              <option value="18+">18+</option>
              <option value="21+">21+</option>
              <option value="16+">16+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Email *
            </label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={onInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="contact@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Phone *
            </label>
            <input
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={onInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdditionalDetails;