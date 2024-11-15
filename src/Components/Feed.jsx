import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useCheckUserProfile from '../hooks/useCheckUserProfile';
import {
  faHeart,
  faTimes,
  faMusic,
  faBook,
  faGamepad,
  faPaw,
  faCamera,
  faDumbbell,
  faUtensils,
  faArrowLeft,
  faArrowRight,
  faUser,
  faMapMarkerAlt,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';
import { supabase } from '../supabaseClient';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth.js';
import  TopNavigationBar from '../Components/TopNavigationBar.jsx'

const hobbyIcons = {
  music: faMusic,
  reading: faBook,
  gaming: faGamepad,
  animals: faPaw,
  fitness: faDumbbell,
  cooking: faUtensils,
  art: faCamera,
  photography: faCamera,
  tech: faGamepad,
  outdoor: faPaw,
};

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const UserCard = ({ user, onLove }) => (
  <div className="bg-[#F0E9EA] rounded-lg shadow-lg p-6 mb-6 w-80 mx-auto transition-transform duration-300 hover:scale-105">
    <img
      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-[#FB7185]"
      src={`data:image/jpeg;base64,${user.profilePicture}`}
      alt={`${user.name} profile`}
    />
    <h2 className="text-2xl font-semibold text-[#360009] text-center">{user.name}</h2>
    <div className="text-left mt-4">
      <p className="text-[#360009]">
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        {user.age} years
      </p>
      <p className="text-[#360009]">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
        {user.location}
      </p>
      <p className="text-[#360009]">
        <FontAwesomeIcon icon={faBuilding} className="mr-2" />
        {user.facility}
      </p>
    </div>
    <div className="mt-4 text-left">
      <span className="text-[#FB7185] font-bold">Hobbies:</span>
      <div className="flex space-x-3 mt-2">
        {user.hobbies.map((hobby, index) => (
          <span key={index} className="flex items-center text-[#360009] text-lg">
            <FontAwesomeIcon icon={hobbyIcons[hobby]} className="mr-2 text-[#FFBEC8]" />
            {hobby.charAt(0).toUpperCase() + hobby.slice(1)}
          </span>
        ))}
      </div>
    </div>
    <p className="mt-4 text-[#360009] text-left">{user.bio}</p>
    <div className="flex justify-between mt-6">
      <button
        onClick={onLove} // Call the onLove function when the Love button is clicked
        className="flex items-center bg-[#FB7185] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#F43F5E] transition-all duration-300"
      >
        <FontAwesomeIcon icon={faHeart} className="mr-2" /> Love
      </button>
      <button className="flex items-center bg-[#FFBEC8] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#F43F5E] transition-all duration-300">
        <FontAwesomeIcon icon={faTimes} className="mr-2" /> Skip
      </button>
    </div>
  </div>
);

const Feed = () => {


  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get current user from custom hook
  const { currentUser, loading: authLoading, error: authError } = useSupabaseAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from('users')
          .select('id, birthday, facility, city, name, profilepictureBASE64');
        if (error) throw error;

        const transformedUsers = fetchedData.map((item) => ({
          id: item.id,
          name: item.name,
          location: item.city,
          facility: item.facility,
          birthday: item.birthday,
          age: calculateAge(item.birthday),
          profilePicture: item.profilepictureBASE64,
          hobbies: [],
          bio: 'Bio not available',
        }));

        setUsers(transformedUsers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLove = async () => {

  
    const likedUserId = users[currentIndex].id;

    try {
      const { data, error } = await supabase
        .from('likes')
        .insert([{ user_id: currentUser.id, liked_user_id: likedUserId }]);

    } catch (error) {
      // More detailed error message
      console.error("Error liking user:", error.message || error);
      alert("Error liking user, please try again.");
    }
  };
  

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? users.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === users.length - 1 ? 0 : prevIndex + 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
  });

  if (loading || authLoading) {
    return <div>Loading...</div>;
  }

  if (error || authError) {
    return <div>Error: {error || authError}</div>;
  }

  return (
    <div className="max-w-md mx-auto pt-20 p-6 bg-[#FFBEC8] rounded-lg shadow-md relative">
      <TopNavigationBar />
  
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#360009]">V(l)inder</h1>
        <div className="flex space-x-4">
          <button className="bg-[#FB7185] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#F43F5E] transition-transform transform hover:scale-105">
            Refresh
          </button>
          <button className="bg-[#F43F5E] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#360009] transition-transform transform hover:scale-105">
            Settings
          </button>
        </div>
      </div>
  
      <div {...handlers} className="relative flex items-center justify-center">
        <button
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-[#F0E9EA] p-2 rounded-full shadow-md hover:bg-[#FB7185] transition duration-300 z-10"
          onClick={handlePrevious}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
  
        {users.length > 0 && <UserCard user={users[currentIndex]} onLove={handleLove} />}
  
        <button
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-[#F0E9EA] p-2 rounded-full shadow-md hover:bg-[#FB7185] transition duration-300 z-10"
          onClick={handleNext}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
  
      <div className="mt-4 text-sm text-[#360009] text-center">
        {currentIndex + 1} / {users.length}
      </div>
    </div>
  );
};

export default Feed;
