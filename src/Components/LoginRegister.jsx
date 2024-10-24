import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import butterflyImage from '../Assets/Butterfly.png';

const LoginRegister = ({ loginWithEmail, signUpWithEmail }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [showRegisterInfo, setShowRegisterInfo] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false); // State for checkbox agreement

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      console.error("Please provide email and password for login.");
      return;
    }
    loginWithEmail(loginEmail, loginPassword);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signUpEmail || !signUpPassword || !isTermsAgreed) {
      console.error("Please provide email, password and agree to the terms for sign up.");
      return;
    }
    signUpWithEmail(signUpEmail, signUpPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Half */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-gradient-to-tr from-gray-50 to-gray-200 relative py-10">
        <div className="absolute top-0 right-0 bottom-0 left-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${butterflyImage})`, filter: 'blur(5px)' }}></div>

        {/* Title with Animation */}
        <div className={`relative z-10 text-center font-poppins transition-all duration-700 ${isLogin ? 'mt-0' : 'mt-[-150px]'}`}>
          <h1 className="text-gray-800 text-5xl font-bold mb-4 font-cursive">V(l)inder</h1>
          <p className="text-gray-600 text-lg mb-6">Find your perfect match</p>

          {/* Registration Info Prompt */}
          {showRegisterInfo && (
            <div className="mt-6 bg-white text-gray-600 p-4 rounded-lg shadow-md">
              Create an account to connect with like-minded people and start building meaningful connections.
            </div>
          )}
        </div>
      </div>

      {/* Right Half */}
      <div className="w-1/2 flex flex-col justify-center p-12 bg-white shadow-lg">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{isLogin ? 'Login' : 'Sign Up'}</h2>

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <FaEnvelope className={`absolute left-3 top-3 text-gray-500 ${focusEmail ? 'text-purple-500' : ''}`} />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onFocus={() => setFocusEmail(true)}
                  onBlur={() => setFocusEmail(false)}
                  className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Email"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <FaLock className={`absolute left-3 top-3 text-gray-500 ${focusPassword ? 'text-purple-500' : ''}`} />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onFocus={() => setFocusPassword(true)}
                  onBlur={() => setFocusPassword(false)}
                  className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <FaEnvelope className={`absolute left-3 top-3 text-gray-500 ${focusEmail ? 'text-purple-500' : ''}`} />
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  onFocus={() => setFocusEmail(true)}
                  onBlur={() => setFocusEmail(false)}
                  className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Email"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <FaLock className={`absolute left-3 top-3 text-gray-500 ${focusPassword ? 'text-purple-500' : ''}`} />
                <input
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  onFocus={() => setFocusPassword(true)}
                  onBlur={() => setFocusPassword(false)}
                  className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Password"
                  required
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isTermsAgreed}
                  onChange={(e) => setIsTermsAgreed(e.target.checked)}
                  className="h-4 w-4 text-purple-500 focus:ring-purple-500"
                />
                <label className="ml-2 text-gray-600">I agree to the Terms of Service</label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
              >
                Sign Up
              </button>
            </form>
          )}

          {/* Toggle Form */}
          <div className="text-center mt-8">
            {isLogin ? (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  className="text-purple-500 hover:text-purple-700 font-medium"
                  onClick={() => {
                    setIsLogin(false);
                    setShowRegisterInfo(true);
                  }}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  className="text-purple-500 hover:text-purple-700 font-medium"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
