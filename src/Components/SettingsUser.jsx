import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient'; 

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
      // First, log the attempt
      console.log("Attempting to update user with ID:", userId);

      const { data, error } = await supabase
        .from('users')
        .update({ status: "PAUSED" })
        .eq('id', userId)
        
        

      // Log the entire response
      console.log("Complete Supabase response:", { data, error });

      // If data exists, log the first row (should be the updated user)
      if (data && data.length > 0) {
        console.log("Updated user data:", data[0]);
      }

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

        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error("Error signing out:", signOutError);
          setError("Error signing out: " + signOutError.message);
        } else {
          console.log("Attempt");
          navigate('/login'); // Navigate to /login after signing out
        }
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

      {/* Confirmation Dialog */}
      {isConfirming && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to pause your profile?</h2>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={handleConfirmPause}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={handleCancelPause}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsUser;
