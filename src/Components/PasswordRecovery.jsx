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
      setError('Please enter your email.');
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

      setMessage('Password reset email sent. Please check your inbox.');
    } catch (err) {
      setError('Failed to send password reset email. Please try again later.');
      console.error('Password recovery error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf6f0]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h2>
        
        {message && <div className="bg-green-100 text-green-800 p-4 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">E-mail Address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 text-white rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-[#f43f5e] hover:bg-[#e11d48]'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordRecovery;
