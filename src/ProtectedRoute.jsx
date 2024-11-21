import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  // If the user is still loading, you can show a loading indicator or a blank page
  if (loading) {
    return <div>Loading...</div>;  // This can be a spinner or any loading indicator
  }

  if (!user) return <Navigate to="/login" replace />;  // If no user, redirect to login
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;  // If role is not allowed, redirect

  return children;  // If role is allowed, render the children (protected route)
};

export default ProtectedRoute;
