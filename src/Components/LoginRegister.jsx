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
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);

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
      <div className="w-1/2 flex flex-col items-center justify-center bg-gradient-to-tr from-[#C5C3E0] to-[#7851A9] relative py-10">
        <div
          className="absolute top-0 right-0 bottom-0 left-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: `url(${butterflyImage})`, filter: 'blur(5px)' }}
        ></div>

        {/* Title with Animation */}
        <div className={`relative z-10 text-center font-poppins transition-all duration-700 ${isLogin ? 'mt-0' : 'mt-[-150px]'}`}>
          <h1 className="text-white text-6xl font-bold mb-4 font-cursive">V(l)inder</h1>
          <p className="text-white text-lg mb-6">Find your perfect match</p>

          {/* Registration Info Prompt */}
          {showRegisterInfo && (
            <div className="mt-6 bg-white bg-opacity-80 shadow-md rounded-lg p-4 max-w-md mx-auto">
              <h2 className="font-bold text-lg text-center text-purple-600">Join us and let your love story unfold...</h2>
              <ul className="list-disc list-inside text-left mt-2">
                <li>❤️ Inclusive: Designed with accessibility in mind.</li>
                <li>❤️ Supportive Community: Meet people who understand your journey.</li>
                <li>❤️ Safe & Secure: Your privacy is our priority.</li>
              </ul>
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

              {/* Facility Dropdown */}
              <div className="mb-6">
                <label htmlFor="facility" className="text-lg text-gray-600">
                  Choose your nearest facility:
                </label>
                <div className="relative mt-2">
                  <select
                    id="facility"
                    className="w-full py-4 pl-4 pr-10 text-lg border border-gray-300 rounded-lg bg-gray-100 appearance-none"
                    required
                  >
                    <option value="" disabled selected>
                      Select a facility
                    </option>
                    <option value="facility1">Facility 1</option>
                    <option value="facility2">Facility 2</option>
                    <option value="facility3">Facility 3</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {/* New Arrow Icon */}
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5H7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isTermsAgreed}
                  onChange={(e) => setIsTermsAgreed(e.target.checked)}
                  className="h-4 w-4 text-purple-500 focus:ring-purple-500"
                />
                <label className="ml-2 text-gray-600">
                  I agree to the <a href="#" className="text-blue-500" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>Terms and Conditions</a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
                disabled={!isTermsAgreed}
              >
                Sign Up
              </button>
            </form>
          )}

          <div className="text-center mt-8">
            {isLogin ? (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  className="text-purple-500 hover:text-purple-700"
                  onClick={() => { setIsLogin(false); setShowRegisterInfo(true); }}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  className="text-purple-500 hover:text-purple-700"
                  onClick={() => { setIsLogin(true); setShowRegisterInfo(false); }}
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>

              {/* Modal for Terms and Conditions */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 max-w-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
            <div className="mb-6 overflow-y-scroll h-64 p-4 border rounded-lg">
              <p className="text-gray-600">
                Welcome to our platform. By accessing and using our services, you agree to comply with the following terms and conditions:
                <br /><br />
                1. **Acceptance of Terms**: By creating an account, you agree to be bound by these terms and any amendments.
                <br /><br />
                2. **Privacy Policy**: Your personal data is protected under our privacy policy.
                <br /><br />
                3. **Account Responsibilities**: You are responsible for maintaining the confidentiality of your account.
                <br /><br />
                4. **Prohibited Activities**: You may not engage in illegal or harmful activities on this platform.
                <br /><br />
                5. **Termination**: We reserve the right to suspend or terminate your account at any time.
                <br /><br />
                And so on...
              </p>
            </div>
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="agreeTerms"
                className="mr-2"
                checked={isTermsAgreed}
                onChange={() => setIsTermsAgreed(!isTermsAgreed)}
              />
              <label htmlFor="agreeTerms" className="text-gray-600">
                I have read and agree to the terms and conditions
              </label>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className={`w-full py-3 text-white ${isTermsAgreed ? 'bg-purple-600' : 'bg-gray-400 cursor-not-allowed'} rounded-lg transition-transform duration-300`}
              disabled={!isTermsAgreed}
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default LoginRegister;
