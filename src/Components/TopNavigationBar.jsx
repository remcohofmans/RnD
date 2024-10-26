// TopNavigationBar.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHeart, faUserFriends, faComment, faCog } from '@fortawesome/free-solid-svg-icons'; // Use faUserFriends for friendship
import { useNavigate } from 'react-router-dom';

const TopNavigationBar = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 flex justify-around py-4"
      style={{ backgroundColor: '#f43f5e' }}
    >
      <FontAwesomeIcon
        icon={faHome}
        className="text-white text-2xl cursor-pointer transition duration-300 hover:text-rose-700" // Darkens on hover
        onClick={() => handleNavigate('/home')}
      />
      <FontAwesomeIcon
        icon={faHeart}
        className="text-white text-2xl cursor-pointer transition duration-300 hover:text-rose-700"
        onClick={() => handleNavigate('/feed')}
      />
      <FontAwesomeIcon
        icon={faUserFriends}
        className="text-white text-2xl cursor-pointer transition duration-300 hover:text-rose-700"
        onClick={() => handleNavigate('/feed')}
      />
      <FontAwesomeIcon
        icon={faComment}
        className="text-white text-2xl cursor-pointer transition duration-300 hover:text-rose-700"
        onClick={() => handleNavigate('/messages')}
      />
      <FontAwesomeIcon
        icon={faCog} // Settings icon
        className="text-white text-2xl cursor-pointer transition duration-300 hover:text-rose-700"
        onClick={() => handleNavigate('/settings')}
      />
    </div>
  );
};

export default TopNavigationBar;
