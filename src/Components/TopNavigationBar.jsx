import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHeart, faUserFriends, faComment, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const TopNavigationBar = ({ loggedIn, logout }) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNavigate = (path) => {
    if (path === '/logout') {
      setShowLogoutConfirm(true);
      return;
    }
    navigate(path);
  };

  const handleLogOut = () => {
    logout();
    if (loggedIn) {
      logout();
      navigate('/login');
      setShowLogoutConfirm(false);
    }
  };

  const leftItem = { icon: faHome, label: 'Home', path: '/' };
  const centerItems = [
    { icon: faHeart, label: 'Find Love', path: '/feed' },
    { icon: faUserFriends, label: 'Friends', path: '/feed' },
    { icon: faComment, label: 'Messages', path: '/chats' },
    { icon: faCog, label: 'Settings', path: '/settingsUser' }
  ];
  const rightItem = { icon: faSignOutAlt, label: 'Logout', path: '/logout' };

  const NavItem = ({ item }) => (
    <div 
      className="group flex flex-col items-center cursor-pointer relative"
      onClick={() => handleNavigate(item.path)}
    >
      <FontAwesomeIcon
        icon={item.icon}
        className="text-white text-sm md:text-lg transition duration-300 hover:text-rose-700"
      />
      <span className="absolute bottom-[-1.2rem] left-1/2 transform -translate-x-1/2 text-white text-xs mt-1 bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 md:opacity-100 md:static md:bg-transparent md:translate-x-0">
        {item.label}
      </span>
    </div>
  );

  return (
    <div>
      <div
        className="fixed top-0 left-0 right-0 flex items-center py-1 md:py-2 px-2 md:px-4"
        style={{ backgroundColor: '#f43f5e', zIndex: 10, borderRadius: '8px' }} // Added borderRadius here
      >
        <div className="w-12 md:w-20">
          <NavItem item={leftItem} />
        </div>

        <div className="flex-1 flex justify-center gap-2 md:gap-8">
          {centerItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>

        <div className="w-12 md:w-20 flex justify-end">
          <NavItem item={rightItem} />
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-3 rounded shadow-lg">
            <p>Are you sure you want to log out?</p>
            <div className="flex justify-end gap-2 mt-3">
              <button
                className="px-3 py-1 bg-gray-300 rounded text-sm"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-white rounded text-sm"
                style={{ backgroundColor: '#f43f5e' }}
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavigationBar;
