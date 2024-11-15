import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faBuilding } from '@fortawesome/free-solid-svg-icons';
//import { hobbyIcons } from './hobbyIcons'; // Import hobby icons map
import { faTimes,faHeart, faMusic, faBook, faGamepad, faPaw, faDumbbell, faUtensils, faCamera } from '@fortawesome/free-solid-svg-icons';


export const hobbyIcons = {
  music: faMusic,
  reading: faBook,
  gaming: faGamepad,
  animals: faPaw,
  fitness: faDumbbell,
  cooking: faUtensils,
  art: faCamera,
  photography: faCamera,
  tech: faGamepad,
  outdoor: faPaw,
};


const UserCard = ({ user }) => {
  return (
    <div className="user-card bg-[#fff1f2] rounded-lg shadow-lg p-6 mb-6 w-80 mx-auto transition-transform duration-300 hover:scale-105">
      <img
        className="profile-picture w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-[#fb7185]"
        src={`data:image/jpeg;base64,${user.profilePicture}`}
        alt={`${user.name} profile`}
      />
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
      <div className="hobbies mt-4 text-left">
        <span className="hobbies-label text-[#fb7185] font-bold">Hobbies:</span>
        <div className="hobby-icons flex space-x-3 mt-2">
          {user.hobbies.map((hobby, index) => (
            <span key={index} className="hobby-item flex items-center text-[#360009] text-lg">
              <FontAwesomeIcon icon={hobbyIcons[hobby]} className="mr-2 text-[#f43f5e]" />
              {hobby.charAt(0).toUpperCase() + hobby.slice(1)}
            </span>
          ))}
        </div>
      </div>
      <p className="bio mt-4 text-[#360009] text-left">{user.bio}</p>
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
