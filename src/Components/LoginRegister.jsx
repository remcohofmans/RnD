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
      <div className="w-1/2 flex flex-col items-center justify-center bg-gradient-to-tr from-[#C5C3E0] to-[#7851A9] relative py-10">
        <div className="absolute top-0 right-0 bottom-0 left-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${butterflyImage})`, filter: 'blur(5px)' }}></div>

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

      {/* Right Half (Login/Signup Form) */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <div className={`wrapper flex items-center justify-center w-full max-w-md py-10 ${!isLogin ? 'active' : ''}`}>
          {/* Login Form */}
          {isLogin && (
            <div className="form-box login bg-white shadow-xl rounded-3xl w-full py-10 px-8 mx-4 transform transition-transform duration-300 hover:scale-105">
              <form onSubmit={handleLoginSubmit} className="flex flex-col">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Login</h1>

                <div className="mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300">
                    <input
                      type="email"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      onFocus={() => setFocusEmail(true)}
                      onBlur={() => setFocusEmail(false)}
                      required
                      className={`flex-grow py-4 px-4 text-lg bg-gray-100 focus:outline-none transition-transform duration-300 transform rounded-lg ${focusEmail ? 'scale-105' : ''}`}
                    />
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FaUser className="text-gray-400 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300">
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onFocus={() => setFocusPassword(true)}
                      onBlur={() => setFocusPassword(false)}
                      required
                      className={`flex-grow py-4 px-4 text-lg bg-gray-100 focus:outline-none transition-transform duration-300 transform rounded-lg ${focusPassword ? 'scale-105' : ''}`}
                    />
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FaLock className="text-gray-400 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <input type="checkbox" id="remember" className="mr-2 text-lg" />
                  <label htmlFor="remember" className="text-lg text-gray-600">Remember me</label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:bg-pink-600 transition-transform duration-300 transform hover:scale-105"
                >
                  Log in
                </button>

                <div className="text-center mt-8">
                  <p className="text-lg text-gray-600">
                    Don't have an account yet?{' '}
                    <a
                      href="#"
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setIsLogin(false);
                        setShowRegisterInfo(true); // Show registration info when switching to sign up
                      }}
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Sign Up Form */}
          {!isLogin && (
            <div className="form-box register bg-white shadow-xl rounded-3xl w-full py-10 px-8 mx-4 transform transition-transform duration-300 hover:scale-105">
              <form onSubmit={handleSignUpSubmit} className="flex flex-col">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Sign Up</h1>

                <div className="mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300">
                    <input
                      type="email"
                      placeholder="Email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                      className="flex-grow py-4 px-4 text-lg bg-gray-100 focus:outline-none rounded-lg"
                    />
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FaEnvelope className="text-gray-400 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300">
                    <input
                      type="password"
                      placeholder="Password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      className="flex-grow py-4 px-4 text-lg bg-gray-100 focus:outline-none rounded-lg"
                    />
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FaLock className="text-gray-400 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="facility" className="text-lg text-gray-600">
                    Choose your nearest facility:
                  </label>
                  <select
                    id="facility"
                    className="w-full py-4 px-4 mt-2 text-lg border border-gray-300 rounded-lg bg-gray-100"
                    required
                  >
                    <option value="" disabled selected>
                      Select a facility
                    </option>
                    <option value="facility1">Facility 1</option>
                    <option value="facility2">Facility 2</option>
                    <option value="facility3">Facility 3</option>
                  </select>
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mr-2 text-lg"
                    required
                    onChange={() => setShowTermsModal(true)}
                  />
                  <label htmlFor="terms" className="text-lg text-gray-600">
                    I agree to the <a href="#" className="text-blue-500" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>terms and conditions</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:bg-pink-600 transition-transform duration-300 transform hover:scale-105"
                  disabled={!isTermsAgreed}  // Disable the button until terms are agreed
                >
                  Sign up
                </button>

                <div className="text-center mt-8">
                  <p className="text-lg text-gray-600">
                    Already have an account?{' '}
                    <a
                      href="#"
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setIsLogin(true);
                        setShowRegisterInfo(false); // Hide registration info when switching back to login
                      }}
                    >
                      Log in
                    </a>
                  </p>
                </div>
              </form>
            </div>
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
  );
};

export default LoginRegister;
