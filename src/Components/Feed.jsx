import React, { useState, useEffect } from 'react';
import { Sparkle } from 'lucide-react';
import { Wheel } from 'react-custom-roulette';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/helper/supabaseClient';
import UserCard from '../Components/Feed/UserCard';
import { useAuth } from '../hooks/AuthContext';
import { calculateDistance, useDistanceMatrixService } from '../Components/Feed/GoogleMapsMatrixAPI';
import NavigationButton from './Feed/NavigationButton';
import { useNavigate } from 'react-router-dom';
import FeedSkeleton from './FeedSkeleton';

const Feed = () => {
  const { user, checkSubscription } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

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

  const checkUserAccess = async () => {
    setCheckingAccess(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('access_granted')
        .eq('id', user.id)
        .single();
  
      if (error) throw error;
      
      setHasAccess(data.access_granted === 'YES');
      return data.access_granted === 'YES';
    } catch (error) {
      console.error('Error checking access:', error);
      setError('Er ging iets mis bij het controleren van je toegang.');
      return false;
    } finally {
      setCheckingAccess(false);  // New line
    }
  };

  const fetchUserData = async (distanceServiceReady) => {
    if (!distanceServiceReady) {
      console.error("Distance Matrix Service not ready.");
      return;
    }
  
    setLoading(true);
    setError(null);

    // First check if user has access
    const userHasAccess = await checkUserAccess()
      if (!userHasAccess) {
        setLoading(false);
          return;
      }
  
    try {
      // Fetch user preferences
      const { data: userPreferences, error: userPreferencesError } = await supabase
        .from('userpreferences')
        .select('distance, min_age, max_age, interest')
        .eq('id', user.id)
        .single();
  
      if (userPreferencesError) {
        throw new Error("Failed to fetch user preferences.");
      }
  
      // Fetch current user's facility ID and then facility details to get the city
      const { data: currentUser, error: currentUserError } = await supabase
        .from('users')
        .select('facility_id')
        .eq('id', user.id)
        .single();
  
      if (currentUserError || !currentUser?.facility_id) {
        throw new Error("Your location is not set. Please update your profile.");
      }
  
      const { data: currentUserFacility, error: currentUserFacilityError } = await supabase
        .from('facility_enum')
        .select('city')
        .eq('id', currentUser.facility_id)
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
  
      // Fetch users with access granted and not the current user
      const { data: fetchedUsers, error: fetchedUsersError } = await supabase
        .from('users')
        .select('id, birthday, name, facility_id, gender')
        .eq('access_granted', 'YES')
        .not('id', 'in', `(${excludedUserIds.join(',')})`)
        .neq('id', user.id)
        .not('name', 'is', null)
        .not('birthday', 'is', null)
        .not('facility_id', 'is', null)
        .limit(USERS_TO_FETCH);
  
      if (fetchedUsersError) {
        throw new Error("Failed to fetch users.");
      }
  
      if (!fetchedUsers || fetchedUsers.length === 0) {
        setUsers([]);
        return;
      }
  
      // Fetch facility details for all users
      const facilityIds = fetchedUsers.map(user => user.facility_id);
      const { data: facilities, error: facilitiesError } = await supabase
        .from('facility_enum')
        .select('id, name, city')
        .in('id', facilityIds);
  
      if (facilitiesError) {
        throw new Error("Failed to fetch facilities.");
      }
  
      const facilityMap = (facilities || []).reduce((acc, facility) => {
        acc[facility.id] = facility;
        return acc;
      }, {});
  
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
  
          const facility = facilityMap[potentialUser.facility_id];
          if (!facility) {
            return null;
          }
  
          const distance = await calculateDistance(currentUserCity, facility.city);
  
          if (parseFloat(distance) > maxDistance) {
            return null;
          }
  
          const { data: preferencesData, error: preferencesDataError } = await supabase
            .from('userpreferences')
            .select('hobbies')
            .eq('id', potentialUser.id)
            .single();
  
          if (preferencesDataError) {
            return null;
          }
  
          return {
            id: potentialUser.id,
            name: potentialUser.name || 'Anonymous',
            location: `${facility.city} (${distance})`,
            facility: facility.name,
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

  // Show skeleton loader while checking access
if (checkingAccess) {
  return (
    <FeedSkeleton />
  );
}

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-rose-900 mb-4">Toegang Vereist</h2>
          <p className="text-gray-800 mb-4">
            Wacht op de toegang van je begeleider
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <FeedSkeleton />
    );
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
          <NavigationButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 py-12">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-rose-900 mb-4 mt-10 tracking-tight">
          Ontdek je Match
        </h1>
        <p className="text-xl text-rose-700 max-w-2xl mx-auto flex items-center justify-between">
          <Sparkle />
          Spin het wiel en laat het toeval je naar de ware verbinding leiden
          <Sparkle />
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Wheel Column */}
        <div className="bg-rose-700 rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <div className="relative w-full max-w-md mb-8">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={currentIndex}
              data={wheelData}
              onStopSpinning={handleWheelStop}
              radiusLineWidth={3}
              radiusLineColor="border-pink-500"
              outerBorderWidth={6}
              outerBorderColor="border-pink-400"
              fontSize={18}
              perpendicularText
              textDistance={85}
              backgroundColors={[
                'bg-gradient-to-r from-pink-200 via-rose-300 to-pink-100',
                'bg-gradient-to-r from-purple-200 via-pink-200 to-rose-100',
                'bg-gradient-to-r from-blue-200 via-blue-300 to-purple-200',
                'bg-gradient-to-r from-green-200 via-green-300 to-blue-100',
                'bg-gradient-to-r from-yellow-100 via-orange-200 to-amber-200',
                'bg-gradient-to-r from-indigo-200 via-blue-100 to-green-200',
              ]}
              textShadow="1px 1px 5px rgba(0, 0, 0, 0.6)"
              textColor="text-white"
              animationDuration={3000}
              spinEase="ease-out"
              wheelSize={300}
              onStartSpinning={() => console.log('Wheel started spinning!')}
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
              {mustSpin ? 'Draaien...' : 'SPIN'}
            </button>
          </div>
        </div>

        {/* User Card Column */}
        <div className="bg-rose-700 rounded-2xl p-8 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {mustSpin ? (
              <div className="text-center text-rose-100 p-8">
                <div className="flex flex-col items-center space-y-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-t-rose-500 border-rose-200"></div>
                  <p className="text-lg font-medium">Op zoek naar je ideale match...</p>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <UserCard user={users[currentIndex]} currentUserId={user.id} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
);
};

export default Feed;