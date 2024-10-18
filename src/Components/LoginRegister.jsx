import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const LoginRegister = ({ loginWithEmail, signUpWithEmail }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // State to track focus on inputs
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

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
    if (!signUpEmail || !signUpPassword) {
      console.error("Please provide email and password for sign up.");
      return;
    }
    signUpWithEmail(signUpEmail, signUpPassword);
  };

  return (
    <div className={`wrapper flex items-center justify-center min-h-screen ${!isLogin ? 'active' : ''}`}>
      {/* Login Form */}
      {isLogin && (
        <div className="form-box login bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
          <form onSubmit={handleLoginSubmit} className="flex flex-col">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Login</h1>

            <div className="mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100">
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
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100">
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
              className="w-full py-4 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login
            </button>

            <div className="text-center mt-8">
              <p className="text-lg text-gray-600">
                Don't have an account yet?{' '}
                <a
                  href="#"
                  className="text-blue-500 hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      )}

      {/* Register Form */}
      {!isLogin && (
        <div className="form-box register bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
          <form onSubmit={handleSignUpSubmit} className="flex flex-col">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Sign up</h1>

            <div className="mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100">
                <input
                  type="email"
                  placeholder="Email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  onFocus={() => setFocusEmail(true)}
                  onBlur={() => setFocusEmail(false)}
                  required
                  className={`flex-grow py-4 px-4 text-lg bg-gray-100 focus:outline-none transition-transform duration-300 transform rounded-lg ${focusEmail ? 'scale-105' : ''}`}
                />
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FaEnvelope className="text-gray-400 text-xl" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100">
                <input
                  type="password"
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
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

            <div className="mb-6">
              <select
                required
                className="w-full py-4 px-4 text-lg rounded-lg bg-gray-100 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="">Select your Facility</option>
                <option value="facility1">Facility 1</option>
                <option value="facility2">Facility 2</option>
                <option value="facility3">Facility 3</option>
                <option value="facility4">Facility 4</option>
              </select>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="terms"
                className="mr-2 text-lg"
                required
              />
              <label htmlFor="terms" className="text-lg text-gray-600">
                I agree to the <a href="#" className="text-blue-500">terms and conditions</a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign up
            </button>

            <div className="text-center mt-8">
              <p className="text-lg text-gray-600">
                Already have an account?{' '}
                <a
                  href="#"
                  className="text-blue-500 hover:underline"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginRegister;
