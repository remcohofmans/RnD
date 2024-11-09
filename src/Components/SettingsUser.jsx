import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient'; 
import  TopNavigationBar from '../Components/TopNavigationBar.jsx'

const SettingsUser = () => {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [status, setStatus] = useState("ACTIVE");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        console.log("Session user ID:", session.user.id); // Log the user ID when fetched
      }
    };
    fetchUserData();
  }, []);

  const handleOptionClick = (option) => {
    if (option === "Wachtwoord Bewerken") {
      navigate('/PasswordChangeForm');
    } else if (option === "Foto's Aanpassen") {
      navigate('/uploadFoto'); // Navigate to /uploadFoto when this option is clicked
    } else if (option === "Profiel Pauzeren") {
      setIsConfirming(true);
    }
  };


  const handleConfirmPause = async () => {
    if (!userId) {
      setError("User ID is not available.");
      return;
    }

    try {
      console.log("Attempting to update user with ID:", userId);

      const { data, error } = await supabase
        .from('users')
        .update({ status: "PAUSED" })
        .eq('id', userId);

      console.log("Complete Supabase response:", { data, error });

      if (error) {
        console.error("Error updating status:", error);
        setError("Error pausing your profile: " + error.message);
      } else {
        if (!data || data.length === 0) {
          console.warn("Update succeeded but no data returned");
        }
        setStatus('PAUSED');
        setSuccess("Your profile has been paused.");
        setIsConfirming(false);
        
        {/*
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error("Error signing out:", signOutError);
          setError("Error signing out: " + signOutError.message);
        } else {
          console.log("Attempt");
          navigate('/login'); // Navigate to /login after signing out
        }
          */}
        
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Error pausing your profile.");
    }
  };

  const handleCancelPause = () => {
    setIsConfirming(false); // Close the confirmation dialog
  };

  return (
    <div>
      <TopNavigationBar />
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fff1f2' }}>
        <div
          className="flex flex-col gap-4 p-6 rounded-xl shadow-lg w-72"
          style={{
            backgroundColor: '#FFFFFF',
            border: '4px solid #fda4af',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
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
  
      {/* Confirmation Dialog */}
      {isConfirming && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="p-6 bg-white rounded-lg shadow-lg w-80"
            style={{
              border: '4px solid #fda4af',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 className="text-lg font-semibold text-gray-800">Confirm Pause</h2>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to pause your profile? This action can be undone.</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 text-gray-800 rounded-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #fda4af',
                }}
                onClick={handleCancelPause}
              >
                No
              </button>
              <button
                className="px-4 py-2 text-white rounded-lg"
                style={{ backgroundColor: '#f43f5e' }}
                onClick={handleConfirmPause}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};  

export default SettingsUser;
