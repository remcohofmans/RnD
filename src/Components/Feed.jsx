import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase } from '../lib/helper/supabaseClient';
import UserCard from '../Components/Feed/UserCard';
import { useAuth } from '../hooks/AuthContext';
import { calculateDistance, useDistanceMatrixService } from '../Components/Feed/GoogleMapsMatrixAPI';
import NavigationButton from './Feed/NavigationButton';
import { useNavigate } from 'react-router-dom';
import FeedSkeleton from '../Components/Feed/FeedSkeleton';
import { shuffle } from 'lodash';
import WheelComponent from '../Components/Feed/SpinWheel';

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
  const USERS_TO_FETCH = 9;
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
  
    try {
      // Fetch necessary data in parallel
      const [
        userPreferencesRes,
        currentUserRes,
        likedUsersRes,
        matchedUsersRes,
        fetchedUsersRes
      ] = await Promise.all([
        supabase
          .from('preferences')
          .select('distance, min_age, max_age, interest')
          .eq('id', user.id)
          .single(),
        supabase
          .from('users')
          .select('facility_id')
          .eq('id', user.id)
          .single(),
        supabase
          .from('likes')
          .select('liked_user_id')
          .eq('user_id', user.id),
        supabase
          .from('matches')
          .select('matched_user_id')
          .or(`id.eq.${user.id},matched_user_id.eq.${user.id}`),
        supabase
          .from('users')
          .select('id, birthday, name, facility_id, gender, status')
          .eq('access_granted', 'YES')
      ]);
  
      const { data: userPreferences, error: userPreferencesError } = userPreferencesRes;
      const { data: currentUser, error: currentUserError } = currentUserRes;
      const { data: likedUsers } = likedUsersRes;
      const { data: matchedUsers } = matchedUsersRes;
      const { data: fetchedUsers } = fetchedUsersRes;
  
      if (userPreferencesError || currentUserError) {
        throw new Error("Failed to fetch user preferences or current user data.");
      }
  
      if (!currentUser?.facility_id) {
        throw new Error("Your location is not set. Please update your profile.");
      }
  
      const currentUserFacility = await supabase
        .from('facility_enum')
        .select('city')
        .eq('id', currentUser.facility_id)
        .single();
  
      const currentUserCity = currentUserFacility?.data?.city;
      if (!currentUserCity) {
        throw new Error("Failed to fetch your facility details.");
      }
  
      const likedUserIds = likedUsers.map((like) => like.liked_user_id);
      const matchedUserIds = matchedUsers.map((match) => match.matched_user_id);
      const excludedUserIds = new Set([...likedUserIds, ...matchedUserIds, user.id]);
  
      const maxDistance = userPreferences.distance;
      const minAge = userPreferences.min_age;
      const maxAge = userPreferences.max_age;
      const interest = userPreferences.interest;
  
      const facilities = await supabase
        .from('facility_enum')
        .select('id, name, city');
  
      const facilityMap = facilities.data.reduce((acc, facility) => {
        acc[facility.id] = facility;
        return acc;
      }, {});
  
      const usersWithDetails = await Promise.all(
        fetchedUsers
          .filter(
            (potentialUser) =>
              potentialUser.id &&
              !excludedUserIds.has(potentialUser.id) &&
              potentialUser.status !== 'PAUSED' &&
              potentialUser.name &&
              potentialUser.birthday &&
              potentialUser.facility_id
          )
          .map(async (potentialUser) => {
            const age = calculateAge(potentialUser.birthday);
            if (age < minAge || age > maxAge) return null;
  
            if (
              interest !== 'geen-voorkeur' &&
              potentialUser.gender !== interest
            ) {
              return null;
            }
  
            const facility = facilityMap[potentialUser.facility_id];
            if (!facility) return null;
  
            const distance = await calculateDistance(currentUserCity, facility.city);
            if (parseFloat(distance) > maxDistance) return null;
  
            const preferencesData = await supabase
              .from('preferences')
              .select('hobbies')
              .eq('id', potentialUser.id)
              .single();
  
            return {
              id: potentialUser.id,
              name: potentialUser.name || 'Anonymous',
              location: `${facility.city} (${distance})`,
              facility: facility.name,
              birthday: potentialUser.birthday,
              age,
              hobbies: preferencesData?.data?.hobbies ? JSON.parse(preferencesData.data.hobbies) : [],
              distance,
            };
          })
      );
  
      setUsers(shuffle(usersWithDetails.filter(Boolean)).slice(0, USERS_TO_FETCH));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const initializeFeed = async () => {
      const hasAccess = await checkUserAccess();
      if (hasAccess && isDistanceServiceInitialized) {
        await fetchUserData(isDistanceServiceInitialized);
        checkSubscription(navigate);
      }
    };
  
    initializeFeed();
  }, [isDistanceServiceInitialized]);
  

  // const wheelData = users.map((user, index) => ({
  //   option: user.name,
  //   style: {
  //     backgroundColor: index % 3 === 0 ? '#fff1f2' : index % 3 === 1 ? '#fb7185' : '#881337',
  //     textColor: index % 3 === 0 ? '#881337' : '#fff1f2'
  //   }
  // }));

  // const handleSpinClick = () => {
  //   if (!mustSpin) {
  //     const newIndex = Math.floor(Math.random() * users.length);
  //     setCurrentIndex(newIndex);
  //     setMustSpin(true);
  //   }
  // };

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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center px-4 md:px-0">
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
          <h1
            className="text-3xl md:text-5xl font-extrabold mb-6 mt-10 tracking-tight 
    flex items-center justify-center gap-4 
    text-center 
    bg-gradient-to-r from-rose-400 via-rose-600 to-rose-400 
    bg-clip-text text-transparent 
    animate-gradient-x"
          >
            <Sparkles className="text-rose-500 animate-pulse w-8 h-8 md:w-10 md:h-10" />
            <span className="text-black-300">
              Ontdek Je Ideale Match
            </span>
            <Sparkles className="text-rose-500 animate-pulse w-8 h-8 md:w-10 md:h-10" />
          </h1>

          <p className="text-xl text-rose-700 max-w-2xl mx-auto flex items-center justify-center space-x-4">
            Spin het wiel en laat het toeval je naar de ware verbinding leiden
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Wheel Column */}
          <div className="bg-rose-700 rounded-2xl shadow-xl p-8 flex flex-col items-center">
            <WheelComponent
              userID={user.id}
              users={users}
              currentIndex={currentIndex}
              mustSpin={mustSpin}
              setMustSpin={setMustSpin}
              handleWheelStop={handleWheelStop}
              setCurrentIndex={setCurrentIndex}
            />
          </div>

          {/* User Card Column */}
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl border border-rose-100 p-8 flex items-center justify-center h-full">
            {mustSpin ? (
              <div className="text-center text-rose-800 p-8">
                <div className="flex flex-col items-center space-y-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-t-rose-500 border-rose-200"></div>
                  <p className="text-lg font-medium">Op zoek naar je ideale liefde...</p>
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <UserCard user={users[currentIndex]} currentUserId={user.id} showLoveButton={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;