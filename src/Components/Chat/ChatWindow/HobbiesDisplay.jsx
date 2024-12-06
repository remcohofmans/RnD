import React from 'react';
import { availableHobbies } from '../../filter/AvailableHobbiesPage';


const HobbiesDisplay = ({ hobbies }) => {
  // Parse hobbies if they're in string format
  const parseHobbies = (hobbiesInput) => {
    if (typeof hobbiesInput === 'string') {
      try {
        return JSON.parse(hobbiesInput);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(hobbiesInput) ? hobbiesInput : [];
  };

  const hobbyList = parseHobbies(hobbies[0] || hobbies);

  // Find the matching hobby object for each hobby name to get its icon
  const getHobbyWithIcon = (hobbyName) => {
    return availableHobbies.find(h => h.name === hobbyName) || { 
      name: hobbyName, 
      icon: '🎯' // Default icon if hobby not found in availableHobbies
    };
  };

  return (
    <div className="hobbies mt-4 text-left">
      <span className="hobbies-label text-rose-400 font-bold">Hobby's:</span>
      <div className="hobby-icons flex flex-wrap gap-3 mt-2">
        {hobbyList && hobbyList.length > 0 ? (
          hobbyList.map((hobbyName, index) => {
            const hobby = getHobbyWithIcon(hobbyName);
            return (
              <span 
                key={index} 
                className="hobby-item flex items-center text-gray-900 text-sm bg-rose-50 px-3 py-1.5 rounded-full"
              >
                <span className="mr-2" role="img" aria-label={hobby.name}>
                  {hobby.icon}
                </span>
                {hobby.name}
              </span>
            );
          })
        ) : (
          <p className="text-gray-700">Geen hobby's toegevoegd</p>
        )}
      </div>
    </div>
  );
};

export default HobbiesDisplay;