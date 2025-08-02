import React from 'react';

interface FormActionsProps {
  isSubmitting: boolean;
  onSaveDraft?: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting, onSaveDraft }) => {
  return (
    <div className="flex justify-end space-x-4 pt-6">
      <button
        type="button"
        onClick={onSaveDraft}
        className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200"
      >
        Save as Draft
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating Event...' : 'Create Event'}
      </button>
    </div>
  );
};

export default FormActions;