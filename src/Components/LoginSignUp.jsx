import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import './LoginSignUp.css';

const LoginSignUp = () => {

  const [action, setAction] = useState('');
  const RegisterLink = () => {
    setAction(' active')
  };

  const LoginLink = () => {
    setAction('');
  };

  return (
    <div className={`wrapper${action}`}>
      <div className='form-box login'>
        <form action="">
          <h1>Login</h1>
          <div className='input-box'>
            <input type='text' placeholder='Username' required />
            <FaUser className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Password' required />
            <FaLock className='icon' />
          </div>

          <div className='remember-forgot'>
            <label><input type='checkbox' /> Remember me</label>
            <a href='#'>Forgot password?</a>
          </div>

          <button type='submit'>Login</button>

          <div className='register-link'>
            <p>Don't have an account yet? <a href='#' onClick={RegisterLink}>Register</a></p>
          </div>
        </form>
      </div>

      <div className='form-box register'>
        <form action="">
          <h1>Sign up</h1>
          <div className='input-box'>
            <input type='text' placeholder='Username' required />
            <FaUser className='icon' />
          </div>
          <div className='input-box'>
            <input type='email' placeholder='Email' required />
            <FaEnvelope className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Password' required />
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
            <label><input type='checkbox' /> I have read and agree to V(l)inder's Terms of Service and Privacy Policy</label>
          </div>

          <button type='submit'>Sign up</button>

          <div className='login-link'>
            <p>Already have an account? <a href='#' onClick={LoginLink}>Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginSignUp;
