import React, { useState, useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

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
      const uploadPromises = Object.entries(images).map(async ([category, image]) => {
        if (!image) return null;

        const { data, error } = await supabase.storage
          .from('user-pictures')
          .upload(`public/${category}/${image.file.name}`, image.file);

        if (error) throw error;

        const publicUrl = supabase.storage
          .from('user-pictures')
          .getPublicUrl(`public/${category}/${image.file.name}`);

        const { data: insertData, error: insertError } = await supabase
          .from('user_pictures')
          .insert([{ 
            profielAfbeelding: category === 'profielAfbeelding' ? publicUrl.data.publicUrl : null,
            favorieteDier: category === 'favorieteDier' ? publicUrl.data.publicUrl : null,
            favorietePlek: category === 'favorietePlek' ? publicUrl.data.publicUrl : null,
            favorieteEten: category === 'favorieteEten' ? publicUrl.data.publicUrl : null,
            favorieteHobby: category === 'favorieteHobby' ? publicUrl.data.publicUrl : null,
          }]);

        if (insertError) throw insertError;

        return publicUrl.data.publicUrl;
      });

      await Promise.all(uploadPromises);
      await onUploadComplete?.(images);
      setImages(Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: null }), {}));
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Upload je favorieten foto's 📸
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(CATEGORIES).map(([category, { label, icon }]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {label} {icon}
                </h3>
                
                <div className="relative">
                  <div
                    className={`w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center transition-colors duration-200 ${
                      errors[category] 
                        ? 'border-red-500' 
                        : 'border-gray-300 hover:border-gray-500'
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
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                          aria-label={`Remove ${label} image`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  {errors[category] && (
                    <p className="text-red-500 text-sm mt-1" role="alert">
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

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleUpload}
              className="bg-rose-500 hover:bg-rose-600 text-white py-3 px-8 rounded-lg shadow transition-colors"
            >
              Uploaden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;