import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/AuthContext';

function LoginWrapper({ children }) {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // If no user is logged in, navigate to the login page
      navigate('/login');
    } else {
      // Redirect based on the user's role
      switch (role) {
        case 'STAFF_MEMBER':
          navigate('/settingsMentor');
          break;
        case 'USER':
          // Allow rendering of the child components for 'USER' role
          break;
        default:
          navigate('/login');
      }
    }
  }, [user, role, navigate]);

  return children;
}

export default LoginWrapper;
