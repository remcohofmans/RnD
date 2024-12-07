import React, { useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';


const ProfielPauzeren = ({ onSuccess, onError, setIsConfirming }) => {
  const {pauseAccount } = useAuth();

  const [error, setError] = useState(null);
  const { user } = useAuth();
  const userId = user?.id

  const handleConfirmPause = async () => {
    if (!userId) {
      setError("User ID is not available.");
      return;
    }

    try {
      await pauseAccount(userId);

      if (error) {
        console.error("Error updating status:", error);
        setError("Error pausing your profile: " + error.message);
        if (onError) onError(error.message);
      } else {
        onSuccess("Je profiel werd gepauzeerd.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Error pausing your profile.");
      if (onError) onError("Error pausing your profile.");
    }

    // Close the modal after the action is completed
    setIsConfirming(false);
  };

  const handleCancelPause = () => {
    // Close the modal when Cancel is clicked
    setIsConfirming(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <p className="mb-4 text-lg text-rose-600 font-bold">Ben je zeker dat je je profiel wilt pauzeren?</p>
        {error && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}
        <div className="flex justify-center gap-4">

          <button
              className="px-4 py-2 text-gray-800 bg-white border-2 border-[#fda4af] rounded-lg hover:bg-rose-300"
            onClick={handleCancelPause}
          >
            Annuleer
          </button>

          <button
            className="px-4 py-2 text-white bg-rose-500 rounded-lg hover:bg-rose-700"
            onClick={handleConfirmPause}
          >
            Bevestig
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ProfielPauzeren;
