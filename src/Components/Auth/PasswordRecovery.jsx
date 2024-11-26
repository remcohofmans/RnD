import React, { useState } from 'react';
import { Mail, Lock, SendHorizonal } from 'lucide-react';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setError('Gelieve uw e-mailadres in te vullen');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage('E-mail voor wachtwoordherstel verzonden. Controleer je inbox.');
    } catch (err) {
      setError('Het verzenden van de wachtwoordherstel e-mail is mislukt. Probeer het later opnieuw.');
      console.error('Password recovery error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-rose-100 overflow-hidden">
        <div className="p-8 bg-white">
          <div className="flex items-center justify-center mb-6">
            <Lock size={48} className="text-rose-600 mr-4 drop-shadow-sm" />
            <h2 className="text-3xl font-bold text-neutral-900">Wachtwoord Herstel</h2>
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
              <label htmlFor="email" className="block text-neutral-700 font-medium mb-2">
                E-mailadres
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="email"
                  id="email"
                  className="w-full py-3 px-12 bg-neutral-50 border border-neutral-200 
                    text-neutral-900 rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-rose-500 focus:border-transparent transition duration-300 
                    placeholder-neutral-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Voer uw e-mailadres in"
                  required
                />
              </div>
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
              {isLoading ? (
                <div className="flex items-center">
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-neutral-100">Zenden...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <SendHorizonal size={20} className="mr-2" /> Verzend Link
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;