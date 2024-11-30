// MainLayout.js
import React from 'react';
import TopNavigationBar from './Components/common/TopNavigationBar';
import { useAuth } from './hooks/AuthContext'; // Use the hook to access auth context

const MainLayout = ({ children }) => {

  const { user } = useAuth();
  const loggedIn = !!user;

  return (
    <div>
      <TopNavigationBar />  
      <div>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
