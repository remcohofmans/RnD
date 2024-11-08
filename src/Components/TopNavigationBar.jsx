import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHeart, faUserFriends, faComment, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const TopNavigationBar = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNavigate = (path) => {
    if (path === '/logout') {
      setShowLogoutConfirm(true);
      return;
    }
    navigate(path);
  };

  const confirmLogout = (confirm) => {
    if (confirm) {
      // Add your logout logic here
      navigate('/login');
    }
    setShowLogoutConfirm(false);
  };

  // Define navigation items
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
      className="flex flex-col items-center cursor-pointer md:flex-row md:gap-2"
      onClick={() => handleNavigate(item.path)}
    >
      <FontAwesomeIcon
        icon={item.icon}
        className="text-white text-xl md:text-2xl transition duration-300 hover:text-rose-700"
      />
      {/* Show label only on medium screens and above */}
      <span className="hidden md:inline text-white text-xs mt-1">{item.label}</span>
    </div>
  );

  return (
    <div>
      {/* Top Navigation Bar */}
      <div
        className="fixed top-0 left-0 right-0 flex items-center py-2 md:py-4 px-4"
        style={{ backgroundColor: '#f43f5e', zIndex: 10 }}
      >
        {/* Left item (Home) */}
        <div className="w-16 md:w-24">
          <NavItem item={leftItem} />
        </div>
  
        {/* Center items */}
        <div className="flex-1 flex justify-center gap-4 md:gap-12">
          {centerItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>
  
        {/* Right item (Logout) */}
        <div className="w-16 md:w-24 flex justify-end">
          <NavItem item={rightItem} />
        </div>
      </div>
  
      {/* Padding for other components below the navigation bar */}
      <div className="pt-16 md:pt-20">
        {/* Main Content */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <p>Are you sure you want to log out?</p>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => confirmLogout(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-white rounded"
                  style={{ backgroundColor: '#f43f5e' }}
                  onClick={() => confirmLogout(true)}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavigationBar;
