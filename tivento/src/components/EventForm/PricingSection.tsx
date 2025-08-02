import React from 'react';

interface PricingSectionProps {
  formData: {
    price: number;
    currency: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ formData, onInputChange }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={onInputChange}
              min="0"
              step="0.01"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;