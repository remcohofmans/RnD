import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  console.log("ProtectedRoute Debugging:");
  console.log("User:", user);
  console.log("Role:", role);
  console.log("AllowedRoles:", allowedRoles);
  console.log("Loading:", loading);

  const AnimatedDots = ({ message = "Loading" }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce delay-200"></div>
        </div>
        <p className="mt-4 text-xl text-gray-600 font-semibold">
          {message}
        </p>
      </div>
    </div>
  );

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
