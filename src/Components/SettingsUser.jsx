import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient'; 
import TopNavigationBar from '../Components/TopNavigationBar.jsx';
import ImageUpload from '../Components/ImageUpload'; // Assuming you have this component
import PasswordChangeForm from '../Components/PasswordChangeForm'; // Assuming you have this component
import UserFilterForm from '../Components/UserFilterForm'; // Assuming you have this component
import ProfielPauzeren from '../Components/ProfielPauzeren'; // Import ProfielPauzeren component

const SettingsUser = () => {
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState("ACTIVE");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false); // State for modal visibility

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
    if (option === "Info Aanpassen") {
      setActiveComponent("UserFilterForm");
    } else if (option === "Wachtwoord Bewerken") {
      setActiveComponent("PasswordChangeForm");
    } else if (option === "Foto's Aanpassen") {
      setActiveComponent("ImageUpload");
    } else if (option === "Profiel Pauzeren") {
      setIsConfirming(true); // Show ProfielPauzeren modal
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

  return (
    <div>
      <div className="grid grid-cols-12 min-h-screen" style={{ backgroundColor: '#fff1f2' }}>
       {/* Left Menu */}
    <div
      className="col-span-3 flex flex-col items-center justify-center gap-4 p-6 rounded-xl shadow-lg bg-white border-4 border-rose-300 h-96 mt-24"
    >
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

      {["Info Aanpassen", "Foto's Aanpassen", "Wachtwoord Bewerken", "Profiel Pauzeren"].map((option) => (
        <button
          key={option}
          className="px-4 py-2 text-lg font-semibold text-white rounded-lg transition duration-300 bg-rose-600 hover:bg-rose-800"
          onClick={() => handleOptionClick(option)}
        >
          {option}
        </button>
      ))}
    </div>

        {/* Right Section */}
        <div className="col-span-9 p-6">
          {activeComponent === "UserFilterForm" && <UserFilterForm />}
          {activeComponent === "PasswordChangeForm" && <PasswordChangeForm />}
          {activeComponent === "ImageUpload" && <ImageUpload />}
          {isConfirming && (
            <ProfielPauzeren
              userId={userId}
              onSuccess={handleSuccess}
              onError={handleError}
              setIsConfirming={setIsConfirming} // Pass down the function to close modal
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsUser;
