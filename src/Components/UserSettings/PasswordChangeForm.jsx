import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../lib/helper/supabaseClient';

const PasswordChangeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Nieuwe wachtwoorden zijn niet hetzelfde");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Het nieuwe wachtwoord moet minstens 6 tekens hebben");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: formData.oldPassword,
      });

      if (loginError) {
        setError("Oude wachtwoord klopt niet");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) {
        setError("Fout bij updaten van wachtwoord: " + updateError.message);
      } else {
        setSuccess("Wachtwoord is geüpdated");

        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        setTimeout(() => {
          setSuccess(null);
        }, 2000);
      }
    } catch (err) {
      console.error("Onverwachte fout:", err);
      setError("Een onverwachte fout heeft plaatsgevonden");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPasswords((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-rose-600">Wachtwoord Wijzigen</h2>
          <p className="text-sm text-gray-600">Beveilig je account met een nieuw wachtwoord</p>
        </div>

        {/* Success and Error Messages */}
        {success && (
          <div className="p-3 mb-4 text-sm text-green-600 bg-green-100 border border-green-300 rounded-lg">
            <FontAwesomeIcon icon={faCheck} /> {success}
          </div>
        )}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Old Password Field */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-3 top-3.5 text-gray-400"
            />
            <input
              type={showPasswords ? "text" : "password"}
              name="oldPassword"
              placeholder="Oud Wachtwoord"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          {/* New Password Field */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-3 top-3.5 text-gray-400"
            />
            <input
              type={showPasswords ? "text" : "password"}
              name="newPassword"
              placeholder="Nieuw Wachtwoord"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-3 top-3.5 text-gray-400"
            />
            <input
              type={showPasswords ? "text" : "password"}
              name="confirmPassword"
              placeholder="Bevestig Wachtwoord"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          {/* Toggle Password Visibility */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-rose-500 hover:text-rose-700"
            >
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-rose-500 rounded-lg hover:bg-rose-700 transition duration-300"
          >
            Bevestig
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
