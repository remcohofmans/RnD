import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col">
      {/* Placeholder for TopNavigationBar - Client should implement their own */}
      <nav className="w-full bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-[#be123c]">V(l)inder</h1>
        </div>
      </nav>
      
{/* Split Layout Container */}
<div className="flex flex-1">
  {/* Left Half */}
  <div className="w-1/2 flex flex-col items-center justify-center bg-gradient-to-tr from-[#fda4af] to-[#f43f5e] relative py-10">
    <div
      className="absolute top-0 right-0 bottom-0 left-0 opacity-30 bg-cover bg-center"
      style={{ backgroundImage: `url('/api/placeholder/800/600')` }}
    ></div>

    {/* Title with Animation */}
    <div className={`relative z-10 text-center font-poppins transition-all duration-700 ${isLogin ? 'mt-0' : 'mt-[-150px]'}`}>
      <h1 className="text-[#ffe4e6] text-6xl font-bold mb-4">V(l)inder</h1>
      <p className="text-[#fff1f2] text-lg mb-6">Find your perfect match</p>

      {/* Registration Info Prompt */}
      {showRegisterInfo && (
        <div className="mt-6 bg-white bg-opacity-80 shadow-md rounded-lg p-4 max-w-full mx-auto">
          <h2 className="font-bold text-lg text-center text-[#e11d48]">Join us and let your love story unfold...</h2>
          <div className="flex justify-center items-center mt-2 gap-4 w-full">
            <span className="flex items-center">
              ❤️ <strong className="ml-2">Inclusive</strong>
            </span>
            <span className="flex items-center">
              ❤️ <strong className="ml-2">Supportive Community</strong>
            </span>
            <span className="flex items-center">
              ❤️ <strong className="ml-2">Safe & Secure</strong>
            </span>
          </div>
        </div>
      )}

    </div>
  </div>


{/* Right Half */}
<div className="w-1/2 flex flex-col justify-center p-12 bg-white shadow-lg">
<div className="w-full max-w-md mx-auto">
<h2 className="text-3xl font-bold text-[#be123c] text-center mb-8">{isLogin ? 'Login' : 'Sign Up'}</h2>

{isLogin ? (
  <form onSubmit={handleLoginSubmit} className="space-y-6">
    {/* Email Input */}
    <div className="relative">
      <Mail className={`absolute left-3 top-3 w-5 h-5 text-gray-500 ${focusEmail ? 'text-[#be123c]' : ''}`} />
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

      {/* Password Input */}
      <div className="relative">
        <Lock className={`absolute left-3 top-3 w-5 h-5 text-gray-500 ${focusPassword ? 'text-[#be123c]' : ''}`} />
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

      <button
        type="submit"
        className="w-full py-3 bg-[#e11d48] text-white rounded-lg hover:bg-[#be123c] transition-transform transform hover:scale-105"
      >
        Login
      </button>
    </form>
    ) : (
    <form onSubmit={handleSignUpSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="relative">
        <Mail className={`absolute left-3 top-3 w-5 h-5 text-gray-500 ${focusEmail ? 'text-[#be123c]' : ''}`} />
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

      {/* Password Input */}
      <div className="relative">
        <Lock className={`absolute left-3 top-3 w-5 h-5 text-gray-500 ${focusPassword ? 'text-[#be123c]' : ''}`} />
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

      {/* Facility Dropdown */}
      <div className="mb-6">
        <label htmlFor="facility" className="text-lg text-[#be123c]">
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
          className="h-4 w-4 text-[#e11d48] focus:ring-[#fda4af]"
        />
        <label className="ml-2 text-gray-600">
          I agree to the <a href="#" className="text-[#e11d48]" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>Terms and Conditions</a>
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[#f43f5e] text-white rounded-lg hover:bg-[#be123c] transition-transform transform hover:scale-105"
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
            className="text-[#e11d48] hover:text-[#be123c] font-bold"
            onClick={() => { setIsLogin(false); setShowRegisterInfo(true); }}
          >
            Sign Up
          </button>
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
  </div>
</div>

        {/* Modal for Terms and Conditions */}
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
  );
};

export default LoginRegister;