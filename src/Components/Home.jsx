import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Home = ({ loggedIn, email }) => {
const navigate = useNavigate();

const handleButtonClick = useCallback(() => {
  if (loggedIn) {
    // Logic for logging out (add your logout logic here)
    console.log('Logging out...'); // Example placeholder for actual logout logic
  } else {
    navigate('/login'); // Redirect to login page
  }
}, [loggedIn, navigate]);

  return (
    <div class="container" id="container">
      <div class="form-container sign-up">
        <form>
          <h1>
            This is the homepage!
          </h1>
          <div className="social-icons">
              <a href="#" class="icon">
              <i class="fa-brands fa-google"></i></a>
          </div>
        </form>
      </div>

      <p>In ontwerp...</p>
      <div className="button-container">
        <input
          className="input-button"
          type="button"
          onClick={handleButtonClick}
          value={loggedIn ? 'Log out' : 'Log in'}
          aria-label={loggedIn ? 'Log out' : 'Log in'}
        />
        {loggedIn && email && (
          <div className="email-address">Your email address is {email}</div>
        )}
      </div>
    </div>
  );
};

export default Home;
