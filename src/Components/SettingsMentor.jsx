import React, { useState } from 'react'; 
import { supabase } from '../lib/helper/supabaseClient'; 
import { useNavigate } from 'react-router-dom';

const SettingsMentor = ({ logout, loggedIn }) => {
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

  // Logout handler
  const handleLogOut = () => {
    logout();
    if (loggedIn) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div>
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

          {["Toegangsverzoeken", "Ban gebruiker", "Verwijder profiel"].map((option) => (
            <button
              key={option}
              className="px-4 py-2 text-lg font-semibold text-white rounded-lg transition duration-300"
              style={{ backgroundColor: '#f43f5e' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#be123c')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#f43f5e')}
              onClick={() => {
                if (option === "Toegangsverzoeken") {
                  navigate('/accessRequests'); // Navigate to /accessRequests
                } else if (option === "Ban gebruiker") {
                  navigate('/mentorBanUser'); // Navigate to /mentorBanUser
                } else if (option === "Verwijder profiel") {
                  setShowConfirmation(true);
                }
              }}
            >
              {option}
            </button>
          ))}
          
          {/* Logout Button */}
          <button
            className="px-4 py-2 text-lg font-semibold text-white rounded-lg transition duration-300 mt-4"
            style={{ backgroundColor: '#f43f5e' }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#be123c')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f43f5e')}
            onClick={handleLogOut}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="p-6 bg-white rounded-lg shadow-lg w-80"
            style={{
              border: '4px solid #fda4af',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 text-gray-800 rounded-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #fda4af',
                }}
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white rounded-lg"
                style={{ backgroundColor: '#f43f5e' }}
                onClick={() => {
                  setShowConfirmation(false);
                  handleDeleteAccount();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMentor;
