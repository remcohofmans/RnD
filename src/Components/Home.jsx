import React, { useCallback } from 'react';
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
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center bg-white shadow-md p-4">
        <h1 className="text-purple-700 text-3xl font-bold">V(l)inder</h1>
        <div className="flex space-x-4">
          <button className="text-gray-700 hover:text-purple-600 font-medium" onClick={handleGoToFeed}>Feed</button>
          <button className="text-gray-700 hover:text-purple-600 font-medium" onClick={handleButtonClick}>
            {loggedIn ? 'Log out' : 'Login'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex bg-gradient-to-tr from-purple-50 to-purple-100 relative">
        <div className="w-full h-full opacity-40 bg-cover bg-center absolute" style={{ backgroundImage: `url(${butterflyImage})` }}></div>
        <div className="relative z-10 w-full flex items-center justify-center text-center font-poppins py-20 px-4">
          <div className="text-gray-800 space-y-4 max-w-xl mx-auto">
            <h1 className="text-5xl font-bold leading-tight">Find Your Perfect Match</h1>
            <p className="text-lg leading-relaxed max-w-lg mx-auto">Discover connections that matter, whether it's friendship, romance, or networking.</p>
            <button
              className="mt-6 py-3 px-8 bg-purple-600 text-white rounded-lg text-xl hover:bg-purple-700 transition-transform transform hover:scale-105"
              onClick={handleButtonClick}
            >
              {loggedIn ? 'Log out' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-gray-50 py-16 px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Why Choose V(l)inder?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold mb-4 text-purple-700">Smart Matching</h3>
            <p className="text-gray-600 leading-relaxed">Our advanced algorithm ensures you're paired with like-minded individuals for meaningful connections.</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold mb-4 text-purple-700">Privacy First</h3>
            <p className="text-gray-600 leading-relaxed">We prioritize your privacy and security, so you can connect with peace of mind.</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold mb-4 text-purple-700">Seamless Experience</h3>
            <p className="text-gray-600 leading-relaxed">Our platform is designed to provide a smooth and enjoyable user experience from start to finish.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 py-16 px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">What Our Users Say</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="bg-white shadow-lg p-6 rounded-lg max-w-md">
            <p className="text-lg text-gray-600 leading-relaxed">"V(l)inder helped me find my soulmate! The matching process was so easy and accurate."</p>
            <p className="mt-4 text-xl font-semibold text-purple-600">- Sarah T.</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg max-w-md">
            <p className="text-lg text-gray-600 leading-relaxed">"I've made so many new friends thanks to this platform. Highly recommend!"</p>
            <p className="mt-4 text-xl font-semibold text-purple-600">- Jake L.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left">© 2024 V(l)inder. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-purple-400">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
