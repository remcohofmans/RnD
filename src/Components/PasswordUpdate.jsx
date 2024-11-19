import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient';

const PasswordUpdate = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('access_token');
    if (token) {
      setResetToken(token);
    } else {
      setError('Ongeldige of ontbrekende reset token.');
    }
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('Beide paswoordvelden zijn verplicht.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Paswoorden komen niet overeen.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Paswoord moet minstens 6 characters lang zijn.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error } = await supabase.auth.updateUser({
        token: resetToken,
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setMessage('Uw paswoord is succesvol gewijzigd.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Paswoord wijziging mislukt. Probeer later opnieuw.');
      console.error('Error wijzigen password:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffccd3]"> {/* Change here */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Uw Paswoord</h2>

        {message && <div className="bg-green-100 text-green-800 p-4 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 mb-2">Nieuw paswoord</label>
            <input
              type="password"
              id="newPassword"
              className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="*****"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Bevestig uw nieuw paswoord</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="*****"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 text-white rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-[#f43f5e] hover:bg-[#e11d48]'} focus:ring-2 focus:ring-offset-2 focus:ring-[#f43f5e]`} 
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordUpdate;
