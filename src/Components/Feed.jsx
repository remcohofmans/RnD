import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import UserCard from '../Components/Feed/UserCard';
import TopNavigationBar from './TopNavigationBar'; // Import TopNavigationBar

const Feed = ({ user, logout }) => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(user?.id); // Use user prop

  const USERS_TO_FETCH = 10;

  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const { data: userPreferences } = await supabase
        .from('userpreferences')
        .select('interest, min_age, max_age')
        .eq('id', user.id)
        .single();
  
      const { data: fetchedUsers } = await supabase
        .from('users')
        .select('id, birthday, name, profilepictureBASE64, city, facility, gender')
        .not('name', 'is', null)
        .not('profilepictureBASE64', 'is', null)
        .not('birthday', 'is', null)
        .limit(USERS_TO_FETCH);
  
      const usersWithDetails = await Promise.all(
        fetchedUsers.map(async user => {
          const age = calculateAge(user.birthday);
          if (age < userPreferences.min_age || 
              age > userPreferences.max_age || 
              (userPreferences.interest !== 'geen-voorkeur' && user.gender !== userPreferences.interest)) {
            return null;
          }
  
          const { data: preferencesData } = await supabase
            .from('userpreferences')
            .select('hobbies')
            .eq('id', user.id)
            .single();
  
          return {
            id: user.id,
            name: user.name || 'Anonymous',
            location: user.city,
            facility: user.facility,
            birthday: user.birthday,
            age,
            profilePicture: user.profilepictureBASE64,
            hobbies: preferencesData?.hobbies ? JSON.parse(preferencesData.hobbies) : []
          };
        })
      );
  
      setUsers(usersWithDetails.filter(user => user).slice(0, USERS_TO_FETCH));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchUserData();
  }, [retryCount]);

  const wheelData = users.map((user, index) => ({
    option: user.name,
    style: { 
      backgroundColor: index % 2 === 0 ? '#fff1f2' : '#881337',
      textColor: index % 2 === 0 ? '#881337' : '#fff1f2'
    },
    optionSize: 20,
    imageURI: `data:image/jpeg;base64,${user.profilePicture}`
  }));

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newIndex = Math.floor(Math.random() * users.length);
      setCurrentIndex(newIndex);
      setMustSpin(true);

      // Log both the logged-in user ID and the selected user ID
      console.log('Logged-in user ID:', currentUserId);  // Using the state to access current user ID
      console.log('Selected user ID:', users[newIndex]?.id);
    }
  };

  const handleWheelStop = () => {
    setMustSpin(false); // Stop spinning after it completes
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-12 p-6 bg-[#ffccd3] rounded-lg shadow-md">
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
      </div>
    );
  }

  if (error || users.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mt-12 p-6 bg-[#ffccd3] rounded-lg shadow-md">
        <div className="text-center p-4 bg-white rounded-lg">
          <p className="text-gray-800">
            {error ? `Error loading users: ${error}` : 'No users found. Please try again later.'}
          </p>
          <button 
            onClick={() => setRetryCount(c => c + 1)}
            className="mt-2 text-[#fb7185] underline hover:no-underline"
          >
            {error ? 'Retry' : 'Refresh'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-8 bg-[#ffccd3]"> 
      {/* Integrate TopNavigationBar */}
      <div className="relative z-50">
        <TopNavigationBar loggedIn={!!user} logout={logout} />
      </div>

      {/* Main Feed Content */}
      <div className="max-w-6xl mx-auto mt-7 p-6 bg-[#ffccd3] pt-10"> {/* Adjusted padding for top margin */}
        {/* Welcome message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-[#360009]">Welcome to the Feed</h1>
          <p className="text-lg text-[#881337]">Use the Spin button to discover a new user!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center order-2 md:order-1">
            <div className="relative w-full max-w-md">
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={currentIndex}
                data={wheelData}
                backgroundColors={['#fff1f2', '#881337']}
                textColors={['#881337', '#fff1f2']}
                onStopSpinning={handleWheelStop} // Handle the stop of the wheel
                radiusLineWidth={1}
                radiusLineColor="#fff"
                outerBorderWidth={2}
                outerBorderColor="#fb7185"
                fontSize={16}
                perpendicularText={true}
                textDistance={70}
              />
              <motion.button
                className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-white shadow-lg z-20 text-[#fb7185] font-bold transition-transform"
                onClick={handleSpinClick}
                disabled={mustSpin}
                style={{ pointerEvents: mustSpin ? 'none' : 'auto' }} // Prevent hover effect when spinning
                whileHover={{ scale: mustSpin ? 1 : 1.05 }} // Apply hover only when not spinning
              >
                {mustSpin ? 'Spinning...' : 'Spin'}
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col items-center order-1 md:order-2">
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                {mustSpin ? (
                  <motion.div
                    className="text-xl text-center text-[#360009]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Searching...
                  </motion.div>
                ) : (
                  <motion.div
                    key={users[currentIndex]?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <UserCard user={users[currentIndex]} currentUserId={currentUserId} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
