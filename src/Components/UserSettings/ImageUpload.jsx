import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/helper/supabaseClient.js';
import { useAuth } from '../../hooks/AuthContext.js';
import { LoadingSpinner } from '../common/LoadingSpinner.jsx';

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
  const { user: currentUser } = useAuth();
  const [images, setImages] = useState(
    Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: null }), {})
  );
  const [loadingImages, setLoadingImages] = useState(
    Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );
  const [errors, setErrors] = useState({});
  const fileInputRefs = useRef({});

  const validateFile = (file) => {
    if (!file) return 'Selecteer een bestand';
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Upload een bestand van een juist type (JPEG, PNG, or WebP)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Bestand mag niet groter dan 5MB zijn';
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
      setLoadingImages((prev) => ({ ...prev, [category]: true }));

      const { error: uploadError } = await supabase.storage
        .from('pictures')
        .upload(`${currentUser.id}/${category}/${file.name}`, file);

      if (uploadError) {
        setErrors((prev) => ({
          ...prev,
          [category]: 'Error uploading image. Please try again.',
        }));
        setLoadingImages((prev) => ({ ...prev, [category]: false }));
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('pictures')
        .getPublicUrl(`${currentUser.id}/${category}/${file.name}`);

      if (publicUrlData.publicUrl) {
        setImages((prev) => ({
          ...prev,
          [category]: {
            file,
            preview: publicUrlData.publicUrl,
            fileName: file.name,  // Store the fileName for deletion
          },
        }));
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [category]: 'Error processing image. Please try again.',
      }));
    } finally {
      setLoadingImages((prev) => ({ ...prev, [category]: false }));
    }
  };

  const handleImageDelete = (category) => async () => {
    const image = images[category];

    if (!image || !image.fileName) {
      setErrors((prev) => ({ ...prev, [category]: 'No image to delete' }));
      return;
    }

    try {
      const { error: deleteError } = await supabase.storage
        .from('pictures')
        .remove([`${currentUser.id}/${category}/${image.fileName}`]);

      if (deleteError) {
        setErrors((prev) => ({
          ...prev,
          [category]: 'Error deleting image. Please try again.',
        }));
      } else {
        setImages((prev) => ({
          ...prev,
          [category]: null,  // Update the image state to null
        }));
        setErrors((prev) => ({ ...prev, [category]: null }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [category]: 'Error deleting image. Please try again.',
      }));
    }
  };

  const fetchImages = async () => {
    if (!currentUser) return;

    const updatedImages = {};

    const fetchImagePromises = Object.keys(CATEGORIES).map(async (category) => {
      try {
        const { data: files, error: listError } = await supabase.storage
          .from('pictures')
          .list(`${currentUser.id}/${category}`);

        if (listError) {
          console.error(`Error listing files for category ${category}:`, listError);
          return;
        }

        if (files && files.length > 0) {
          const file = files[0];  // Assume the first file is the one we want
          const { data: publicUrlData } = supabase.storage
            .from('pictures')
            .getPublicUrl(`${currentUser.id}/${category}/${file.name}`);

          if (publicUrlData.publicUrl) {
            updatedImages[category] = {
              preview: publicUrlData.publicUrl,
              fileName: file.name,  // Store the file name for deletion
            };
          }
        }
      } catch (error) {
        console.error(`Error fetching image for category ${category}:`, error);
      }
    });

    await Promise.all(fetchImagePromises);

    setImages((prev) => ({ ...prev, ...updatedImages }));
  };

  useEffect(() => {
    if (currentUser) {
      fetchImages();
    }
  }, [currentUser]);

  // const handleUpload = async () => {
  //   try {
  //     await onUploadComplete?.(images);
  //     setImages(Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: null }), {}));
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //   }
  // };

  return (
    <div className="items-center bg-rose-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Upload je favoriete foto's 📸</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(CATEGORIES).map(([category, { label, icon }]) => (
                <div key={category} className="flex flex-col items-center space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {icon} {label}
                  </h3>

                  <div className="w-full flex flex-col items-center">
                    <div
                      className={`w-36 h-36 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center transition-colors duration-200 ${errors[category] ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                      onClick={() => fileInputRefs.current[category].click()}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && fileInputRefs.current[category].click()}
                      aria-label={`Upload ${label}`}
                    >
                      {loadingImages[category] ? (
                        <LoadingSpinner />
                      ) : images[category] ? (
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
                      <p className="text-red-500 text-sm mt-1 text-center" role="alert">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
