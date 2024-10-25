import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordChangeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  
  const [showPasswords, setShowPasswords] = useState(false);

  const [focus, setFocus] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Nieuwe wachtwoorden komen niet overeen");
      return;
    }

    console.log('Password change form submitted:', formData);
    alert('Wachtwoord succesvol bijgewerkt');
    navigate('/settingsUser');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPasswords(prev => !prev);
  };

  const handleAnnul = () => {
    navigate('/settingsUser');
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fff1f2' }}>
      <div className="flex flex-col gap-4 p-6 rounded-xl shadow-lg w-72 bg-white border-4" style={{ borderColor: '#fda4af' }}>
        {error && (
          <div className="p-2 text-sm text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              name="oldPassword"
              placeholder="Oud Wachtwoord"
              value={formData.oldPassword}
              onChange={handleChange}
              onFocus={() => setFocus({...focus, oldPassword: true})}
              onBlur={() => setFocus({...focus, oldPassword: false})}
              className="w-full py-3 pr-10 pl-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500 hover:text-rose-700"
            >
              <FontAwesomeIcon 
                icon={showPasswords ? faEyeSlash : faEye}
                size="sm"
              />
            </button>
          </div>
          
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              name="newPassword"
              placeholder="Nieuw Wachtwoord"
              value={formData.newPassword}
              onChange={handleChange}
              onFocus={() => setFocus({...focus, newPassword: true})}
              onBlur={() => setFocus({...focus, newPassword: false})}
              className="w-full py-3 pr-10 pl-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500 hover:text-rose-700"
            >
              <FontAwesomeIcon 
                icon={showPasswords ? faEyeSlash : faEye}
                size="sm"
              />
            </button>
          </div>
          
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              name="confirmPassword"
              placeholder="Nieuw Wachtwoord"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setFocus({...focus, confirmPassword: true})}
              onBlur={() => setFocus({...focus, confirmPassword: false})}
              className="w-full py-3 pr-10 pl-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500 hover:text-rose-700"
            >
              <FontAwesomeIcon 
                icon={showPasswords ? faEyeSlash : faEye}
                size="sm"
              />
            </button>
          </div>
          
          <div className="flex justify-between gap-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-lg font-semibold text-white rounded-lg bg-rose-500 hover:bg-rose-700 transition duration-300"
            >
              Bevestig
            </button>
            <button
              type="button"
              onClick={handleAnnul}
              className="flex-1 px-4 py-2 text-lg font-semibold text-rose-500 border border-rose-500 rounded-lg hover:bg-rose-100 transition duration-300"
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeForm;