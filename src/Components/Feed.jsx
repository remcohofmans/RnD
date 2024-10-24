import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes, faMusic, faBook, faGamepad, faPaw, faCamera, faDumbbell, faUtensils, faArrowLeft, faArrowRight, faUser, faMapMarkerAlt, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';
import boyImage from '../Assets/boy.jpg';
import girlImage from '../Assets/girl.jpg';

const users = [
  {
    id: 1,
    name: 'Lucas Janssens',
    age: 25,
    location: 'Brugge, BE',
    facility: 'Faciliteit open hart',
    hobbies: ['music', 'outdoor'],
    bio: 'Loves music and outdoor activities.',
    profilePicture: boyImage,
  },
  {
    id: 2,
    name: 'Marie Peeters',
    age: 30,
    location: 'Gent, BE',
    facility: 'Faciliteit',
    hobbies: ['reading', 'cooking'],
    bio: 'Enjoys reading and cooking.',
    profilePicture: girlImage,
  },
  {
    id: 3,
    name: 'Tom Vermeulen',
    age: 28,
    location: 'Antwerpen, BE',
    facility: 'Faciliteit',
    hobbies: ['gaming', 'tech'],
    bio: 'Avid gamer and tech enthusiast.',
    profilePicture: boyImage,
  },
  {
    id: 4,
    name: 'Emma Claes',
    age: 22,
    location: 'Leuven, BE',
    facility: 'Faciliteit',
    hobbies: ['animals', 'fitness'],
    bio: 'Animal lover and fitness fanatic.',
    profilePicture: girlImage,
  },
  {
    id: 5,
    name: 'Liam Maes',
    age: 26,
    location: 'Brussel, BE',
    facility: 'Faciliteit',
    hobbies: ['art', 'photography'],
    bio: 'Passionate about art and photography.',
    profilePicture: boyImage,
  },
];

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

const UserCard = ({ user }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 mb-4 hover:shadow-xl transition-shadow duration-200 transform hover:scale-105 w-72 mx-auto">
    {/* Profile Picture */}
    <img className="w-24 h-24 rounded-full mx-auto mb-3 object-cover" src={user.profilePicture} alt={`${user.name} profile`} />
    <h2 className="text-xl font-semibold text-gray-800 text-center">{user.name}</h2>
    <div className="text-left mt-3">
      <p className="text-gray-600"><FontAwesomeIcon icon={faUser} className="mr-1" />{user.age} years</p>
      <p className="text-gray-600"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />{user.location}</p>
      <p className="text-gray-600"><FontAwesomeIcon icon={faBuilding} className="mr-1" />{user.facility}</p>
    </div>

    <div className="mt-3 text-left">
      <span className="text-gray-700 font-bold">Hobbies:</span>
      <div className="flex flex-wrap gap-2 mt-1">
        {user.hobbies.map((hobby, index) => (
          <span key={index} className="flex items-center text-gray-800 text-sm">
            <FontAwesomeIcon icon={hobbyIcons[hobby]} className="mr-1 text-[#C5C3E0]" />
            {hobby.charAt(0).toUpperCase() + hobby.slice(1)}
          </span>
        ))}
      </div>
    </div>

    <p className="mt-2 text-gray-700 text-left text-sm">{user.bio}</p>

    <div className="flex justify-between mt-4">
      <button className="flex items-center bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full shadow-md hover:from-green-500 hover:to-green-700 transition-all duration-200">
        <FontAwesomeIcon icon={faHeart} className="mr-1" /> Love
      </button>
      <button className="flex items-center bg-gradient-to-r from-red-400 to-red-600 text-white px-3 py-1 rounded-full shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-200">
        <FontAwesomeIcon icon={faTimes} className="mr-1" /> Skip
      </button>
    </div>
  </div>
);

const Feed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-[#E9E9F0] rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#C5C3E0]">V(l)inder</h1>
        <div className="flex space-x-2">
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full shadow-md hover:from-blue-600 hover:to-indigo-700 transition-transform transform hover:scale-105">
            Refresh
          </button>
          <button className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-3 py-1 rounded-full shadow-md hover:from-gray-600 hover:to-gray-800 transition-transform transform hover:scale-105">
            Settings
          </button>
        </div>
      </div>

      <div {...handlers} className="relative flex items-center justify-center">
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-400 transition duration-200 z-10"
          onClick={handlePrevious}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <UserCard user={users[currentIndex]} />

        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-400 transition duration-200 z-10"
          onClick={handleNext}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-600 text-center">
        {currentIndex + 1} / {users.length}
      </div>
    </div>
  );
};

export default Feed;
