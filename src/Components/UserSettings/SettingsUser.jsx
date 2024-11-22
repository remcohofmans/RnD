import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/helper/supabaseClient.js';
import ImageUpload from './ImageUpload.jsx';
import PasswordChangeForm from './PasswordChangeForm.jsx';
import UserFilterForm from './UserFilterForm.jsx';
import ProfielPauzeren from './ProfielPauzeren.jsx';

const SettingsUser = () => {
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState("ACTIVE");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        console.log("Session user ID:", session.user.id);
      }
    };
    fetchUserData();
  }, []);

  const handleOptionClick = (option) => {
    if (option === "Filtervoorkeuren") {
      setActiveComponent("UserFilterForm");
    } else if (option === "Wachtwoord Bewerken") {
      setActiveComponent("PasswordChangeForm");
    } else if (option === "Foto's Aanpassen") {
      setActiveComponent("ImageUpload");
    } else if (option === "Profiel Pauzeren") {
      setIsConfirming(true);
    }
  };

  const handleSuccess = (message) => {
    setSuccess(message);
    setError(null);
  };

  const handleError = (message) => {
    setError(message);
    setSuccess(null);
  };

  // Emojis for each setting option
  const emojis = {
    "Filtervoorkeuren": "🔍",  // Filter preferences
    "Wachtwoord Bewerken": "🔑",  // Change password
    "Foto's Aanpassen": "🖼️",  // Edit photos
    "Profiel Pauzeren": "⏸️",  // Pause profile
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Navigation Drawer */}
      <div className="h-full w-80 bg-white shadow-lg border-r-4 border-rose-300 flex flex-col">
        <div className="p-4 bg-rose-500 text-white text-lg font-bold text-center">
          Instellingen
        </div>
        <div className="p-4 flex flex-col gap-8 flex-grow">
          {error && (
            <div className="p-2 text-sm text-red-600 bg-red-100 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="p-2 text-sm text-green-600 bg-green-100 rounded">
              {success}
            </div>
          )}

          {["Filtervoorkeuren", "Foto's Aanpassen", "Wachtwoord Bewerken", "Profiel Pauzeren"].map(
            (option) => (
              <button
                key={option}
                className="px-4 py-2 text-center w-full bg-rose-500 text-white rounded-lg transition hover:bg-rose-700"
                onClick={() => handleOptionClick(option)}
              >
                {emojis[option]} {option}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {/* Scrollable content */}
        {activeComponent === "UserFilterForm" && <UserFilterForm />}
        {activeComponent === "PasswordChangeForm" && <PasswordChangeForm />}
        {activeComponent === "ImageUpload" && (
          <div className="overflow-y-auto h-full">
            {/* Ensure scrolling for ImageUpload */}
            <ImageUpload />
          </div>
        )}
        {isConfirming && (
          <ProfielPauzeren
            userId={userId}
            onSuccess={handleSuccess}
            onError={handleError}
            setIsConfirming={setIsConfirming}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsUser;
