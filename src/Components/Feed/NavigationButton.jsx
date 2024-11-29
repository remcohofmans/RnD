import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/settingsUser?section=filters');
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
    >
      Filtervoorkeuren aanpassen
    </button>
  );
};

export default NavigationButton;