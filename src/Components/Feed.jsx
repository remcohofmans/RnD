import React from 'react';

// Sample user data
const users = [
  {
    id: 1,
    name: 'John Doe',
    age: 25,
    location: 'New York, NY',
    bio: 'Loves music and outdoor activities.',
    profilePicture: 'path_to_johns_picture.jpg',
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 30,
    location: 'Los Angeles, CA',
    bio: 'Enjoys reading and cooking.',
    profilePicture: 'path_to_janes_picture.jpg',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    age: 28,
    location: 'Chicago, IL',
    bio: 'Avid gamer and tech enthusiast.',
    profilePicture: 'path_to_mikes_picture.jpg',
  },
  {
    id: 4,
    name: 'Emily Davis',
    age: 22,
    location: 'Miami, FL',
    bio: 'Animal lover and fitness fanatic.',
    profilePicture: 'path_to_emilys_picture.jpg',
  },
  {
    id: 5,
    name: 'David Brown',
    age: 26,
    location: 'Seattle, WA',
    bio: 'Passionate about art and photography.',
    profilePicture: 'path_to_davids_picture.jpg',
  },
];

const UserCard = ({ user }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    <img className="w-24 h-24 rounded-full mx-auto" src={user.profilePicture} alt={`${user.name} profile`} />
    <h2 className="text-center text-xl font-semibold mt-2">{user.name}, {user.age}</h2>
    <p className="text-center text-gray-600">{user.location}</p>
    <p className="text-center mt-2">{user.bio}</p>
    <div className="flex justify-around mt-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Connect</button>
      <button className="bg-gray-500 text-white px-4 py-2 rounded">Skip</button>
    </div>
  </div>
);

const Feed = () => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dating App</h1>
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
