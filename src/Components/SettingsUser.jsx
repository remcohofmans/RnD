import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes, faMusic, faBook, faGamepad, faPaw, faCamera, faDumbbell, faUtensils, faArrowLeft, faArrowRight, faUser, faMapMarkerAlt, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';

const SettingsUser = () => {
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    if (option === "Wachtwoord Bewerken") {
      navigate('/PasswordChangeForm');
    }
    // Add other navigation logic for other options if needed
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fff1f2' }}>
      <div
        className="flex flex-col gap-4 p-6 rounded-xl shadow-lg w-72"
        style={{
          backgroundColor: '#FFFFFF',
          border: '4px solid #fda4af',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {["Info Aanpassen", "Foto's Aanpassen", "Wachtwoord Bewerken", "Profiel Verwijderen", "Profiel Pauzeren"].map((option) => (
          <button
            key={option}
            className="px-4 py-2 text-lg font-semibold text-white rounded-lg transition duration-300"
            style={{ backgroundColor: '#f43f5e' }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#be123c')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f43f5e')}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsUser;