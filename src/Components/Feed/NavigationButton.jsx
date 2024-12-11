import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationButton = ({ color = 'rose' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/settingsUser?section=filters');
  };

  const buttonColor = color === 'green' ? 'bg-green-500 hover:bg-green-600' : 'bg-rose-500 hover:bg-rose-600';

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-2 ${buttonColor} text-white rounded-full transition-colors`}
    >
      Filtervoorkeuren aanpassen
    </button>
  );
};

export default NavigationButton;
