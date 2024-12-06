import React, { useState } from 'react';
import { Settings, ScrollText, Ban, Trash,CreditCard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AccessRequests from '../AccessRequests';
import MentorBanUser from './MentorBanUser';
import SubscriptionRequests from './SubscriptionRequests'; // Import your new component
import { useAuth } from '../../hooks/AuthContext';


const SettingsMentor = () => {
  const [activeComponent, setActiveComponent] = useState(null);
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

  const menuOptions = [
    {
      id: 'Toegangsverzoeken',
      icon: ScrollText,
      component: 'AccessRequests',
      description: 'Bekijk en beheer toegang verzoeken',
    },
    {
      id: 'Abonnement verzoeken',
      icon: CreditCard, // Replace with a relevant icon if available
      component: 'SubscriptionRequests',
      description: 'Bekijk en beheer abonnement verzoeken',
    },
    {
      id: 'Ban gebruiker',
      icon: Ban,
      component: 'MentorBanUser',
      description: 'Beheer verboden gebruikers',
    },
    {
      id: 'Verwijder profiel',
      icon: Trash,
      component: null,
      description: 'Verwijder je profiel permanent',
    },
    
  ];

  const handleOptionClick = (option) => {
    if (option === 'Toegangsverzoeken') {
      setActiveComponent('AccessRequests');
    } else if (option === 'Ban gebruiker') {
      setActiveComponent('MentorBanUser');
    } else if (option === 'Verwijder profiel') {
      setShowConfirmation(true);
    } else if (option === 'Abonnement verzoeken') {
      setActiveComponent('SubscriptionRequests');
    }

    console.log('Active component: ',option)
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="flex flex-col h-full w-40 md:w-80 sm:w-56 bg-white shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-white">
          <Settings className="w-6 h-6 text-rose-500" />
          <h1 className="text-xl font-semibold text-gray-900">Instellingen</h1>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 flex flex-col gap-3 flex-grow overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Menu Items */}
          {menuOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeComponent === option.component;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={`w-full text-left transition-colors duration-200 rounded-lg p-3 ${
                  isActive
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-rose-500' : 'text-gray-500'
                    }`}
                  />
                  <div>
                    <div className="font-medium">{option.id}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Logout Button */}
          <button
            className="mt-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
            onClick={handleLogOut}
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-gray-500" />
              <span>Log uit</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 justify-center items-center pt-16 bg-rose-50 overflow-y-auto">
        <div className="w-full rounded-xl p-6">
          {/* Dynamic Content */}
          {activeComponent === 'AccessRequests' && <AccessRequests />}
          {activeComponent === 'MentorBanUser' && <MentorBanUser />}
          {activeComponent === 'SubscriptionRequests' && <SubscriptionRequests />}

          {/* Confirmation Modal */}
          {showConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="p-6 bg-white rounded-lg shadow-lg w-80 border-4 border-[#fda4af]">
                <h2 className="text-lg font-semibold text-gray-800">Bevestig Verwijdering</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Ben je zeker dat je dit account wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden.
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

          {/* Welcome Screen */}
          {!activeComponent && !showConfirmation && (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-20">
              <Settings className="w-16 h-16 mb-6 text-gray-400" />
              <h2 className="text-2xl font-medium text-gray-700 mb-3">
                Welkom bij Instellingen
              </h2>
              <p className="text-gray-500 max-w-md">
                Selecteer een optie aan de linkerkant om je voorkeuren aan te passen
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsMentor;
