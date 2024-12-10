import React, { useState } from 'react';
import { supabase } from '../../../lib/helper/supabaseClient';

export const UnmatchButton = ({ otherUserName, otherUserId, matchId, onUnmatch }) => {
  const [showUnmatchModal, setShowUnmatchModal] = useState(false);

  const handleUnmatchClick = () => {
    setShowUnmatchModal(true);
  };

  const handleCancelUnmatch = () => {
    setShowUnmatchModal(false);
  };

  const handleConfirmUnmatch = async () => {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('match_id', matchId);

      if (error) {
        console.error('Error unmatching:', error);
        return;
      }

      window.location.reload();

    } catch (err) {
      console.error('Unexpected error unmatching:', err);
    }
  };

  return (
    <>
      <button 
        className="px-2 py-1 bg-rose-300 text-white rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        onClick={handleUnmatchClick}
      >
        Unmatch
      </button>

      {showUnmatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-transform duration-300 scale-95">
            <p className="text-lg font-medium text-gray-800 mb-4">
              Weet je zeker dat je {otherUserName} wilt unmachen?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200 text-sm"
                onClick={handleCancelUnmatch}
              >
                Annuleren
              </button>
              <button
                className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition duration-200 text-sm"
                onClick={handleConfirmUnmatch}
              >
                Unmatch
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};