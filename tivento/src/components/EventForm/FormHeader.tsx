import React from 'react';

const FormHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
      <h1 className="text-3xl font-bold text-white">Create New Event</h1>
      <p className="text-orange-100 mt-2">Share your passion and bring people together</p>
    </div>
  );
};

export default FormHeader;