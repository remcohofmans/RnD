import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import './LoginRegister.css';

const LoginRegister = ({ loginWithEmail, signUpWithEmail }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Handle login form submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      console.error("Please provide email and password for login.");
      return;
    }
    loginWithEmail(loginEmail, loginPassword); // Call login function with email and password
  };

  // Handle signup form submit
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signUpEmail || !signUpPassword) {
      console.error("Please provide email and password for sign up.");
      return;
    }
    signUpWithEmail(signUpEmail, signUpPassword); // Call signup function with email and password
  };

  return (
    <div className={`wrapper ${!isLogin ? 'active' : ''}`}>
      {/* Login Form */}
      {isLogin && (
        <div className="form-box login bg-white shadow-lg rounded-2xl p-8">
          <form onSubmit={handleLoginSubmit}>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full py-2 px-4 rounded-lg bg-gray-100 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
                <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full py-2 px-4 rounded-lg bg-gray-100 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
                <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center mb-6">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
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
        <div className="form-box register bg-white shadow-lg rounded-2xl p-8">
          <form onSubmit={handleSignUpSubmit}>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign up</h1>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                  className="w-full py-2 px-4 rounded-lg bg-gray-100 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
                <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                  className="w-full py-2 px-4 rounded-lg bg-gray-100 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
                <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="mb-4">
              <select
                required
                className="w-full py-2 px-4 rounded-lg bg-gray-100 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none"
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
                className="mr-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-blue-500">terms and conditions</a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign up
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
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
