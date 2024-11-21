import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import UserCard from '../Components/Feed/UserCard';
import { useAuth } from '../hooks/AuthContext';
import { calculateDistance, useDistanceMatrixService } from '../Components/Feed/GoogleMapsMatrixAPI';



const Feed = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mustSpin, setMustSpin] = useState(false);

  const isDistanceServiceInitialized = useDistanceMatrixService();
  const USERS_TO_FETCH = 10;

  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

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
        .select('id, birthday, name, profilepictureBASE64, city, facility, gender')
        .not('name', 'is', null)
        .not('profilepictureBASE64', 'is', null)
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
            location: `${potentialUser.city} (${distance})`, // Added distance to location
            facility: potentialUser.facility,
            birthday: potentialUser.birthday,
            age,
            profilePicture: potentialUser.profilepictureBASE64,
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
      backgroundColor: index % 2 === 0 ? '#fff1f2' : '#881337',
      textColor: index % 2 === 0 ? '#881337' : '#fff1f2',
    },
    imageURI: `data:image/jpeg;base64,${user.profilePicture}`,
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
            {error
              ? `Error loading users: ${error}`
              : 'Geen match gevonden. Probeer later opnieuw, of pas je filtervoorkeuren aan.'}
          </p>
          <button
            onClick={() => (error ? window.location.reload() : (window.location.href = '/userFilterForm'))}
            className="mt-2 text-[#fb7185] underline hover:no-underline"
          >
            {error ? 'Retry' : 'Filter opnieuw'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-8 bg-[#ffccd3]">
      <div className="max-w-6xl mx-auto mt-7 p-6 bg-[#ffccd3] pt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-[#360009]">
            Gebruik de spin knop om echte liefde te ontdekken!
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={currentIndex}
                data={wheelData}
                onStopSpinning={handleWheelStop}
                radiusLineWidth={1}
                radiusLineColor="#fff"
                outerBorderWidth={2}
                outerBorderColor="#fb7185"
                fontSize={16}
                perpendicularText
                textDistance={70}
              />
              {/* Updated button styling */}
              <motion.button
  className="absolute inset-0 w-20 h-20 m-auto rounded-full bg-white shadow-lg text-[#fb7185] font-bold z-10 flex items-center justify-center"
  onClick={handleSpinClick}
  disabled={mustSpin}
  whileHover={{ scale: mustSpin ? 1 : 1.1 }}
>
  {mustSpin ? 'Spinning...' : 'Spin'}
</motion.button>

            </div>
          </div>

          <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              {mustSpin ? (
                <motion.div
                  className="text-xl text-center text-[#360009]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Onze vinder is op zoek naar een mogelijke vlinder...
                </motion.div>
              ) : (
                <motion.div
                  key={users[currentIndex]?.id}
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