import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes.jsx';
import { AnalyticsProvider } from './hooks/analyticsContext.js';


function App() {
  return (
      <AnalyticsProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AnalyticsProvider>
  );
}

export default App;