// MainLayout.js
import React from 'react';
import TopNavigationBar from './components/common/TopNavigationBar';


const MainLayout = ({ children }) => {
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
