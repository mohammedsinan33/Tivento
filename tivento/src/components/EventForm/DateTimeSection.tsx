import React from 'react';

interface DateTimeSectionProps {
  formData: {
    event_date: string;
    start_time: string;
    end_time: string;
    registration_deadline: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({ formData, onInputChange }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Date & Time</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event Date *
          </label>
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Start Time *
          </label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            End Time *
          </label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Registration Deadline
          </label>
          <input
            type="datetime-local"
            name="registration_deadline"
            value={formData.registration_deadline}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default DateTimeSection;