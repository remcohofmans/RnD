import React, { useCallback } from 'react';
import { FaUser } from 'react-icons/fa'; // Import icons as needed
import { useNavigate } from 'react-router-dom';
import butterflyImage from '../Assets/Butterfly.png'; // Import the butterfly image

const Home = ({ loggedIn, logout, email }) => {
  const navigate = useNavigate();

  const handleButtonClick = useCallback(() => {
    if (loggedIn) {
      logout(); // Call the logout function passed as prop
      navigate('/login'); // Redirect to login page after logout
    } else {
      navigate('/login'); // Redirect to login page if user is not logged in
    }
  }, [loggedIn, logout, navigate]);

  const handleGoToFeed = useCallback(() => {
    navigate('/feed'); // Redirect to feed page
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Left Half with Gradient Background */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-tr from-[#C5C3E0] to-[#7851A9] relative">
        <div className="absolute top-0 right-0 bottom-0 left-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url(${butterflyImage})` }}></div>
        <div className="relative z-10 text-center font-poppins">
          <h1 className="text-white text-5xl font-bold mb-4">V(l)inder</h1>
          <p className="text-white text-lg">Find your perfect match</p>
        </div>
      </div>

      {/* Right Half for User Info */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <div className="wrapper flex items-center justify-center w-full max-w-md py-10">
          <div className="bg-white shadow-xl rounded-3xl w-full py-8 px-6 mx-4 transform transition-transform duration-300 hover:scale-105">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Hi there!</h1>

            {/* Display Email Address */}
            {email && (
              <div className="text-center mb-6">
                <p className="text-lg text-gray-600">
                  Your email address is <span className="font-semibold">{email}</span>
                </p>
              </div>
            )}

            {/* Logout Button */}
            <div className="flex justify-center mb-4">
              <input
                className="py-4 px-4 w-full text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:bg-blue-600 transition-transform duration-300 transform hover:scale-105"
                type="button"
                onClick={handleButtonClick}
                value={loggedIn ? 'Log out' : 'Login'}
                aria-label={loggedIn ? 'Log out' : 'Login'}
              />
            </div>

            {/* Go to Feed Button */}
            <div className="flex justify-center">
              <input
                className="py-4 px-4 w-full text-lg bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:bg-green-600 transition-transform duration-300 transform hover:scale-105"
                type="button"
                onClick={handleGoToFeed}
                value="Go to Feed"
                aria-label="Go to Feed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
