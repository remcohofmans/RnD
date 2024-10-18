import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Home = ({ loggedIn, logout, email }) => {
const navigate = useNavigate();

const handleButtonClick = useCallback(() => {
  if (loggedIn) {
    // Call the passed logout function and navigate to login page after logout
    logout(); // Call the logout function passed as prop
    navigate('/login'); // Redirect to login page after logout
  } else {
    navigate('/login'); // Redirect to login page if user is not logged in
  }
}, [loggedIn, logout, navigate]); // Add logout to the dependencies

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

      <div className="button-container">
        <input
          className="input-button"
          type="button"
          onClick={handleButtonClick}
          value={'Log out'}
          aria-label={'Log out'}
        />
        {email && (
          <div className="email-address">Your email address is {email}</div>
        )}
      </div>
    </div>
  );
};

export default Home;
