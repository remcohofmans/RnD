import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMapMarkerAlt,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../lib/helper/supabaseClient';
import CarouselCard from '../../feed/CarouselCard';
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
    <div className="user-card bg-white rounded-xl shadow-md p-6 mb-8 w-full max-w-md mx-auto">
      {/* Profile Picture */}
      <div className="profile-picture mb-6">
        <CarouselCard userId={userId} />
      </div>
  
      {/* User Info */}
      <div className="user-info text-center">
        <h2 className="name text-3xl font-bold text-gray-800 mb-2">{userData.name}</h2>
        <div className="details text-gray-600">
          <p className="age flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faUser} className="text-gray-500" />
            {age ? `${age} jaar` : "Age not available"}
          </p>
          <p className="location flex items-center justify-center gap-2 mt-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />
            {userData.city || "City not available"}
          </p>
          <p className="facility flex items-center justify-center gap-2 mt-2">
            <FontAwesomeIcon icon={faBuilding} className="text-gray-500" />
            {userData.facility || "Facility not available"}
          </p>
        </div>
      </div>
  
      {/* Divider */}
      <div className="divider my-6 border-t border-gray-200"></div>
  
      {/* Hobbies Section */}
      <div className="hobbies text-left">
        <h3 className="hobbies-label text-lg font-semibold text-gray-800 mb-3">
          Hobbies
        </h3>
        <div className="hobby-icons flex flex-wrap gap-4">
          {hobbies.length > 0 ? (
            hobbies.map((hobby, index) => (
              <div
                key={index}
                className="hobby-item flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 shadow-sm text-sm text-gray-700"
              >
                <span role="img" aria-label={hobby.name} className="text-lg">
                  {hobby.icon}
                </span>
                {hobby.name}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hobbies listed</p>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default UserCardChats;
