import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faMapMarkerAlt, 
  faBuilding,
  faTimes, 
  faHeart, 
  faStar
} from '@fortawesome/free-solid-svg-icons';

import { availableHobbies } from '../filter/AvailableHobbiesPage';


const hobbyIcons = availableHobbies.reduce((acc, hobby) => {
  acc[hobby.name] = hobby.icon;
  return acc;
}, {});

// Fallback icon for hobbies without specific mappings
const defaultHobbyIcon = faStar;

const UserCard = ({ user }) => {
  // Ensure hobbies is always an array
  const hobbies = Array.isArray(user?.hobbies) ? user.hobbies : [];

  return (
    <div className="user-card bg-[#fff1f2] rounded-lg shadow-lg p-6 mb-6 w-80 mx-auto transition-transform duration-300 hover:scale-105">
      {/* Profile Picture */}
      <img
        className="profile-picture w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-[#fb7185]"
        src={`data:image/jpeg;base64,${user.profilePicture}`}
        alt={`${user.name} profile`}
      />
      
      {/* User Info */}
      <h2 className="name text-2xl font-semibold text-[#360009] text-center">{user.name}</h2>
      <div className="info text-left mt-4">
        <p className="age text-[#360009]">
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          {user.age} years
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
      
      {/* Bio Section */}
      {user.bio && <p className="bio mt-4 text-[#360009] text-left">{user.bio}</p>}
      
      {/* Action Buttons */}
      <div className="actions flex justify-between mt-6">
        <button className="love-button flex items-center bg-[#fb7185] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#f43f5e] transition-all duration-300">
          <FontAwesomeIcon icon={faHeart} className="mr-2" /> Love
        </button>
        <button className="skip-button flex items-center bg-[#ffccd3] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#f43f5e] transition-all duration-300">
          <FontAwesomeIcon icon={faTimes} className="mr-2" /> Skip
        </button>
      </div>
    </div>
  );
};

export default UserCard;
