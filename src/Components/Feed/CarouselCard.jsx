import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

{/*
    This code is a mix of the following references: 
    Tailwind UI's Carousel Component (Official Documentation):
    https://tailwindui.com/components/marketing/sections/content-sections#component-d379132c04ff97c041c595cc5f4a4453
    W3C Web Accessibility Initiative (WAI) - Carousel Design Patterns:
    https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
    Nielsen Norman Group's Carousel Usability Guidelines:
    https://www.nngroup.com/articles/designing-effective-carousels/
    Tailwind CSS Official Documentation for animations and transitions:
    https://tailwindcss.com/docs/animation
    https://tailwindcss.com/docs/transition-property
    ARIA (Accessible Rich Internet Applications) Best Practices:
    https://www.w3.org/WAI/ARIA/apg/patterns/carousel/examples/carousel-1-prev-next/
    Google Material Design Guidelines for Carousels:
    https://material.io/components/carousel
    */}

    
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
        const fetchImages = async () => {
          try {
            setIsLoading(true);
            setError(null);
            const fetchedImages = [];
            const categories = Object.keys(CATEGORIES);
    
            for (const category of categories) {
              const { data, error } = await supabase
                .storage
                .from('pictures')
                .list(`${userId}/${category}`);
    
              if (error) {
                console.error('Error fetching images:', error);
                continue;
              }
    
              if (data.length > 0) {
                const { data: publicUrlData } = supabase
                  .storage
                  .from('pictures')
                  .getPublicUrl(`${userId}/${category}/${data[0].name}`);
    
                if (publicUrlData?.publicUrl) {
                  fetchedImages.push({
                    category,
                    url: publicUrlData.publicUrl,
                  });
                }
              }
            }
    
            setImages(fetchedImages);
          } catch (err) {
            setError('Failed to load images');
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchImages();
      }, [userId]);
    
      const goToNext = () => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      };
    
      const goToPrevious = () => {
        setCurrentIndex((prevIndex) => 
          prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
      };
    
      const handleKeyPress = (e) => {
        if (e.key === 'ArrowLeft') {
          goToPrevious();
        } else if (e.key === 'ArrowRight') {
          goToNext();
        }
      };
    
      if (isLoading) {
        return (
          <div className="flex items-center justify-center w-full h-64 bg-[#fff1f2] rounded-lg">
            <div className="w-8 h-8 border-4 border-[#e11d48] border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="flex items-center justify-center w-full h-64 bg-[#ffe4e6] rounded-lg">
            <p className="text-[#9f1239]">⚠️ {error}</p>
          </div>
        );
      }
    
      if (images.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-64 bg-[#fff1f2] rounded-lg">
            <p className="text-[#e11d48] text-4xl mb-2">📷</p>
            <p className="text-[#9f1239]">No images available</p>
          </div>
        );
      }
    
      return (
        <div 
          className="relative w-full max-w-2xl mx-auto"
          role="region"
          aria-label="Image carousel"
          onKeyDown={handleKeyPress}
          tabIndex="0"
        >
          <div className="relative h-64 bg-[#fff1f2] rounded-lg overflow-hidden">
            {/* Current Image */}
            <div className="absolute inset-0 transition-opacity duration-300">
              <img
                src={images[currentIndex].url}
                alt={CATEGORIES[images[currentIndex].category]?.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#4c0519] to-transparent p-4">
                <p className="text-white text-lg font-medium">
                  {CATEGORIES[images[currentIndex].category]?.icon}{' '}
                  {CATEGORIES[images[currentIndex].category]?.label}
                </p>
              </div>
            </div>
    
            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
              aria-label="Previous image"
            >
              <span className="text-[#be123c]">←</span>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
              aria-label="Next image"
            >
              <span className="text-[#be123c]">→</span>
            </button>
          </div>
    
          {/* Dots Navigation */}
          <div className="flex justify-center mt-4 space-x-2" role="tablist">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e11d48] ${
                  currentIndex === index ? 'bg-[#be123c] w-4' : 'bg-[#fda4af]'
                }`}
                aria-label={`Go to image ${index + 1}`}
                aria-selected={currentIndex === index}
                role="tab"
              />
            ))}
          </div>
        </div>
      );
    };
    
    export default CarouselCard;