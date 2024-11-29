import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';
import AppRoutes from './AppRoutes.jsx';
import { AnalyticsProvider } from './hooks/analyticsContext.js';


function App() {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AnalyticsProvider>
    </AuthProvider>
  );
}

export default App;