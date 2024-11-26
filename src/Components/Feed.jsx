import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/helper/supabaseClient';
import UserCard from '../Components/Feed/UserCard';
import { useAuth } from '../hooks/AuthContext';
import { calculateDistance, useDistanceMatrixService } from '../Components/Feed/GoogleMapsMatrixAPI';
import CarouselCard from '../Components/Feed/CarouselCard';

const Feed = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mustSpin, setMustSpin] = useState(false);

  const isDistanceServiceInitialized = useDistanceMatrixService();
  const USERS_TO_FETCH = 10;

  // Function to calculate the user's age
  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Fetch user data and filter based on preferences
  const fetchUserData = async (distanceServiceReady) => {
    if (!distanceServiceReady) {
      console.error("Distance Matrix Service not ready.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: userPreferences } = await supabase
        .from('userpreferences')
        .select('distance, min_age, max_age, interest')
        .eq('id', user.id)
        .single();

      const { data: currentUserData } = await supabase
        .from('users')
        .select('city')
        .eq('id', user.id)
        .single();

      if (!currentUserData?.city) {
        throw new Error("Your location is not set. Please update your profile.");
      }

      const currentUserCity = currentUserData.city;
      const maxDistance = userPreferences.distance;

      const { data: fetchedUsers } = await supabase
        .from('users')
        .select('id, birthday, name, city, facility, gender')
        .not('name', 'is', null)
        .not('birthday', 'is', null)
        .not('city', 'is', null)
        .limit(USERS_TO_FETCH);

      if (!fetchedUsers || fetchedUsers.length === 0) {
        setUsers([]);
        return;
      }

      const usersWithDetails = await Promise.all(
        fetchedUsers.map(async (potentialUser) => {
          const age = calculateAge(potentialUser.birthday);

          if (
            age < userPreferences.min_age ||
            age > userPreferences.max_age ||
            (userPreferences.interest !== 'geen-voorkeur' &&
              potentialUser.gender !== userPreferences.interest)
          ) {
            return null;
          }

          const distance = await calculateDistance(currentUserCity, potentialUser.city);

          if (parseFloat(distance) > maxDistance) {
            return null;
          }

          const { data: preferencesData } = await supabase
            .from('userpreferences')
            .select('hobbies')
            .eq('id', potentialUser.id)
            .single();

          return {
            id: potentialUser.id,
            name: potentialUser.name || 'Anonymous',
            location: `${potentialUser.city} (${distance})`,
            facility: potentialUser.facility,
            birthday: potentialUser.birthday,
            age,
            hobbies: preferencesData?.hobbies ? JSON.parse(preferencesData.hobbies) : [],
            distance,
          };
        })
      );

      setUsers(usersWithDetails.filter(Boolean).slice(0, USERS_TO_FETCH));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDistanceServiceInitialized) {
      fetchUserData(isDistanceServiceInitialized);
    }
  }, [isDistanceServiceInitialized]);

  const wheelData = users.map((user, index) => ({
    option: user.name,
    style: {
      backgroundColor: index % 3 === 0 ? '#fff1f2' : index % 3 === 1 ? '#fb7185' : '#881337',
      textColor: index % 3 === 0 ? '#881337' : '#fff1f2'
    }
  }));

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newIndex = Math.floor(Math.random() * users.length);
      setCurrentIndex(newIndex);
      setMustSpin(true);
    }
  };

  const handleWheelStop = () => {
    setMustSpin(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mt-12 bg-rose-50 rounded-lg shadow-md">
          <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  // Error or no users found
  if (error || users.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mt-12 bg-rose-50 rounded-lg">
          <div className="text-center p-4 bg-rose-100 rounded-lg">
            <p className="text-gray-800">
              {error ? `Error loading users: ${error}` : 'Geen match gevonden. Probeer later opnieuw, of pas je filtervoorkeuren aan.'}
            </p>
            <button
              onClick={() => (error ? window.location.reload() : (window.location.href = '/userFilterForm'))}
              className="mt-2 text-rose-400 underline hover:no-underline"
            >
              {error ? 'Retry' : 'Filter opnieuw'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-20 py-12"> {/* Added pt-16 for extra top padding */}
        
      <div className="text-center mb-12">
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Wheel */}
          <div className="flex flex-col items-center justify-start bg-rose-50">

          <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-rose-950">Spin en ontdek echte liefde!</h1>
        </div>
          
              <div className="relative w-full max-w-md mx-auto">
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={currentIndex}
                  data={wheelData}
                  onStopSpinning={handleWheelStop}
                  radiusLineWidth={1}
                  radiusLineColor="rgb(255, 255, 255)"
                  outerBorderWidth={2}
                  outerBorderColor="rgb(251, 113, 133)"
                  fontSize={16}
                  perpendicularText
                  textDistance={70}
                />
                <motion.button
                  className="absolute inset-0 w-20 h-20 m-auto rounded-full bg-white shadow-lg text-rose-400 font-bold z-10 flex items-center justify-center hover:bg-rose-50 transition-colors duration-200"
                  onClick={handleSpinClick}
                  disabled={mustSpin}
                  whileHover={{ scale: mustSpin ? 1 : 1.1 }}
                >
                  {mustSpin ? 'Spinning...' : 'Spin'}
                </motion.button>
              </div>
          </div>

          {/* Right Column - User Card */}
          <div className="flex flex-col items-center justify-start bg-rose-50 ">
            <AnimatePresence mode="wait">
              {mustSpin ? (
                <motion.div
                  className="text-xl text-center text-rose-950 p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12  border-b-2 border-rose-400"></div>
                    <p>Onze vinder is op zoek naar een mogelijke vlinder...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={users[currentIndex]?.id}
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserCard user={users[currentIndex]} currentUserId={user.id} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
