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
    console.log('Login button pressed'); // Add this line to debug
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
        <div className='form-box login'>
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>
            <div className='input-box'>
              <input
                type='email'
                placeholder='Email'
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <FaUser className='icon' />
            </div>
            <div className='input-box'>
              <input
                type='password'
                placeholder='Password'
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <FaLock className='icon' />
            </div>

            <div className='remember-forgot'>
              <label><input type='checkbox' /> Remember me</label>
            </div>

            <button type='submit'>Login</button>

            <div className='register-link'>
              <p>Don't have an account yet? <a href='#' onClick={() => setIsLogin(false)}>Register</a></p>
            </div>
          </form>
        </div>
      )}

      {/* Register Form */}
      {!isLogin && (
        <div className='form-box register'>
          <form onSubmit={handleSignUpSubmit}>
            <h1>Sign up</h1>
            <div className='input-box'>
              <input
                type='email'
                placeholder='Email'
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                required
              />
              <FaEnvelope className='icon' />
            </div>
            <div className='input-box'>
              <input
                type='password'
                placeholder='Password'
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
              />
              <FaLock className='icon' />
            </div>

            <div className='input-box'>
              <select required>
                <option value="">Select your Facility</option>
                <option value="facility1">Facility 1</option>
                <option value="facility2">Facility 2</option>
                <option value="facility3">Facility 3</option>
                <option value="facility4">Facility 4</option>
              </select>
            </div>

            <div className='remember-forgot'>
              <label><input type='checkbox' /> I agree to the terms and conditions</label>
            </div>

            <button type='submit'>Sign up</button>

            <div className='login-link'>
              <p>Already have an account? <a href='#' onClick={() => setIsLogin(true)}>Login</a></p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginRegister;
