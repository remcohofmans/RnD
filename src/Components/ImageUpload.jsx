import React, { useState, useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const CATEGORIES = {
  profielAfbeelding: { label: 'Profielafbeelding', icon: '👤' },
  favorieteDier: { label: 'Favoriete Dier', icon: '🐾' },
  favorietePlek: { label: 'Favoriete Plek', icon: '🌍' },
  favorieteEten: { label: 'Favoriete Eten', icon: '🍔' },
  favorieteHobby: { label: 'Favoriete Hobby', icon: '🎨' },
};

const ImageUpload = ({ onUploadComplete }) => {
  const [images, setImages] = useState(
    Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: null }), {})
  );
  const [errors, setErrors] = useState({});
  const fileInputRefs = useRef({});

  const validateFile = (file) => {
    if (!file) return 'Please select a file';
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleImageChange = (category) => async (e) => {
    const file = e.target.files[0];
    setErrors((prev) => ({ ...prev, [category]: null }));

    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, [category]: error }));
      return;
    }

    try {
      const base64 = await readFileAsDataURL(file);
      setImages((prev) => ({
        ...prev,
        [category]: {
          file,
          preview: URL.createObjectURL(file),
          base64,
        },
      }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [category]: 'Error processing image. Please try again.',
      }));
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageDelete = (category) => () => {
    setImages((prev) => {
      if (prev[category]?.preview) {
        URL.revokeObjectURL(prev[category].preview);
      }
      return { ...prev, [category]: null };
    });
    setErrors((prev) => ({ ...prev, [category]: null }));
  };

  const handleUpload = async () => {
    try {
      // Instead of uploading to Supabase, we'll just pass the images data to the parent
      await onUploadComplete?.(images);
      // Reset the form after successful upload
      setImages(Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: null }), {}));
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl font-bold text-center mb-12">
              Upload je favoriete foto's 📸
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {Object.entries(CATEGORIES).map(([category, { label, icon }]) => (
                <div key={category} className="flex flex-col items-center space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {icon} {label}
                  </h3>
                  
                  <div className="w-full flex flex-col items-center">
                    <div
                      className={`w-40 h-40 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center transition-colors duration-200 ${
                        errors[category] 
                          ? 'border-red-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => fileInputRefs.current[category].click()}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && fileInputRefs.current[category].click()}
                      aria-label={`Upload ${label}`}
                    >
                      {images[category] ? (
                        <div className="relative w-full h-full">
                          <img
                            src={images[category].preview}
                            alt={`Preview for ${label}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageDelete(category)();
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                            aria-label={`Remove ${label} image`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <Upload className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    
                    {errors[category] && (
                      <p className="text-red-500 text-sm mt-2 text-center" role="alert">
                        {errors[category]}
                      </p>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={(el) => (fileInputRefs.current[category] = el)}
                    onChange={handleImageChange(category)}
                    className="hidden"
                    accept={ACCEPTED_TYPES.join(',')}
                    aria-label={`Upload ${label}`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={handleUpload}
                className="bg-rose-500 hover:bg-rose-600 text-white py-3 px-12 rounded-lg shadow-md transition-colors text-lg font-semibold"
              >
                Uploaden
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;