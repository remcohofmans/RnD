import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/helper/supabaseClient';
import { Key, ShieldCheck } from 'lucide-react';


const PasswordUpdate = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


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
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        console.error("Error updating password:", error.message);
        setError('Paswoord wijziging mislukt. Probeer later opnieuw.');
      }
      else {
        console.log("Password updated successfully:", data);
        setMessage('Uw paswoord is succesvol gewijzigd.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError('Paswoord wijziging mislukt. Probeer later opnieuw.');
      console.error('Error wijzigen password:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100 p-4 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-rose-100 overflow-hidden">
          <div className="p-8 relative">
            <div className="flex items-center justify-center mb-6">
              <Key size={48} className="text-rose-600 mr-4 drop-shadow-sm" />
              <h2 className="text-3xl font-bold text-neutral-900">Update jouw Paswoord</h2>
            </div>

            {message && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-r-lg mb-6 animate-pulse">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-neutral-700 font-medium mb-2">
                  Nieuw paswoord
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full py-3 px-12 bg-neutral-50 border border-neutral-200 
                    text-neutral-900 rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-rose-500 focus:border-transparent transition duration-300 
                    placeholder-neutral-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="*****"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-neutral-700 font-medium mb-2">
                  Bevestig jouw nieuw paswoord
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full py-3 px-12 bg-neutral-50 border border-neutral-200 
                    text-neutral-900 rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-rose-500 focus:border-transparent transition duration-300 
                    placeholder-neutral-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="*****"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center py-3 text-white rounded-lg 
                  transition duration-300 ease-in-out transform hover:scale-[1.02] 
                  ${isLoading
                    ? 'bg-neutral-400 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'} 
                  focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 
                  shadow-md hover:shadow-lg`}
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <div className="flex justify-center space-x-2 mt-4">
              <ShieldCheck className="text-rose-500 opacity-50" size={24} />
              <Key className="text-rose-500 opacity-50" size={24} />
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-neutral-600 text-sm">
          <p>
            Beveiligd door <span className="font-semibold text-rose-600">Supabase Auth</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdate;
