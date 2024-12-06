import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Wheel } from 'react-custom-roulette';
import { supabase } from '../lib/helper/supabaseClient';
import UserCard from './Feed/UserCard';
import { useAuth } from '../hooks/AuthContext';
import { calculateDistance, useDistanceMatrixService } from './Feed/GoogleMapsMatrixAPI';
import { useNavigate } from 'react-router-dom';
import FriendFeedSkeleton from '../Components/Feed/FriendFeedSkeleton';
import WheelComponent from '../Components/Feed/SpinWheel';
import { shuffle } from 'lodash';

const FeedFriends = () => {
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
    const userHasAccess = await checkUserAccess();
    if (!userHasAccess) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user preferences
      const { data: userPreferences, error: userPreferencesError } = await supabase
        .from('preferences')
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
        .not('facility_id', 'is', null);

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

      let usersWithDetails = [];
      for (const potentialUser of fetchedUsers) {
        const age = calculateAge(potentialUser.birthday);

        if (
          age < userPreferences.min_age ||
          age > userPreferences.max_age ||
          (userPreferences.interest !== 'geen-voorkeur' &&
            potentialUser.gender !== userPreferences.interest)
        ) {
          continue;
        }

        const facility = facilityMap[potentialUser.facility_id];
        if (!facility) {
          continue;
        }

        const distance = await calculateDistance(currentUserCity, facility.city);

        if (parseFloat(distance) > maxDistance) {
          continue;
        }

        const { data: preferencesData, error: preferencesDataError } = await supabase
          .from('preferences')
          .select('hobbies')
          .eq('id', potentialUser.id)
          .single();

        if (preferencesDataError) {
          continue;
        }

        usersWithDetails.push({
          id: potentialUser.id,
          name: potentialUser.name || 'Anonymous',
          location: `${facility.city} (${distance})`,
          facility: facility.name,
          birthday: potentialUser.birthday,
          age,
          hobbies: preferencesData?.hobbies ? JSON.parse(preferencesData.hobbies) : [],
          distance,
        });
      }

      // Shuffle the array of usersWithDetails using lodash.shuffle
      usersWithDetails = shuffle(usersWithDetails);

      // Select the first 10 users from the shuffled list
      setUsers(usersWithDetails.slice(0, USERS_TO_FETCH));
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
      <FriendFeedSkeleton />
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
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
    return <FriendFeedSkeleton />;
  }

  if (error || users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-green-400 mb-4"
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
            className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            {error ? 'Opnieuw proberen' : 'Filter aanpassen'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 relative overflow-hidden">
      {/* Decorative heart background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-10 left-10">
          <Heart className="text-green-200 w-24 h-24" />
        </div>
        <div className="absolute bottom-20 right-20">
          <Heart className="text-green-200 w-32 h-32" />
        </div>
        <div className="absolute top-1/3 left-1/4">
          <Heart className="text-green-200 w-16 h-16" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
        <h1
  className="text-3xl md:text-5xl font-extrabold mb-6 mt-10 tracking-tight 
    flex items-center justify-center gap-4 
    text-center 
    bg-gradient-to-r from-green-400 via-green-600 to-green-400 
    bg-clip-text text-transparent 
    animate-gradient-x"
>
  <Sparkles className="text-green-500 animate-pulse w-8 h-8 md:w-10 md:h-10" />
  <span className="text-black-300">
    Vind Je Perfecte Vriend
  </span>
  <Sparkles className="text-green-500 animate-pulse w-8 h-8 md:w-10 md:h-10" />
</h1>

          <p className="text-xl text-green-700 max-w-2xl mx-auto flex items-center justify-center space-x-4">
            Ontdek verbindingen door het lot te laten beslissen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Wheel Column */}
          <div className="bg-green-700 rounded-2xl shadow-xl p-8 flex flex-col items-center">
            <WheelComponent
              users={users}
              currentIndex={currentIndex}
              mustSpin={mustSpin}
              setMustSpin={setMustSpin}
              handleWheelStop={handleWheelStop}
              setCurrentIndex={setCurrentIndex}
              theme = 'green'
            />
          </div>

          {/* User Card Column */}
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl border border-green-100 p-8 flex items-center justify-center h-full">
            {mustSpin ? (
              <div className="text-center text-green-800 p-8">
                <div className="flex flex-col items-center space-y-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-t-green-500 border-green-200"></div>
                  <p className="text-lg font-medium">Op zoek naar je ideale vriend...</p>
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <UserCard 
                user={users[currentIndex]} 
                currentUserId={user.id} 
                showLoveButton={false} 
                theme = 'green'
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default FeedFriends;