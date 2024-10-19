import React, { useEffect, useState } from 'react';
import { supabase } from './lib/helper/supabaseClient';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginRegister from './Components/LoginRegister';
import Home from './Components/Home';
import Chats from './pages/Chats';
import Feed from './Components/Feed'

export default function App() {
  // Employ useState -a React built-in webhook- to  store the user object in the component's state
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function for email/password login
  async function loginWithEmail(email, password) {
    setLoading(true); // disable submit button while waiting for the response
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      setError(error.message);
      console.error('Error logging in with email/password:', error.message);
    } else {
      console.log('Logged in successfully with email/password:', data);
      setUser(data.user); // Set the user after successful login
    }

    setLoading(false); // enable submit button (and other UI elements) after response
  }

  // Function for email/password sign-up
  async function signUpWithEmail(email, password) {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      console.error('Error signing up with email/password:', error.message);
    } else {
      console.log('Signed up successfully:', data);
      setUser(data.user); // Set the user after successful sign-up
    }
    setLoading(false);
  }

  // Logout function
  const logout = async () => {
  setLoading(true);
  const { error } = await supabase.auth.signOut(); // Ensure we handle any errors from signOut
  if (error) {
    console.error('Error logging out:', error);
  } else {
    setUser(null);  // Reset user state on successful logout
  }
  setLoading(false);
};


  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        setError(error.message);
      } else {
        setUser(data?.session?.user || null);
      }
      setLoading(false);
    };

    checkSession();
  }, []); // Run only on mount

  return (
    <Router>
      <Routes>
        {/* Protect the Home route so only authenticated users can access it */}
        <Route 
          path="/" 
          element={user ? <Home 
              loggedIn={!!user}  // Boolean to indicate logged-in status
              logout={logout} 
              email={user?.email} /> : <Navigate to="/login" />} />
              {/* Login/Register route */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />} />
        <Route path="/chats" element={<Chats/>} />
        {/* Route to Feed */}
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
}
