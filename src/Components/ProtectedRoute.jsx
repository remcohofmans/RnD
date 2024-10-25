// src/Components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, loggedIn }) => {
  return loggedIn ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
