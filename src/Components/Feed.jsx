import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { supabase } from '../supabaseClient';
import UserCard from '../Components/Feed/UserCard';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const createPieSegment = (startAngle, endAngle, radius) => {
  const start = {
    x: Math.cos(startAngle) * radius,
    y: Math.sin(startAngle) * radius,
  };
  const end = {
    x: Math.cos(endAngle) * radius,
    y: Math.sin(endAngle) * radius,
  };
  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

  return `M 0 0 L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
};

const generateColors = (count) => {
  const baseColors = [
    '#fff1f2', // Rose 50 (light)
    '#881337', // Rose 900 (dark)
  ];

  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }

  return colors;
};

const fetchHobbies = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('userpreferences')
      .select('hobbies')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data.hobbies || [];
  } catch (error) {
    console.error('Error fetching hobbies:', error.message);
    return [];
  }
};

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from('users')
          .select('id, birthday, facility, city, name, profilepictureBASE64')
          .limit(10);
        if (error) throw error;

        const usersWithHobbies = await Promise.all(fetchedData.map(async (item) => {
          const hobbies = await fetchHobbies(item.id);
          return {
            id: item.id,
            name: item.name,
            location: item.city,
            facility: item.facility,
            birthday: item.birthday,
            age: calculateAge(item.birthday),
            profilePicture: item.profilepictureBASE64,
            hobbies: hobbies
          };
        }));

        setUsers(usersWithHobbies);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRandomize = () => {
    if (isRandomizing) return;

    setIsRandomizing(true);
    const spins = 3;
    const segments = users.length;
    const segmentAngle = 360 / segments;
    const newIndex = Math.floor(Math.random() * users.length);

    const targetRotation = (360 * spins) - segmentAngle * newIndex - 90;
    setWheelRotation((prevRotation) => prevRotation + targetRotation);

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsRandomizing(false);
    }, 3000);
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleRandomize,
    onSwipedRight: handleRandomize,
  });

  if (loading) return <div className="loading flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="error flex justify-center items-center h-screen">Error: {error}</div>;

  const colors = generateColors(users.length);
  const segmentAngle = (2 * Math.PI) / users.length;

  return (
    <div className="feed max-w-6xl mx-auto mt-12 p-6 bg-[#ffccd3] rounded-lg shadow-md">
      <div className="grid grid-cols-2 gap-8">
        {/* Wheel column */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md">
            {/* Fixed pointer arrow at top */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
              <FontAwesomeIcon
                icon={faChevronDown}
                className="text-[#fb7185] text-4xl filter drop-shadow-lg"
              />
            </div>

            <div className="wheel-container relative aspect-square">
              <button
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  z-20 bg-white text-[#fb7185] px-6 py-3 rounded-full shadow-lg 
                  hover:bg-gray-50 transition-all duration-300 font-bold
                  ${isRandomizing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                onClick={handleRandomize}
                disabled={isRandomizing}
              >
                {isRandomizing ? 'Spinning...' : 'Spin'}
              </button>

              <motion.svg
                className="w-full h-full"
                viewBox="-150 -150 300 300"
                initial={{ rotate: -90 }}
                animate={{ rotate: wheelRotation - 90 }}
                transition={{ duration: 3, ease: 'circOut' }}
              >
                {users.map((_, index) => {
                  const startAngle = index * segmentAngle;
                  const endAngle = (index + 1) * segmentAngle;
                  const pathD = createPieSegment(startAngle, endAngle, 150);

                  return (
                    <path
                      key={index}
                      d={pathD}
                      fill={colors[index]}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}

                {users.map((user, index) => {
                  const angle = index * segmentAngle + segmentAngle / 2;
                  const radius = 100;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <g
                      key={user.id}
                      transform={`translate(${x}, ${y}) rotate(${(angle * 180) / Math.PI + 90})`}
                    >
                      <circle r="15" fill="white" stroke="#fb7185" strokeWidth="2" />
                      <image
                        href={`data:image/jpeg;base64,${user.profilePicture}`}
                        x="-14"
                        y="-14"
                        width="28"
                        height="28"
                        clipPath="circle(14px at center)"
                      />
                    </g>
                  );
                })}
              </motion.svg>
            </div>
          </div>
        </div>

        {/* UserCard column */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            {users.length > 0 && <UserCard user={users[currentIndex]} />}
            <div className="mt-4 text-sm text-[#360009] text-center">
              {currentIndex + 1} / {users.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
