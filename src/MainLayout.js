// MainLayout.js
import React from 'react';
import TopNavigationBar from './Components/common/TopNavigationBar';


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
