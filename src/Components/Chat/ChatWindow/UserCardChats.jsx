import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMapMarkerAlt,
  faBuilding,
  faHeart,
  faStar,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../lib/helper/supabaseClient';
import CarouselCard from '../../Feed/CarouselCard';
import { LoadingSpinner } from '../../common/LoadingSpinner';

const defaultHobbyIcon = faStar;

const UserCardChats = ({ user: userId }) => {
  const [userData, setUserData] = useState(null);
  const [hobbies, setHobbies] = useState([]);
  const [age, setAge] = useState(null);

  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        // Fetch user details
        const { data: userDetails, error: userError } = await supabase
          .from('users')
          .select('birthday, city, facility, name')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user details:', userError);
          return;
        }

        setUserData(userDetails);
        const calculatedAge = calculateAge(userDetails.birthday);
        setAge(calculatedAge);

        // Fetch hobbies
        const { data: hobbyData, error: hobbyError } = await supabase
          .from('userpreferences')
          .select('hobbies')
          .eq('id', userId);

        if (hobbyError) {
          console.error('Error fetching hobbies:', hobbyError);
          return;
        }

        setHobbies(hobbyData.map((entry) => entry.hobbies));
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (!userData) {
    return (
      <div className="user-card bg-rose-100 rounded-lg shadow-lg p-6 mb-6 w-80 mx-auto">
        <h2 className="name text-2xl font-semibold text-[#360009] text-center">
          <LoadingSpinner/>
        </h2>
      </div>
    );
  }

  return (
    <div className="user-card bg-rose-100 rounded-lg shadow-lg p-6 mb-6 w-80 mx-auto">
      {/* Profile Picture */}
      <CarouselCard userId={userId} />

      {/* User Info */}
      <h2 className="name text-2xl font-semibold text-[#360009] text-center">{userData.name}</h2>
      <div className="info text-left mt-4">
        <p className="age text-[#360009]">
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          {age} jaar
        </p>
        <p className="location text-[#360009]">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          {userData.city}
        </p>
        <p className="facility text-[#360009]">
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          {userData.facility}
        </p>
      </div>

      {/* Hobbies Section */}
      <div className="hobbies mt-4 text-left">
        <span className="hobbies-label text-[#fb7185] font-bold">Hobbies:</span>
        <div className="hobby-icons flex flex-wrap gap-3 mt-2">
          {hobbies.length > 0 ? (
            hobbies.map((hobby, index) => (
              <span key={index} className="hobby-item flex items-center text-[#360009] text-sm">
                <span className="mr-2 text-xl">
                  <FontAwesomeIcon icon={defaultHobbyIcon} />
                </span>
                {hobby}
              </span>
            ))
          ) : (
            <p className="text-[#360009]">No hobbies listed</p>
          )}
        </div>
      </div>

    
    </div>
  );
};

export default UserCardChats;