import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import butterflyImage from '../Assets/Butterfly.png'; // Import the butterfly image
import { supabase } from '../lib/helper/supabaseClient'; 
import TopNavigationBar from './TopNavigationBar';

const Home = ({ loggedIn, logout, email }) => {
  const navigate = useNavigate();
  const [isPausedModalOpen, setIsPausedModalOpen] = useState(false); // State to control modal visibility

  const handleButtonClick = useCallback(() => {
    if (loggedIn) {
      logout(); // Call the logout function passed as prop
      navigate('/login'); // Redirect to login page after logout
    } else {
      navigate('/login'); // Redirect to login page if user is not logged in
    }
  }, [loggedIn, logout, navigate]);

  const handleGoToFeed = useCallback(async () => {
    try {
      // Query Supabase to get the account status
      const { data, error } = await supabase
        .from('users')
        .select('status')
        .eq('email', email)
        .single(); // Assuming email uniquely identifies the user

      if (error) {
        console.error('Error fetching account status:', error);
        return;
      }

      if (data.status === 'PAUSED') {
        setIsPausedModalOpen(true); // Open the modal if account is paused
      } else {
        navigate('/feed'); // Navigate to feed if account is active
      }
    } catch (err) {
      console.error('Error checking account status:', err);
    }
  }, [navigate, email]);

  // Function to unpause the account
  const handleUnpauseAccount = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'ACTIVE' })
        .eq('email', email);

      if (error) {
        console.error('Error updating account status:', error);
        return;
      }

      setIsPausedModalOpen(false); // Close the modal after unpausing
      navigate('/feed'); // Redirect to the feed after account is unpaused
    } catch (err) {
      console.error('Error updating account status:', err);
    }
  }, [navigate, email]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Use the new TopNavigationBar */}
      <div className="relative z-50">
        <TopNavigationBar />
      </div>

      {/* Modal Overlay */}
      {isPausedModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-lg">
            <h2 className="text-2xl font-bold text-[#f43f5e] mb-4">Account Paused</h2>
            <p className="text-gray-600 mb-6">Your account is currently paused. You cannot access the feed until it is reactivated.</p>
            <button
              className="px-4 py-2 bg-[#f43f5e] text-white rounded hover:bg-[#e11d48] mr-4"
              onClick={handleUnpauseAccount}
            >
              Unpause Account
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={() => setIsPausedModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="flex-1 flex bg-gradient-to-tr from-[#fff1f2] to-[#ffe4e6] relative pt-20">
        <div className="w-full h-full opacity-40 bg-cover bg-center absolute" style={{ backgroundImage: `url(${butterflyImage})` }}></div>
        <div className="relative z-10 w-full flex items-center justify-center text-center font-poppins py-20 px-4">
          <div className="text-gray-800 space-y-4 max-w-xl mx-auto">
            <h1 className="text-5xl font-bold leading-tight text-[#881337]">Find Your Perfect Match</h1>
            <p className="text-lg leading-relaxed max-w-lg mx-auto">Discover connections that matter, whether it's friendship, romance, or networking.</p>
            <button
              className="mt-6 py-3 px-8 bg-[#f43f5e] text-white rounded-lg text-xl hover:bg-[#e11d48] transition-transform transform hover:scale-105"
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
            <h3 className="text-2xl font-bold mb-4 text-[#f43f5e]">Smart Matching</h3>
            <p className="text-gray-600 leading-relaxed">Our advanced algorithm ensures you're paired with like-minded individuals for meaningful connections.</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold mb-4 text-[#f43f5e]">Privacy First</h3>
            <p className="text-gray-600 leading-relaxed">We prioritize your privacy and security, so you can connect with peace of mind.</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold mb-4 text-[#f43f5e]">Seamless Experience</h3>
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
            <p className="mt-4 text-xl font-semibold text-[#f43f5e]">- Sarah T.</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg max-w-md">
            <p className="text-lg text-gray-600 leading-relaxed">"I've made so many new friends thanks to this platform. Highly recommend!"</p>
            <p className="mt-4 text-xl font-semibold text-[#f43f5e]">- Jake L.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left">© 2024 V(l)inder. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-[#f43f5e]">Privacy Policy</a>
            <a href="#" className="hover:text-[#f43f5e]">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
