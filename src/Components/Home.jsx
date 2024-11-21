import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import butterflyImage from '../Assets/Butterfly.png'; // Import the butterfly image
import { supabase } from '../lib/helper/supabaseClient';
import { useAuth } from '../hooks/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const [isPausedModalOpen, setIsPausedModalOpen] = useState(false); // State to control modal visibility
  const { user, logout, role } = useAuth();
  const email = user?.email;
  const loggedIn = !!user;

  useEffect(() => {
    console.log("User:", user);
    console.log("email:", email);
    console.log("Role:", role);
    if (role === 'STAFF_MEMBER') {
      navigate('/settingsMentor');
    }
  }, [navigate, role]);

  const handleButtonClick = useCallback(() => {
    if (loggedIn) {
      logout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  }, [loggedIn, logout, navigate]);

  const handleGoToFeed = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('status')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error fetching account status:', error);
        return;
      }

      if (data.status === 'PAUSED') {
        setIsPausedModalOpen(true);
      } else {
        navigate('/feed');
      }
    } catch (err) {
      console.error('Error checking account status:', err);
    }
  }, [navigate, email]);

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

      setIsPausedModalOpen(false);
      navigate('/feed');
    } catch (err) {
      console.error('Error updating account status:', err);
    }
  }, [navigate, email]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative z-50"></div>

      {isPausedModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-lg">
            <h2 className="text-2xl font-bold text-[#f43f5e] mb-4">Account Paused</h2>
            <p className="text-gray-600 mb-6">
              Your account is currently paused. You cannot access the feed until it is reactivated.
            </p>
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
      <div className="flex-1 flex bg-gradient-to-tr from-[#fff1f2] to-[#ffe4e6] relative">
        <div
          className="relative w-full h-full opacity-80 bg-cover bg-center flex items-center justify-center text-center font-poppins py-20 px-4"
          style={{
            backgroundImage: `url(${butterflyImage})`,
            backgroundColor: '#ffccd3',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
          }}
        >
          <div className="text-gray-800 space-y-4 max-w-xl mx-auto z-10">
            <h1 className="text-5xl font-bold leading-tight text-[#881337]">Vlinder</h1>
            <h2 className="text-xl leading-relaxed max-w-lg mx-auto">
              <b>Find Your Perfect Match</b>
            </h2>
            <p className="text-lg leading-relaxed max-w-lg mx-auto">
              Smeed nieuwe vriendschappen, vind de liefde of ontdek spannende avonturen!
            </p>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-gray-50 py-16 px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Waarom Kiezen Voor V(l)inder?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {['Smart Matching', 'Privacy Eerst', 'Onvergetelijke Ervaring'].map((title, index) => (
            <div
              key={index}
              className="bg-white shadow-lg p-6 rounded-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col"
            >
              <h3 className="text-2xl font-bold mb-4 text-[#f43f5e]">{title}</h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                {index === 0
                  ? 'Ons geavanceerde algoritme zorgt ervoor dat er mensen in uw feed verschijnen die aan uw verwachtingen kunnen voldoen.'
                  : index === 1
                  ? 'We geven prioriteit aan uw privacy en veiligheid, zodat u met een gerust hart connecties kunt maken.'
                  : 'Ons platform is ontworpen om u een zalige en ongeëvenaarde ervaring te bieden.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 py-16 px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Wat Onze Gebruikers Zeggen</h2>
        <div className="flex flex-col md:flex-row justify-center items-stretch space-y-6 md:space-y-0 md:space-x-8">
          {[
            { text: 'V(l)inder heeft me geholpen mijn soulmate te vinden! Het matchingsproces was zo eenvoudig en nauwkeurig.', name: 'Sarah T.' },
            { text: 'Ik heb zoveel nieuwe vrienden gemaakt dankzij dit platform. Een echte aanrader!', name: 'Jake L.' },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white shadow-lg p-6 rounded-lg max-w-md flex flex-col justify-between"
            >
              <p className="text-lg text-gray-600 leading-relaxed">{testimonial.text}</p>
              <p className="mt-4 text-xl font-semibold text-[#f43f5e]">- {testimonial.name}</p>
            </div>
          ))}
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
