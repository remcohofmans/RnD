import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faCheck } from '@fortawesome/free-solid-svg-icons';
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
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Nieuwe wachtwoorden komen niet overeen.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Het nieuwe wachtwoord moet minstens 6 tekens bevatten.");
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
        setSuccess("Wachtwoord is geüpdatet.");

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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-rose-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-rose-600 mb-2">Wachtwoord Wijzigen</h2>
          <p className="text-sm text-gray-500">Beveilig je account met een nieuw wachtwoord</p>
        </div>

        {/* Notification Area */}
        <div className="min-h-[40px]">
          {success && (
            <div className="p-4 text-sm text-green-800 bg-green-100 border border-green-300 rounded-lg flex items-center mb-8">
              <FontAwesomeIcon icon={faCheck} className="mr-3 text-green-600" />
              {success}
            </div>
          )}
          {error && (
            <div className="p-4 text-sm text-red-800 bg-red-100 border border-red-300 rounded-lg mb-8">
              {error}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Oud Wachtwoord</label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type={showPasswords.oldPassword ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition duration-200"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('oldPassword')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-rose-500 transition"
              >
                <FontAwesomeIcon icon={showPasswords.oldPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nieuw Wachtwoord</label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition duration-200"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-rose-500 transition"
              >
                <FontAwesomeIcon icon={showPasswords.newPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bevestig Wachtwoord</label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition duration-200"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-rose-500 transition"
              >
                <FontAwesomeIcon icon={showPasswords.confirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 text-lg font-semibold text-white bg-rose-500 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            Bevestig
          </button>
        </form>

        {/* Password Requirements */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          Password must:
          <ul className="mt-2 space-y-1">
            <li>• Be at least 8 characters long</li>
            <li>• Contain an uppercase letter</li>
            <li>• Contain a number</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeForm;