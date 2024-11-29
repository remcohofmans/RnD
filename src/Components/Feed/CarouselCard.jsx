import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/helper/supabaseClient';

const CATEGORIES = {
  profielAfbeelding: { label: 'Profielafbeelding', icon: '👤', alt: 'Profile Picture' },
  favorieteDier: { label: 'Favoriete Dier', icon: '🐾', alt: 'Favorite Pet' },
  favorietePlek: { label: 'Favoriete Plek', icon: '🌍', alt: 'Favorite Place' },
  favorieteEten: { label: 'Favoriete Eten', icon: '🍔', alt: 'Favorite Food' },
  favorieteHobby: { label: 'Favoriete Hobby', icon: '🎨', alt: 'Favorite Hobby' },
};

const CarouselCard = ({ userId }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImagesFromCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedImages = await Promise.all(
          Object.keys(CATEGORIES).map(async (category) => {
            const { data, error } = await supabase
              .storage
              .from('pictures')
              .list(`${userId}/${category}`);

            if (error || data.length === 0) return null;

            const { data: publicUrlData } = supabase
              .storage
              .from('pictures')
              .getPublicUrl(`${userId}/${category}/${data[0].name}`);

            return publicUrlData?.publicUrl ? { category, url: publicUrlData.publicUrl } : null;
          })
        );

        setImages(fetchedImages.filter(Boolean));
        setError(null);
      } catch (err) {
        setError('Failed to load images');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImagesFromCategories();
  }, [userId]);

  const navigate = (direction) => {
    setCurrentIndex((prev) => 
      direction === 'next' 
        ? (prev === images.length - 1 ? 0 : prev + 1)
        : (prev === 0 ? images.length - 1 : prev - 1)
    );
  };

  const renderContent = () => {
    if (isLoading) return <div className="flex items-center justify-center w-full h-64 bg-[#fff1f2] rounded-full"><div className="w-8 h-8 border-4 border-[#e11d48] border-t-transparent rounded-full animate-spin"></div></div>;
    if (error) return <div className="flex items-center justify-center w-full h-64 bg-[#ffe4e6] rounded-full"><p className="text-[#9f1239]">⚠️ {error}</p></div>;
    if (images.length === 0) return <div className="flex flex-col items-center justify-center w-full h-64 bg-[#fff1f2] rounded-full"><p className="text-[#e11d48] text-4xl mb-2">📷</p><p className="text-[#9f1239]">No images available</p></div>;

    return (
      <div 
        className="relative w-full max-w-xl mx-auto flex items-center justify-center space-x-4 pb-4"
        role="region"
        aria-label="Image carousel"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') navigate('prev');
          if (e.key === 'ArrowRight') navigate('next');
        }}
        tabIndex="0"
      >
        <button onClick={() => navigate('prev')} className="bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e11d48]" aria-label="Previous image">
          <span className="text-[#be123c]">←</span>
        </button>

        <div className="relative h-32 w-32 bg-[#fff1f2] rounded-full overflow-hidden group">
          <img
            src={images[currentIndex].url}
            alt={CATEGORIES[images[currentIndex].category]?.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <span className="text-white text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {CATEGORIES[images[currentIndex].category]?.icon} {CATEGORIES[images[currentIndex].category]?.label}
            </span>
          </div>
        </div>

        <button onClick={() => navigate('next')} className="bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e11d48]" aria-label="Next image">
          <span className="text-[#be123c]">→</span>
        </button>
      </div>
    );
  };

  return renderContent();
};

export default CarouselCard;