import { React, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginRegister from './Components/LoginSignUp'
import Home from './Components/Home'
                                                                                                                     
//test
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for Login/Sign Up page */}
        <Route path="/" element={<Home />} />
        
        {/* Route for Home page */}
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </Router>
  );
};

export default App;
