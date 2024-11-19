// MainLayout.js
import React from 'react';
import TopNavigationBar from './Components/common/TopNavigationBar';

const MainLayout = ({ children, loggedIn, logout }) => {
  return (
    <div>
      {/* Render TopNavigationBar and pass required props */}
      <TopNavigationBar loggedIn={loggedIn} logout={logout} />
      
      {/* Render the main content below the TopNavigationBar */}
      <div className="mt-16"> {/* Add margin or padding as needed to offset the TopNavigationBar height */}
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
