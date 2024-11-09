import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import happyPeople from '../Assets/happyPeople.png';
import butterflyIcon from '../Assets/Butterfly.png'; // Assuming the butterfly image is stored in Assets

const LoginRegister = ({ loginWithEmail, signUpWithEmail }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [showRegisterInfo, setShowRegisterInfo] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError("Please provide both email and password.");
      return;
    }
    loginWithEmail(loginEmail, loginPassword)
      .catch(() => setLoginError("Invalid login credentials. Please try again."));
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signUpEmail || !signUpPassword || !isTermsAgreed || signUpPassword !== confirmPassword) {
      if (signUpPassword !== confirmPassword) {
        setSignupError("Passwords do not match.");
      } else {
        setSignupError("Please fill all fields and agree to the terms.");
      }
      return;
    }
    signUpWithEmail(signUpEmail, signUpPassword)
      .then(() => setSignupError(''))
      .catch(() => setSignupError("Sign up failed. Please try again."));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Half */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-gradient-to-tr from-[#fda4af] to-[#f43f5e] relative py-10">
        <div
          className="absolute top-0 right-0 bottom-0 left-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: `url(${happyPeople})`, filter: 'blur(5px)' }}
        ></div>
        <div className={`relative z-10 text-center font-poppins transition-all duration-700 ${isLogin ? 'mt-0' : 'mt-[-150px]'}`}>
          <h1 className="text-[#ffe4e6] text-6xl font-bold mb-4 font-cursive">V(l)inder</h1>
          <p className="text-[#fff1f2] text-lg mb-6">Find your perfect match</p>

          {showRegisterInfo && (
            <div className="mt-6 bg-white bg-opacity-80 shadow-md rounded-lg p-4 w-full mx-auto">
              <h2 className="font-bold text-lg text-center text-[#e11d48]">Join us and let your love story unfold...</h2>
              <div className="flex justify-between items-center text-center mt-4 space-x-6 w-full">
                <div className="flex items-center space-x-2">
                  <span>❤️</span>
                  <strong>Inclusive</strong>
                </div>
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <span>❤️</span>
                  <strong>Supportive Community</strong>
                </div>
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <span>❤️</span>
                  <strong>Safe & Secure</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Half */}
      <div className="w-1/2 flex flex-col justify-center p-12" style={{ backgroundColor: '#fbf6f0' }} >
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-center mb-8 relative">
          {isLogin ? (
            <>
              <h2 className="text-3xl font-bold text-[#be123c]">Login</h2>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-[#be123c]">Sign Up</h2>
            </>
          )}
        </div>

      {/* Position the butterfly icon in the top-right corner of the screen */}
      <img 
        src={butterflyIcon} 
        alt="Butterfly Icon" 
        className="absolute top-4 right-4 w-12 h-12 opacity-70" 
      />
      {isLogin ? (
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className={`absolute left-3 top-3 text-gray-500 ${focusEmail ? 'text-[#be123c]' : ''}`} />
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              onFocus={() => setFocusEmail(true)}
              onBlur={() => setFocusEmail(false)}
              className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
              placeholder="Email"
              required
            />
          </div>
    <div className="relative">
      <FaLock className={`absolute left-3 top-3 text-gray-500 ${focusPassword ? 'text-[#be123c]' : ''}`} />
      <input
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        onFocus={() => setFocusPassword(true)}
        onBlur={() => setFocusPassword(false)}
        className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
        placeholder="Password"
        required
      />
    </div>

    {loginError && <p className="text-red-600 text-center mt-2">{loginError}</p>}

    <button
      type="submit"
      className="w-full py-3 bg-[#e11d48] text-white rounded-lg hover:bg-[#be123c] transition-transform transform hover:scale-105"
    >
      Login
    </button>
  </form>
) : (
  <form onSubmit={handleSignUpSubmit} className="space-y-6">
    <div className="relative">
      <FaEnvelope className={`absolute left-3 top-3 text-gray-500 ${focusEmail ? 'text-[#be123c]' : ''}`} />
      <input
        type="email"
        value={signUpEmail}
        onChange={(e) => setSignUpEmail(e.target.value)}
        onFocus={() => setFocusEmail(true)}
        onBlur={() => setFocusEmail(false)}
        className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
        placeholder="Email"
        required
      />
    </div>
    <div className="relative">
      <FaLock className={`absolute left-3 top-3 text-gray-500 ${focusPassword ? 'text-[#be123c]' : ''}`} />
      <input
        type="password"
        value={signUpPassword}
        onChange={(e) => setSignUpPassword(e.target.value)}
        onFocus={() => setFocusPassword(true)}
        onBlur={() => setFocusPassword(false)}
        className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
        placeholder="Password"
        required
      />
    </div>
    <div className="relative">
      <FaLock className={`absolute left-3 top-3 text-gray-500 ${focusPassword ? 'text-[#be123c]' : ''}`} />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
        placeholder="Confirm Password"
        required
      />
    </div>

    {signupError && <p className="text-red-600 text-center mt-2">{signupError}</p>}

    <div className="flex items-center">
      <input
        type="checkbox"
        checked={isTermsAgreed}
        onChange={(e) => setIsTermsAgreed(e.target.checked)}
        className="h-4 w-4 text-[#e11d48] focus:ring-[#fda4af]"
      />
      <label className="ml-2 text-gray-600">
  I agree to the{" "}
  <a
    href="#"
    className="text-[#000000] underline hover:text-[#1e40af]" // New color
    onClick={(e) => {
      e.preventDefault();
      setShowTermsModal(true);
    }}
  >
    Terms and Conditions
  </a>
</label>

              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#f43f5e] text-white rounded-lg hover:bg-[#be123c] transition-transform transform hover:scale-105"
                disabled={!isTermsAgreed}
              >
                Registreer
              </button>
            </form>
          )}

          <div className="text-center mt-8">
            {isLogin ? (
              <p className="text-gray-600">
                Heb je nog geen account?{' '}
                <button
                  className="text-[#e11d48] hover:text-[#be123c] font-bold"
                  onClick={() => { setIsLogin(false); setShowRegisterInfo(true); }}
                >
                  Registreer hier
                </button>
                <br />
                <span className="text-sm font-semibold mt-2 block">
                  (faciliteitscode vereist)
                </span>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  className="text-[#e11d48] hover:text-[#be123c] font-bold"
                  onClick={() => { setIsLogin(true); setShowRegisterInfo(false); }}
                >
                  Login
                </button>
              </p>
            )}
          </div>

          {showTermsModal && (
            <div className="fixed inset-0 bg-[#881337] bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-11/12 max-w-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-[#be123c]">Terms and Conditions</h2>
                <div className="mb-6 overflow-y-scroll h-64 p-4 border rounded-lg">
                  <p className="text-gray-600">
                    Welcome to our platform. By accessing and using our services, you agree to comply with the following terms and conditions:
                    <br /><br />
                    1. <strong>Acceptance of Terms:</strong> By creating an account, you agree to be bound by these terms and any amendments.
                    <br /><br />
                    2. <strong>Privacy Policy:</strong> Your personal data is protected under our privacy policy.
                    <br /><br />
                    3. <strong>Account Responsibilities:</strong> You are responsible for maintaining the confidentiality of your account.
                    <br /><br />
                    4. <strong>Prohibited Activities:</strong> You may not engage in illegal or harmful activities on this platform.
                    <br /><br />
                    5. <strong>Termination:</strong> We reserve the right to suspend or terminate your account at any time.
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
                  className={`w-full py-3 text-white ${isTermsAgreed ? 'bg-[#e11d48]' : 'bg-gray-400 cursor-not-allowed'} rounded-lg transition-transform duration-300`}
                  disabled={!isTermsAgreed}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
