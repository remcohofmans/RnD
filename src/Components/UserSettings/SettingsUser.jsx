import React, { useState, useEffect } from 'react';
import { Settings, Filter, Key, Image, PauseCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { supabase } from '../../lib/helper/supabaseClient';
import UserFilterForm from './UserFilterForm';
import PasswordChangeForm from './PasswordChangeForm';
import ProfielPauzeren from './ProfielPauzeren';
import { useSearchParams } from 'react-router-dom';

const SettingsUser = () => {
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState("ACTIVE");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [searchParams] = useSearchParams();

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

  useEffect(() => {
    // Check URL parameter bij het laden van de pagina
    const section = searchParams.get('section');
    if (section === 'filters') {
      setActiveComponent('UserFilterForm');
    }
  }, [searchParams]);

  // ... rest van de component blijft hetzelfde



  const buttonStyles = {
    primary: "bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition-colors duration-200",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200",
    menuItem: "w-full text-left transition-colors duration-200 rounded-lg"
  };

  const settingsOptions = [
    {
      id: "Filtervoorkeuren",
      icon: Filter,
      component: "UserFilterForm",
      description: "Pas je matchingvoorkeuren aan"
    },
    {
      id: "Wachtwoord Bewerken",
      icon: Key,
      component: "PasswordChangeForm",
      description: "Verander je wachtwoord"
    },
    {
      id: "Foto's Aanpassen",
      icon: Image,
      component: "ImageUpload",
      description: "Beheer je profielfoto's"
    },
    {
      id: "Profiel Pauzeren",
      icon: PauseCircle,
      component: null,
      description: "Zet je profiel tijdelijk op pauze"
    }
  ];

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
          {/* Notifications */}
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
          {settingsOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeComponent === option.component ||
              (option.id === "Profiel Pauzeren" && isConfirming);

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={`${buttonStyles.menuItem} ${isActive
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="flex-row items-center gap-3 p-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-rose-500' : 'text-gray-500'}`} />
                  <div>
                    <div className="font-medium">{option.id}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 justify-center items-center pt-16 bg-rose-50 overflow-y-auto">
        <div className="w-full rounded-xl p-6">
          {/* Dynamic Content */}
          {activeComponent === "UserFilterForm" && <UserFilterForm />}
          {activeComponent === "PasswordChangeForm" && <PasswordChangeForm />}
          {activeComponent === "ImageUpload" && (
            <div className="overflow-y-auto h-full">
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

          {/* Welcome Screen */}
          {!activeComponent && !isConfirming && (
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

export default SettingsUser;