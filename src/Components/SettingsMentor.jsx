import React, { useState } from 'react';
import { supabase } from '../lib/helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import AccessRequests from '../Components/AccessRequests'; // Import AccessRequests component
import MentorBanUser from '../Components/MentorBanUser'; // Import MentorBanUser component

const SettingsMentor = ({ logout, loggedIn }) => {
  const [activeComponent, setActiveComponent] = useState(null); // State to control which content to display
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      setError(null);
      setSuccess(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Unable to fetch user.');
      }

      const { error: deleteError } = await supabase
        .from('users') // Replace with your table name
        .delete()
        .eq('id', user.id);

      if (deleteError) {
        throw new Error('Failed to delete user data.');
      }

      logout(); // Log the user out after account deletion
      setTimeout(() => {
        navigate('/login');
        setSuccess('Your account has been deleted.');
      }, 2000);
      setSuccess('Your account has been deleted.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogOut = () => {
    logout();
    navigate('/login');
  };

  // Handle button clicks in the left drawer
  const handleOptionClick = (option) => {
    if (option === 'Toegangsverzoeken') {
      setActiveComponent('AccessRequests'); // Show AccessRequests component
    } else if (option === 'Ban gebruiker') {
      setActiveComponent('MentorBanUser'); // Show MentorBanUser component
    } else if (option === 'Verwijder profiel') {
      setShowConfirmation(true); // Show confirmation modal
    }
  };

  return (
    <div className="flex h-screen overflow-hidden"> {/* Full height container */}
      {/* Permanent Drawer (Sidebar) */}
      <div className="h-full w-80 bg-white shadow-lg border-r-4 border-[#fda4af] flex flex-col"> {/* Flex column layout */}
        <div className="p-4 bg-[#f43f5e] text-white text-lg font-bold text-center">
          Settings
        </div>
        <div className="p-4 flex flex-col gap-8 flex-grow"> {/* Ensure the flex container grows */}
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

          {['Toegangsverzoeken', 'Ban gebruiker', 'Verwijder profiel'].map(
            (option) => (
              <button
                key={option}
                className="px-4 py-2 text-center w-full bg-[#f43f5e] text-white rounded-lg transition hover:bg-[#be123c]"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            )
          )}

          {/* Logout Button with space below */}
          <button
            className="px-4 py-2 text-center w-full bg-[#f43f5e] text-white rounded-lg transition hover:bg-[#be123c] mt-auto" // mt-auto pushes it to the bottom
            onClick={handleLogOut}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-hidden"> {/* Ensure no overflow in main content */}
        {/* Conditional Content based on activeComponent */}
        <div className="flex-1 overflow-hidden"> {/* Ensures no overflow in the content */}
          {activeComponent === 'AccessRequests' && <AccessRequests />}
          {activeComponent === 'MentorBanUser' && <MentorBanUser />}

          {/* Confirmation Modal for Deleting Account */}
          {showConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="p-6 bg-white rounded-lg shadow-lg w-80 border-4 border-[#fda4af]">
                <h2 className="text-lg font-semibold text-gray-800">
                  Bevestig Verwijdering
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                 Bent u zeker dat u dit account wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden.
                </p>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="px-4 py-2 text-gray-800 bg-white border-2 border-[#fda4af] rounded-lg"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Annuleer
                  </button>
                  <button
                    className="px-4 py-2 bg-[#f43f5e] text-white rounded-lg"
                    onClick={() => {
                      setShowConfirmation(false);
                      handleDeleteAccount();
                    }}
                  >
                    Bevestig
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsMentor;
