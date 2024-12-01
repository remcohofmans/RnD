import React, { useState, useEffect } from 'react';
import { Sparkle } from 'lucide-react';
import { Heart, Sparkles } from 'lucide-react';
import { Wheel } from 'react-custom-roulette';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/helper/supabaseClient';
import UserCard from './Feed/UserCard';
import { useAuth } from '../hooks/AuthContext';
import { calculateDistance, useDistanceMatrixService } from './Feed/GoogleMapsMatrixAPI';
import { useNavigate } from 'react-router-dom';
import FeedSkeleton from './FeedSkeleton';
import FriendFeedSkeleton from './FriendFeedSkeleton';

const FeedFriends = () => {
  const { user, checkSubscription } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mustSpin, setMustSpin] = useState(false);

  const isDistanceServiceInitialized = useDistanceMatrixService();
  const USERS_TO_FETCH = 10;
  const navigate = useNavigate();

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

  setLoading(true);
  setError(null);

  try {
    // Fetch current user's facility ID and preferences
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('facility_id, preferences: userpreferences!inner(distance, min_age, max_age, interest)')
      .eq('id', user.id)
      .single();

    if (currentUserError || !currentUser?.facility_id || !currentUser?.preferences) {
      throw new Error("Failed to fetch user preferences or location.");
    }

    const currentUserFacilityId = currentUser.facility_id;
    const userPreferences = currentUser.preferences;

    // Fetch the city of the current user's facility
    const { data: currentUserFacility, error: currentUserFacilityError } = await supabase
      .from('facility_enum')
      .select('city')
      .eq('id', currentUserFacilityId)
      .single();

    if (currentUserFacilityError || !currentUserFacility?.city) {
      throw new Error("Failed to fetch your facility details.");
    }

    const currentUserCity = currentUserFacility.city;
    const maxDistance = userPreferences.distance;

    // Fetch liked and matched user IDs
    const { data: likedUsers, error: likedUsersError } = await supabase
      .from('likes')
      .select('liked_user_id')
      .eq('user_id', user.id);

    if (likedUsersError) {
      throw new Error("Failed to fetch liked users.");
    }

    const { data: matchedUsers, error: matchedUsersError } = await supabase
      .from('matches')
      .select('matched_user_id')
      .or(`id.eq.${user.id},matched_user_id.eq.${user.id}`);

    if (matchedUsersError) {
      throw new Error("Failed to fetch matched users.");
    }

    const likedUserIds = likedUsers.map(like => like.liked_user_id);
    const matchedUserIds = matchedUsers.map(match => match.matched_user_id);
    const excludedUserIds = [...new Set([...likedUserIds, ...matchedUserIds, user.id])];

    // Fetch users based on the filters
    const { data: fetchedUsers, error: fetchedUsersError } = await supabase
      .from('users')
      .select('id, birthday, name, facility_id, gender, preferences: userpreferences(hobbies)')
      .eq('access_granted', 'YES')
      .not('id', 'in', `(${excludedUserIds.join(',')})`)
      .not('name', 'is', null)
      .not('birthday', 'is', null)
      .not('facility_id', 'is', null)
      .limit(USERS_TO_FETCH);

    if (fetchedUsersError) {
      console.error("Error fetching users:", fetchedUsersError);
      throw new Error("Failed to fetch users.");
    }

    // Fetch facility details for all users
    const facilityIds = fetchedUsers.map(user => user.facility_id);
    const { data: facilities, error: facilitiesError } = await supabase
      .from('facility_enum')
      .select('id, name, city')
      .in('id', facilityIds);

    if (facilitiesError) {
      console.error("Error fetching facilities:", facilitiesError);
      throw new Error("Failed to fetch facilities.");
    }

    const facilityMap = (facilities || []).reduce((acc, facility) => {
      acc[facility.id] = facility;
      return acc;
    }, {});

    const usersWithDetails = await Promise.all(
      fetchedUsers.map(async (potentialUser) => {
        const age = calculateAge(potentialUser.birthday);

        // Age and interest preferences filter
        if (
          age < userPreferences.min_age ||
          age > userPreferences.max_age ||
          (userPreferences.interest !== 'geen-voorkeur' &&
            potentialUser.gender !== userPreferences.interest)
        ) {
          return null;
        }

        const facility = facilityMap[potentialUser.facility_id];
        if (!facility) {
          return null;
        }

        const distance = await calculateDistance(currentUserCity, facility.city);

        // Distance preference filter
        if (parseFloat(distance) > maxDistance) {
          return null;
        }

        return {
          id: potentialUser.id,
          name: potentialUser.name || 'Anonymous',
          location: `${facility.city} (${distance})`,
          facility: facility.name,
          birthday: potentialUser.birthday,
          age,
          hobbies: potentialUser.preferences?.hobbies ? JSON.parse(potentialUser.preferences.hobbies) : [],
          distance,
        };
      })
    );

    setUsers(usersWithDetails.filter(Boolean).slice(0, USERS_TO_FETCH));
  } catch (error) {
    setError(error.message);
    console.error("Error fetching user data:", error);
  } finally {
    setLoading(false);
  }
};

  
  

  useEffect(() => {
    if (isDistanceServiceInitialized) {
      fetchUserData(isDistanceServiceInitialized);
      checkSubscription(navigate);
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

  if (loading) {
    return <FriendFeedSkeleton />;
  }
  
  if (error || users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-rose-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-800 mb-4">
            {error
              ? `Oeps! Er ging iets mis: ${error}`
              : 'Geen matches gevonden. Pas je voorkeuren aan.'}
          </p>
          <button
            onClick={() => (error ? window.location.reload() : (window.location.href = '/userFilterForm'))}
            className="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
          >
            {error ? 'Opnieuw proberen' : 'Filter aanpassen'}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 py-12 relative overflow-hidden">
      {/* Decorative heart background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-10 left-10">
          <Heart className="text-rose-200 w-24 h-24" />
        </div>
        <div className="absolute bottom-20 right-20">
          <Heart className="text-rose-200 w-32 h-32" />
        </div>
        <div className="absolute top-1/3 left-1/4">
          <Heart className="text-rose-200 w-16 h-16" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-rose-900 mb-4 mt-10 tracking-tight flex items-center justify-center gap-4">
            <Sparkles className="text-rose-500 animate-pulse" />
            Vind Je Perfecte Vriend
            <Sparkles className="text-rose-500 animate-pulse" />
          </h1>
          <p className="text-xl text-rose-700 max-w-2xl mx-auto flex items-center justify-center space-x-4">
            Ontdek verbindingen door het lot te laten beslissen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Wheel Column */}
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-rose-100 p-8 flex flex-col items-center">
            <div className="relative w-full max-w-md mb-8">
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={currentIndex}
                data={users.map((user, index) => ({
                  option: user.name,
                  style: {
                    backgroundColor: index % 3 === 0 ? '#fff1f2' : index % 3 === 1 ? '#fb7185' : '#881337',
                    textColor: index % 3 === 0 ? '#881337' : '#ffffff'
                  }
                }))}
                onStopSpinning={handleWheelStop}
                radiusLineWidth={3}
                radiusLineColor="border-rose-500"
                outerBorderWidth={6}
                outerBorderColor="border-rose-400"
                fontSize={18}
                perpendicularText
                textDistance={85}
                backgroundColors={[
                  'bg-gradient-to-r from-pink-200 via-rose-300 to-pink-100',
                  'bg-gradient-to-r from-purple-200 via-pink-200 to-rose-100',
                  'bg-gradient-to-r from-red-200 via-rose-300 to-pink-100',
                ]}
                textShadow="1px 1px 5px rgba(0, 0, 0, 0.6)"
                textColor="text-white"
                animationDuration={3000}
                spinEase="ease-out"
                wheelSize={300}
              />

              <button
                className="absolute inset-0 w-32 h-32 m-auto rounded-full 
                  bg-gradient-to-br from-rose-500 to-rose-700 
                  shadow-[0_12px_0_#9f1239] border-4 border-rose-300 
                  text-white font-bold z-10 
                  flex items-center justify-center 
                  pulse-animation
                  active:translate-y-[6px] active:shadow-[0_6px_0_#9f1239]
                  hover:brightness-110 
                  transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-2xl tracking-wider"
                onClick={handleSpinClick}
                disabled={mustSpin}
              >
                {mustSpin ? 'Draaien...' : 'DRAAI'}
              </button>
            </div>
          </div>

          {/* User Card Column */}
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl border border-rose-100 p-8 flex flex-col items-center">
            {mustSpin ? (
              <div className="text-center text-rose-800 p-8">
                <div className="flex flex-col items-center space-y-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-t-rose-500 border-rose-200"></div>
                  <p className="text-lg font-medium">Op zoek naar je ideale vriend...</p>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <UserCard user={users[currentIndex]} currentUserId={user.id} showLoveButton={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default FeedFriends;