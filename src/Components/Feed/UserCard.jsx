import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMapMarkerAlt,
  faBuilding,
  faHeart,
  faStar,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';

import { useAnalytics } from '../../hooks/analyticsContext.js';
import { availableHobbies } from '../filter/AvailableHobbiesPage';
import { supabase } from '../../lib/helper/supabaseClient';
import CarouselCard from '../Feed/CarouselCard';
import CustomAlert from '../Feed/CustomAlert'; // Import the custom alert component

const hobbyIcons = availableHobbies.reduce((acc, hobby) => {
  acc[hobby.name] = hobby.icon;
  return acc;
}, {});
const defaultHobbyIcon = faStar;

const UserCard = ({ user, currentUserId, showLoveButton = true, theme = 'pink' }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const { track } = useAnalytics();

  const themeStyles = {
    pink: {
      cardBg: 'bg-rose-200',
      textColor: 'text-rose-900',
      buttonBg: 'bg-rose-500',
      buttonHoverBg: 'hover:bg-rose-700',
      chatButtonBg: 'bg-rose-200',
      chatButtonHoverBg: 'hover:bg-rose-300',
    },
    green: {
      cardBg: 'bg-green-200',
      textColor: 'text-green-900',
      buttonBg: 'bg-green-500',
      buttonHoverBg: 'hover:bg-green-700',
      chatButtonBg: 'bg-green-200',
      chatButtonHoverBg: 'hover:bg-green-300',
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.pink;

  const hobbies = Array.isArray(user?.hobbies) ? user.hobbies : [];

  const handleLoveClick = async (isLove) => {
    try {
      const likeValue = isLove ? 'true' : 'false';

      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('liked_user_id', user.id)
        .single();

      if (existingLike && !isLove) {
        setAlertMessage('Je hebt deze gebruiker al geliket!');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return;
      }

      const likeOperation = existingLike
        ? supabase
            .from('likes')
            .update({ love_like: likeValue })
            .eq('user_id', currentUserId)
            .eq('liked_user_id', user.id)
        : supabase
            .from('likes')
            .insert([{
                user_id: currentUserId,
                liked_user_id: user.id,
                love_like: likeValue,
            }]);

      const { error: likeError } = await likeOperation;

      if (likeError) {
        console.error('Supabase error:', likeError);
        setAlertMessage('Fout bij liken, probeer het opnieuw.');
        return;
      }

      track('User Liked', {
        userOne: currentUserId,
        userTwo: user.id,
      });

      const { data: existingMatch } = await supabase
        .from('matches')
        .select('*')
        .eq('id', currentUserId)
        .eq('matched_user_id', user.id)
        .single();

      if (existingMatch) {
        setAlertMessage('Jullie zijn al gematcht!');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return;
      }

      const { data: mutualLikeData, error: mutualLikeError } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('liked_user_id', currentUserId)
        .single();

      if (mutualLikeError && mutualLikeError.code !== 'PGRST116') {
        console.error('Error checking mutual like:', mutualLikeError);
        return;
      }

      if (mutualLikeData && mutualLikeData.love_like === likeValue) {
        const { error: matchError } = await supabase
          .from('matches')
          .insert([{
              id: currentUserId,
              matched_user_id: user.id,
              love_like: likeValue,
            }]);

        if (matchError) {
          console.error('Error creating match:', matchError);
          setAlertMessage('Er is een fout opgetreden bij het maken van de match, probeer het opnieuw.');
          return;
        }
        track('users matched', {
          userOne: currentUserId,
          userTwo: user.id
        })

        const deleteLikes = await Promise.all([supabase
            .from('likes')
            .delete()
            .eq('user_id', currentUserId)
            .eq('liked_user_id', user.id),
          supabase
            .from('likes')
            .delete()
            .eq('user_id', user.id)
            .eq('liked_user_id', currentUserId),
        ]);

        if (deleteLikes.some(({ error }) => error)) {
          console.error('Error removing likes:', deleteLikes);
          setAlertMessage('Er is een fout opgetreden bij het verwijderen van de likes, probeer het opnieuw.');
          return;
        }

        setAlertMessage(`Het is een ${likeValue === 'true' ? 'love' : 'friend'} match! 🎉`);
      } else {
        setAlertMessage('Gebruiker succesvol geliket!');
      }
      
    } catch (error) {
      console.error('Error in handleLoveClick:', error.message || error);
      setAlertMessage('Er is een fout opgetreden, probeer het opnieuw.');
    }
  };

  return (
    <div className={`relative user-card ${currentTheme.cardBg} rounded-lg shadow-lg p-6 mb-6 w-80 mx-auto`}>
      {alertMessage && <CustomAlert message={alertMessage} theme={theme} />} {/* Pass the theme to CustomAlert */}
      <CarouselCard userId={user.id} />
      <h2 className={`name text-2xl font-semibold ${currentTheme.textColor} text-center`}>{user.name}</h2>
      <div className={`info text-left mt-4 ${currentTheme.textColor}`}>
        <p className="age">
          <FontAwesomeIcon icon={faUser} className="mr-2" title="Leeftijd" />
          {user.age} jaar
        </p>
        <p className="location">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" title="Locatie" />
          {user.location}
        </p>
        <p className="facility">
          <FontAwesomeIcon icon={faBuilding} className="mr-2" title="Faciliteit" />
          {user.facility}
        </p>
      </div>
      <div className={`hobbies mt-4 text-left ${currentTheme.textColor}`}>
        <span className="hobbies-label font-bold">Hobby's:</span>
        <div className="hobby-icons flex flex-wrap gap-3 mt-2">
          {hobbies.length > 0 ? (
            hobbies.map((hobby, index) => (
              <span key={index} className="hobby-item flex items-center text-sm">
                <span className="mr-2 text-xl">{hobbyIcons[hobby] || defaultHobbyIcon}</span>
                {hobby}
              </span>
            ))
          ) : (
            <p>Geen hobby's vermeld</p>
          )}
        </div>
      </div>
      <div className="actions flex justify-between mt-6">
        {showLoveButton ? (
          <button
            className={`love-button flex items-center ${currentTheme.buttonBg} text-white px-4 py-2 rounded-full shadow-lg ${currentTheme.buttonHoverBg}`}
            onClick={() => handleLoveClick(true)}
          >
            <FontAwesomeIcon icon={faHeart} className="mr-2" title="Liefde" />
            Love
          </button>
        ) : (
          <button
            className={`like-button flex items-center ${currentTheme.buttonBg} text-white px-4 py-2 rounded-full shadow-lg ${currentTheme.buttonHoverBg}`}
            onClick={() => handleLoveClick(false)}
          >
            <FontAwesomeIcon icon={faThumbsUp} className="mr-2" title="Like" />
            Like
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
