import React, { useState } from 'react';
import { supabase } from '../lib/helper/supabaseClient';

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
      // Use Supabase to send a password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw error;
      }

      setMessage('E-mail voor wachtwoordherstel verzonden. Controleer je inbox.');
    } catch (err) {
      setError('Het verzenden van de wachtwoordherstel e-mail is mislukt. Probeer het later opnieuw.');
      console.error('Password recovery error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffccd3]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Herstel paswoord</h2>

        {message && <div className="bg-green-100 text-green-800 p-4 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">E-mailadres</label>
            <input
              type="email"
              id="email"
              className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E.g. john.doe@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 text-white rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-[#f43f5e] hover:bg-[#e11d48]'} focus:ring-2 focus:ring-offset-2 focus:ring-[#f43f5e]`}
            disabled={isLoading}
          >
            {isLoading ? 'Zenden...' : 'Verzend Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordRecovery;
