import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/AuthContext';
import AnimatedDots from './Components/common/AnimatedDots';


const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  console.log("ProtectedRoute Debugging:");
  console.log("User:", user);
  console.log("Role:", role);
  console.log("Loading:", loading);

  if (loading) {
    return <AnimatedDots message="Please wait" />;
  }

  if (!user) {
    console.warn("No user found, redirecting to login...");
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn("Access denied. Redirecting...");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
