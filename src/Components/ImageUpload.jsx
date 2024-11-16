import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth.js';
import { LoadingSpinner } from '../Components/common/LoadingSpinner.jsx';
import  TopNavigationBar from '../Components/TopNavigationBar.jsx' 

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const CATEGORIES = {
  profielAfbeelding: { label: 'Profielafbeelding', icon: '👤' },
  favorieteDier: { label: 'Favoriete Dier', icon: '🐾' },
  favorietePlek: { label: 'Favoriete Plek', icon: '🌍' },
  favorieteEten: { label: 'Favoriete Eten', icon: '🍔' },
  favorieteHobby: { label: 'Favoriete Hobby', icon: '🎨' },
};

const ImageUpload = ({ onUploadComplete ,user, loggedIn, logout, email}) => {
  const { currentUser, loading, error } = useSupabaseAuth();
  const [images, setImages] = useState(
    Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: null }), {})
  );
  const [loadingImages, setLoadingImages] = useState(
    Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: false }), {})
  ); // To track loading state for each category
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
      setLoadingImages((prev) => ({ ...prev, [category]: true })); // Set loading state for category
  
      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('pictures')
        .upload(`${currentUser.id}/${category}/${file.name}`, file);
  
      if (uploadError) {
        setErrors((prev) => ({
          ...prev,
          [category]: 'Error uploading image. Please try again.',
        }));
        setLoadingImages((prev) => ({ ...prev, [category]: false })); // Reset loading state
        return;
      }
  
      // Fetch the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('pictures')
        .getPublicUrl(`${currentUser.id}/${category}/${file.name}`);
  
      if (publicUrlData.publicUrl) {
        // Store both the file object and the fileName
        setImages((prev) => ({
          ...prev,
          [category]: {
            file, // Store the actual file object here
            preview: publicUrlData.publicUrl, // Store the URL for display
            fileName: file.name, // Store the file name explicitly
          },
        }));
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [category]: 'Error processing image. Please try again.',
      }));
    } finally {
      setLoadingImages((prev) => ({ ...prev, [category]: false })); // Reset loading state after operation
    }
  };
  

  const handleImageDelete = (category) => async () => {
    if (!images[category]?.fileName) {
      // If there is no fileName to delete, we can skip the deletion
      setErrors((prev) => ({ ...prev, [category]: 'No image to delete' }));
      return;
    }
  
    try {
      // Remove the image from Supabase storage using the fileName
      const { error: deleteError } = await supabase.storage
        .from('pictures')
        .remove([`${currentUser.id}/${category}/${images[category].fileName}`]);
  
      if (deleteError) {
        setErrors((prev) => ({
          ...prev,
          [category]: 'Error deleting image. Please try again.',
        }));
        console.error('Error deleting image:', deleteError);
      } else {
        // Clear the state after successful deletion
        setImages((prev) => ({
          ...prev,
          [category]: null, // Reset the image for this category
        }));
        setErrors((prev) => ({ ...prev, [category]: null }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [category]: 'Error deleting image. Please try again.',
      }));
      console.error('Error deleting image:', error);
    }
  };
  

  const fetchImages = async () => {
    if (!currentUser) return;
  
    const updatedImages = {};
  
    const fetchImagePromises = Object.keys(CATEGORIES).map(async (category) => {
      try {
        // List files in the category folder
        const { data: files, error: listError } = await supabase.storage
          .from('pictures')
          .list(`${currentUser.id}/${category}`);
  
        if (listError) {
          console.error(`Error listing files for category ${category}:`, listError);
          return; // Skip this category if there's an error
        }
  
        if (files && files.length > 0) {
          // Assuming the first file is the one we want to display
          const file = files[0];
  
          // Generate a public URL for this file
          const { data: publicUrlData } = supabase.storage
            .from('pictures')
            .getPublicUrl(`${currentUser.id}/${category}/${file.name}`);
  
          if (publicUrlData.publicUrl) {
            updatedImages[category] = {
              preview: publicUrlData.publicUrl,
              file: null, // No need for the file object
            };
          }
        }
      } catch (error) {
        console.error(`Error fetching image for category ${category}:`, error);
      }
    });
  
    // Wait for all image fetch promises to resolve
    await Promise.all(fetchImagePromises);
  
    // Update state with fetched images
    setImages((prev) => ({ ...prev, ...updatedImages }));
  };
  

  useEffect(() => {
    fetchImages();
  }, [currentUser]);

  const handleUpload = async () => {
    try {
      await onUploadComplete?.(images);
      setImages(Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: null }), {}));
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 mt-12">
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-center mb-8">
              Upload je favoriete foto's 📸
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(CATEGORIES).map(([category, { label, icon }]) => (
                <div key={category} className="flex flex-col items-center space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {icon} {label}
                  </h3>
                  
                  <div className="w-full flex flex-col items-center">
                    <div
                      className={`w-36 h-36 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center transition-colors duration-200 ${
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
                      {loadingImages[category] ? (
                        <LoadingSpinner /> // Show the spinner if the image is loading
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
