import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import boyImage from '../Assets/boy.jpg';
import girlImage from '../Assets/girl.jpg';
import { supabase } from '../supabaseClient';

// Define hobby icons
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

// Utility function to calculate age from birthday
const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// UserCard Component
const UserCard = ({ user }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 w-80 mx-auto">
    <img
      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
      src={user.profilePicture}
      alt={`${user.name} profile`}
    />
    <h2 className="text-2xl font-semibold text-gray-800 text-center">{user.name}</h2>
    <div className="text-left mt-4">
      <p className="text-gray-600">
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        {user.age} years
      </p>
      <p className="text-gray-600">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
        {user.location}
      </p>
      <p className="text-gray-600">
        <FontAwesomeIcon icon={faBuilding} className="mr-2" />
        {user.facility}
      </p>
    </div>
    <div className="mt-4 text-left">
      <span className="text-gray-700 font-bold">Hobbies:</span>
      <div className="flex space-x-3 mt-2">
        {user.hobbies.map((hobby, index) => (
          <span key={index} className="flex items-center text-gray-800 text-lg">
            <FontAwesomeIcon icon={hobbyIcons[hobby]} className="mr-2 text-[#C5C3E0]" />
            {hobby.charAt(0).toUpperCase() + hobby.slice(1)}
          </span>
        ))}
      </div>
    </div>
    <p className="mt-4 text-gray-700 text-left">{user.bio}</p>
    <div className="flex justify-between mt-6">
      <button className="flex items-center bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:from-green-500 hover:to-green-700 transition-all duration-300">
        <FontAwesomeIcon icon={faHeart} className="mr-2" /> Love
      </button>
      <button className="flex items-center bg-gradient-to-r from-red-400 to-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:from-red-500 hover:to-red-700 transition-all duration-300">
        <FontAwesomeIcon icon={faTimes} className="mr-2" /> Skip
      </button>
    </div>
  </div>
);

// Main Feed Component
const Feed = () => {
  const [users, setUsers] = useState([]); // Initialize users from Supabase
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from('users') // Replace with your actual table name
          .select('birthday, facility, City, name'); // Specify the columns you want

        if (error) {
          throw error;
        }

        // Transform fetched data into user objects
        const transformedUsers = fetchedData.map((item) => ({
          id: item.id, // Add id if available in your table
          name: item.name,
          location: item.City, // Assuming you want to use city as location
          facility: item.facility,
          birthday: item.birthday, // This could be used for age calculation
          age: calculateAge(item.birthday), // Calculate age
          profilePicture: boyImage, // Placeholder image, adjust as needed
          hobbies: [], // Add hobbies if available
          bio: 'Bio not available', // Add bio or modify as necessary
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-[#E9E9F0] rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#C5C3E0]">V(l)inder</h1>
        <div className="flex space-x-4">
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:from-blue-600 hover:to-indigo-700 transition-transform transform hover:scale-105">
            Refresh
          </button>
          <button className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-full shadow-md hover:from-gray-600 hover:to-gray-800 transition-transform transform hover:scale-105">
            Settings
          </button>
        </div>
      </div>

      <div {...handlers} className="relative flex items-center justify-center">
        <button
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-400 transition duration-300 z-10"
          onClick={handlePrevious}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        {users.length > 0 && <UserCard user={users[currentIndex]} />}

        <button
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-400 transition duration-300 z-10"
          onClick={handleNext}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        {currentIndex + 1} / {users.length}
      </div>
    </div>
  );
};

export default Feed;
