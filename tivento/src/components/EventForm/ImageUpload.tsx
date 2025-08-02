import React from 'react';

interface ImageUploadProps {
  formData: {
    image_url: string;
  };
  imagePreview: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  formData, 
  imagePreview, 
  onInputChange, 
  onImageChange 
}) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Image</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
        </div>

        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-w-md h-48 object-cover rounded-xl border border-gray-300"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Or Image URL
          </label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default ImageUpload;