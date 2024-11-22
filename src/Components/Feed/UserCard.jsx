import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMapMarkerAlt,
  faBuilding,
  faTimes,
  faHeart,
  faStar,
  faComment 
} from '@fortawesome/free-solid-svg-icons';

import { availableHobbies } from '../filter/AvailableHobbiesPage';
import { supabase } from '../../supabaseClient';
import CarouselCard from '../Feed/CarouselCard';

const hobbyIcons = availableHobbies.reduce((acc, hobby) => {
  acc[hobby.name] = hobby.icon;
  return acc;
}, {});
const defaultHobbyIcon = faStar;


const UserCard = ({ user, currentUserId }) => {

  const hobbies = Array.isArray(user?.hobbies) ? user.hobbies : [];


  const handleLoveClick = async () => {
    try {
      console.log("Logged-in user ID: ", currentUserId, "liked_user_id: ", user.id);
      
      // Check if like already exists
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('liked_user_id', user.id)
        .single();
  
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
        console.error('Error checking existing like:', checkError);
        return;
      }
  
      if (existingLike) {
        alert('You have already liked this user!');
        return;
      }
  
      // Insert new like
      const { data: likeData, error: likeError } = await supabase
        .from('likes')
        .insert([{ user_id: currentUserId, liked_user_id: user.id }]);
  
      if (likeError) {
        console.error('Supabase error:', likeError);
        alert('Error liking user, please try again.');
        return;
      }
  
      // Check if the other user has already liked the current user
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
  
      // If there's a mutual like, create a match and remove the likes
      if (mutualLikeData) {
        // Insert into matches table with both user IDs
        const { error: matchError } = await supabase
          .from('matches')
          .insert([{ 
            id: currentUserId,
            matched_user_id: user.id
          }]);
  
        if (matchError) {
          console.error('Error creating match:', matchError);
          alert('Error creating match, please try again.');
          return;
        }
  
      // Delete first like (current user's like)
      const { error: deleteFirstLikeError } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', currentUserId)
      .eq('liked_user_id', user.id);

      if (deleteFirstLikeError) {
      console.error('Error removing first like:', deleteFirstLikeError);
      alert('Error updating match status, please try again.');
      return;
      }

      // Delete second like (other user's like)
      const { error: deleteSecondLikeError } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('liked_user_id', currentUserId);

      if (deleteSecondLikeError) {
      console.error('Error removing second like:', deleteSecondLikeError);
      alert('Error updating match status, please try again.');
      return;
      }
        
        alert('It\'s a match! 🎉');
      } else {
        alert('User liked successfully!');
      }
  
    } catch (error) {
      console.error('Error in handleLoveClick:', error.message || error);
      alert('An error occurred, please try again.');
    }
  };

  return (
    <div className="user-card bg-rose-200 rounded-lg shadow-lg p-6 mb-6 w-80 mx-auto">
      {/* Profile Picture */}
      {/* <img
        className="profile-picture w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-[#fb7185]"
        src={`data:image/jpeg;base64,${user.profilePicture}`}
        alt={`${user.name} profile`}
      /> */}
      <CarouselCard userId={user.id} />


      {/* User Info */}
      <h2 className="name text-2xl font-semibold text-[#360009] text-center">{user.name}</h2>
      <div className="info text-left mt-4">
        <p className="age text-[#360009]">
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          {user.age} jaar
        </p>
        <p className="location text-[#360009]">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          {user.location}
        </p>
        <p className="facility text-[#360009]">
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          {user.facility}
        </p>
      </div>


      {/* Hobbies Section */}
      <div className="hobbies mt-4 text-left">
        <span className="hobbies-label text-[#fb7185] font-bold">Hobbies:</span>
        <div className="hobby-icons flex flex-wrap gap-3 mt-2">
          {hobbies.length > 0 ? (
            hobbies.map((hobby, index) => (
              <span key={index} className="hobby-item flex items-center text-[#360009] text-sm">
                <span className="mr-2 text-xl">{hobbyIcons[hobby] || defaultHobbyIcon}</span>
                {hobby}
              </span>
            ))
          ) : (
            <p className="text-[#360009]">No hobbies listed</p>
          )}
        </div>
      </div>



      {/* Action Buttons */}
      <div className="actions flex justify-between mt-6">
        <button
          className="love-button flex items-center bg-[#fb7185] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#f43f5e] "
          onClick={handleLoveClick}
        >
          <FontAwesomeIcon icon={faHeart} className="mr-2" /> Love
        </button>
        <button className="chat-button flex items-center bg-[#ffccd3] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#f43f5e] ">
          <FontAwesomeIcon icon={faComment} className="mr-2" /> Chat
        </button>
      </div>
    </div>
  );
};

export default UserCard;
