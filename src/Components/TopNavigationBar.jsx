import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHeart, faUserFriends, faComment, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const TopNavigationBar = ({ loggedIn, logout }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
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

  const NavItem = ({ item, isActive }) => (
    <div 
      className={`group flex flex-col items-center cursor-pointer relative ${isActive ? 'text-rose-700' : 'text-white'}`} 
      onClick={() => handleNavigate(item.path)}
    >
      <FontAwesomeIcon
        icon={item.icon}
        className={`text-sm md:text-lg transition duration-300 ${isActive ? 'text-rose-700' : 'text-white'}`}
      />
      <span className="absolute bottom-[-1.2rem] left-1/2 transform -translate-x-1/2 text-white text-xs mt-1 bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 md:opacity-100 md:static md:bg-transparent md:translate-x-0">
        {item.label}
      </span>
    </div>
  );

  // Check if the current path matches the path of each navigation item
  const isHomeActive = location.pathname === '/';
  const isFeedActive = location.pathname === '/feed';
  const isChatsActive = location.pathname === '/chats';
  const isSettingsActive = location.pathname === '/settingsUser';
  const isLogoutActive = location.pathname === '/logout';

  return (
    <div>
      <div
        className="fixed top-0 left-0 right-0 flex items-center py-1 md:py-2 px-2 md:px-4"
        style={{ backgroundColor: '#f43f5e', zIndex: 10, borderRadius: '8px' }}
      >
        <div className="w-12 md:w-20">
          {/* Pass isActive prop to check if Home component is active */}
          <NavItem item={leftItem} isActive={isHomeActive} />
        </div>

        <div className="flex-1 flex justify-center gap-2 md:gap-8">
          {centerItems.map((item, index) => (
            <NavItem 
              key={index} 
              item={item} 
              isActive={location.pathname === item.path}
            />
          ))}
        </div>

        <div className="w-12 md:w-20 flex justify-end">
          {/* Check if Logout is active */}
          <NavItem item={rightItem} isActive={isLogoutActive} />
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-transform duration-300 scale-95">
            <p className="text-lg font-medium text-gray-800">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200 text-sm"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 text-sm"
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
