import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes, faMusic, faBook, faGamepad, faPaw, faCamera, faDumbbell, faUtensils } from '@fortawesome/free-solid-svg-icons';
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
  <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center">
    <img className="w-24 h-24 rounded-full" src={user.profilePicture} alt={`${user.name} profile`} />
    <div className="ml-4 flex-grow">
      <h2 className="text-left text-xl font-semibold mt-2">{user.name}</h2>
      <p className="text-left text-gray-600">Age: {user.age}</p>
      <p className="text-left text-gray-600">{user.location}</p>
      <p className="text-left text-gray-600">{user.facility}</p>
      <div className="flex space-x-2 mt-2">
        <span className="text-gray-600">Hobbies:</span>
        {user.hobbies.map((hobby, index) => (
          <span key={index} className="flex items-center text-xl text-gray-700">
            <FontAwesomeIcon icon={hobbyIcons[hobby]} className="mr-1" />
            {hobby}
          </span>
        ))}
      </div>
      <p className="text-left mt-2">{user.bio}</p>
      <div className="flex justify-around mt-4">
        <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full">
          <FontAwesomeIcon icon={faHeart} className="mr-2" /> Love
        </button>
        <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full">
          <FontAwesomeIcon icon={faTimes} className="mr-2" /> Skip
        </button>
      </div>
    </div>
  </div>
);

const Feed = () => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">v(l)inder</h1>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Refresh</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">Settings</button>
        </div>
      </div>
      <div>
        {users.slice(0, 5).map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <div className="flex justify-around mt-8">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Home</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Messages</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Profile</button>
      </div>
    </div>
  );
};

export default Feed;
