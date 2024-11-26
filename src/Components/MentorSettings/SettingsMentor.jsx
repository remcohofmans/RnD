import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccessRequests from '../../Components/AccessRequests'; // Import AccessRequests component
import MentorBanUser from '../../Components/MentorSettings/MentorBanUser'; // Import MentorBanUser component
import { useAuth } from '../../hooks/AuthContext';

const SettingsMentor = () => {
  const [activeComponent, setActiveComponent] = useState(null); // State to control which content to display
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { deleteCurrentUserAccount, logoutAndNavigate } = useAuth();

  const handleDeleteAccount = async () => {
    try {
      setError(null);
      setSuccess(null);

      await deleteCurrentUserAccount();
      setSuccess('Your account has been deleted.');
      setTimeout(() => logoutAndNavigate(navigate), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogOut = () => {
    logoutAndNavigate(navigate);
  };

  const emojis = {
    "Toegangsverzoeken": "📜", // Access Requests
    "Ban gebruiker": "🚫", // Ban User
    "Verwijder profiel": "🗑️", // Delete Profile
  };

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
      {/* Sidebar */}
      <div className="h-full w-80 bg-rose-50 shadow-lg flex flex-col"> {/* Flex column layout */}
        <div className="p-4 bg-[#f43f5e] text-white text-lg font-bold text-center">
          Settings
        </div>
        <div className="p-4 flex flex-col gap-8 flex-grow"> {/* Flex container */}
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

          {['Toegangsverzoeken', 'Ban gebruiker', 'Verwijder profiel'].map((option) => (
            <button
              key={option}
              className="px-4 py-2 text-center w-full bg-[#f43f5e] text-white rounded-lg transition hover:bg-[#be123c]"
              onClick={() => handleOptionClick(option)}
            >
              {emojis[option]} {option}
            </button>
          ))}

          {/* Logout Button */}
          <button
            className="px-4 py-2 text-center w-full bg-[#f43f5e] text-white rounded-lg transition hover:bg-[#be123c] mt-auto"
            onClick={handleLogOut}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-rose-100 overflow-hidden">
        {activeComponent === 'AccessRequests' && <AccessRequests />}
        {activeComponent === 'MentorBanUser' && <MentorBanUser />}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-6 bg-white rounded-lg shadow-lg w-80 border-4 border-[#fda4af]">
              <h2 className="text-lg font-semibold text-gray-800">Bevestig Verwijdering</h2>
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
  );
};

export default SettingsMentor;
