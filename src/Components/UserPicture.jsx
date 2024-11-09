import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const CATEGORIES = {
  profielAfbeelding: { label: 'Profielafbeelding'},
  favorieteDier: { label: 'Favoriete Dier'},
  favorietePlek: { label: 'Favoriete Plek'},
  favorieteEten: { label: 'Favoriete Eten'},
  favorieteHobby: { label: 'Favoriete Hobby'},
};

export const UserPicture = ({ 
  userId, 
  category = 'profielAfbeelding',
  variant = 'circle', // 'circle' | 'square' 
  size = 'md',
  fallbackText,
  className = ''
}) => {
  const [pictureUrl, setPictureUrl] = useState(null);

  // Define size classes - now including larger sizes
  const sizeClasses = {
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    'huge': 'w-40 h-40',
    'auto': 'w-auto h-auto',
  };

  // Define border radius based on variant
  const radiusClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg'
  };

  useEffect(() => {
    const fetchPicture = async () => {
      if (!userId || !CATEGORIES[category]) return;

      try {
        // List files in the category folder
        const { data: files, error: listError } = await supabase.storage
          .from('pictures')
          .list(`${userId}/${category}`);

        if (listError) {
          console.error(`Error listing ${category} picture:`, listError);
          return;
        }

        if (files && files.length > 0) {
          // Get the first (and only) image
          const file = files[0];
          
          // Get the public URL for the image
          const { data: publicUrlData } = supabase.storage
            .from('pictures')
            .getPublicUrl(`${userId}/${category}/${file.name}`);

          if (publicUrlData.publicUrl) {
            setPictureUrl(publicUrlData.publicUrl);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${category} picture:`, error);
      }
    };

    fetchPicture();
  }, [userId, category]);

  // Calculate if this is a large variant
  const isLargeVariant = ['huge', 'giant'].includes(size);

  // Adjust icon/text size based on container size
  const getIconTextClass = () => {
    if (isLargeVariant) return 'text-4xl';
    if (size === '4xl') return 'text-3xl';
    if (size === '3xl') return 'text-2xl';
    if (size === '2xl') return 'text-xl';
    if (size === 'xl') return 'text-lg';
    return 'text-sm';
  };

  const containerClasses = `
    ${sizeClasses[size]} 
    ${radiusClasses[variant]}
    overflow-hidden 
    bg-rose-200
    flex 
    items-center 
    justify-center
    ${isLargeVariant ? 'shadow-lg' : ''}
    ${className}
  `.trim();

  return (
    <div className={containerClasses}>
      {pictureUrl ? (
        <img
          src={pictureUrl}
          alt={CATEGORIES[category].label}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center text-rose-400 ${getIconTextClass()}`}>
          {fallbackText ? fallbackText.charAt(0).toUpperCase() : CATEGORIES[category].icon}
        </div>
      )}
    </div>
  );
};