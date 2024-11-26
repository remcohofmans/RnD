import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHeart, faUserFriends, faComment, faCog, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';

const TopNavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const loggedIn = !!user;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (path) => {
    if (path === '/logout') {
      setShowLogoutConfirm(true);
      return;
    }
    navigate(path);
  };

  const handleLogOut = () => {
    if (loggedIn) {
      logout();
      navigate('/login');
      setShowLogoutConfirm(false);
    }
  };

  const leftItem = { icon: faHome, label: 'Home', path: '/' };
  const centerItems = [
    { icon: faHeart, label: 'Liefde', path: '/feed' },
    { icon: faUserFriends, label: 'Vriendschap', path: '/feed' },
    { icon: faComment, label: 'Berichten', path: '/chats' },
    { icon: faCog, label: 'Instellingen', path: '/settingsUser' }
  ];
  const rightItem = { icon: faSignOutAlt, label: 'Log uit', path: '/logout' };

  const NavItem = ({ item, isActive }) => (
    <div
      className={`group flex flex-col items-center justify-center cursor-pointer relative py-2 h-full ${
        isActive ? 'bg-rose-700' : 'hover:bg-rose-700'
      }`}
      onClick={() => handleNavigate(item.path)}
    >
      <div className={`flex flex-col items-center px-4 ${isActive ? 'relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-white' : ''}`}>
        <FontAwesomeIcon
          icon={item.icon}
          className={`text-sm md:text-lg transition duration-300 ${
            isActive ? 'text-white scale-110' : 'text-white'
          }`}
        />
        <span className={`text-xs mt-1 transition-all duration-300
          ${isActive ? 'text-white font-medium' : 'text-white'}
          absolute bottom-[-1.2rem] left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100
          md:opacity-100 md:static md:bg-transparent md:translate-x-0 md:px-0 md:py-0`}>
          {item.label}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 bg-rose-600 z-50">
      <div className="container mx-auto flex items-center justify-between h-12 md:h-16">
        {/* Left Section (Home) */}
        <div className="flex items-center h-full">
          <NavItem item={leftItem} isActive={location.pathname === '/'} />
        </div>

        {/* Center Section (Icons) */}
        <div className="hidden md:flex flex-1 justify-center h-full">
          {centerItems.map((item, index) => (
            <NavItem
              key={index}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>

        {/* Right Section (Hamburger Menu & Logout Icon) */}
        <div className="flex items-center h-full">
          {/* Hamburger Menu for Small Screens */}
          <div className="block md:hidden px-4">
            <button
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FontAwesomeIcon icon={faBars} className="text-lg" />
            </button>
          </div>

          {/* Logout Icon for Large Screens */}
          <div className="hidden md:flex items-center h-full">
            <NavItem
              item={rightItem}
              isActive={location.pathname === '/logout'}
            />
          </div>
        </div>
      </div>

      {/* Dropdown Menu for Small Screens */}
      {isMenuOpen && (
        <div className="fixed top-12 left-0 right-0 bg-rose-600 text-white z-40 flex flex-col items-center py-4">
          {centerItems.map((item, index) => (
            <div
              key={index}
              className={`py-2 w-full text-center cursor-pointer ${
                location.pathname === item.path
                  ? 'bg-rose-700 font-medium'
                  : 'hover:bg-rose-700'
              }`}
              onClick={() => {
                setIsMenuOpen(false);
                handleNavigate(item.path);
              }}
            >
              {item.label}
            </div>
          ))}
          <div
            className="py-2 w-full text-center cursor-pointer hover:bg-rose-700"
            onClick={() => {
              setIsMenuOpen(false);
              handleLogOut();
            }}
          >
            Logout
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-transform duration-300 scale-95">
            <p className="text-lg font-medium text-gray-800">
              Are you sure you want to log out?
            </p>
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