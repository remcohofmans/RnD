import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMapMarkerAlt,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../lib/helper/supabaseClient';
import CarouselCard from '../../Feed/CarouselCard';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { availableHobbies } from '../../filter/AvailableHobbiesPage';

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
        const { data: userDetails, error: userError } = await supabase
          .from('users')
          .select(`
            birthday,
            name,
            facility_id,
            facility_enum (
              name,
              city
            )
          `)
          .eq('id', userId)
          .single();
    
        if (userError) {
          console.error('Error fetching user details:', userError);
          return;
        }
    
        setUserData({
          name: userDetails.name,
          birthday: userDetails.birthday,
          facility: userDetails.facility_enum?.name,
          city: userDetails.facility_enum?.city,
        });
    
        const calculatedAge = calculateAge(userDetails.birthday);
        setAge(calculatedAge);
    
        const { data: hobbyData, error: hobbyError } = await supabase
          .from('userpreferences')
          .select('hobbies')
          .eq('id', userId);
    
        if (hobbyError) {
          console.error('Error fetching hobbies:', hobbyError);
          return;
        }
    
        console.log("the user id is: ", userId);
        console.log("the users hobbies are: ", hobbyData);
    
        // Process hobbies
        const flattenedHobbies = hobbyData
          .map((entry) => {
            try {
              // Parse hobbies JSON string into an array
              return JSON.parse(entry.hobbies);
            } catch (error) {
              console.error("Error parsing hobbies JSON:", entry.hobbies);
              return [];
            }
          })
          .flat()
          .filter((hobby) => hobby && hobby.trim() !== '');
    
        console.log("flattened hobbies: ", flattenedHobbies);
    
        const matchedHobbies = flattenedHobbies.map((hobby) =>
          availableHobbies.find((item) => item.name === hobby)
        );
    
        console.log("matched hobbies: ", matchedHobbies);
    
        setHobbies(matchedHobbies.filter(Boolean)); // Filter out unmatched hobbies
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
          <LoadingSpinner />
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
                <span role="img" aria-label={hobby.name} className="mr-2 text-xl">
                  {hobby.icon}
                </span>
                {hobby.name}
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
