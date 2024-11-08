import React, { useEffect, useState } from 'react';
import { supabase } from './lib/helper/supabaseClient';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginRegister from './Components/LoginRegister';
import Home from './Components/Home';
import ChatsPage from './pages/ChatsPage';
import Feed from './Components/Feed';
import SettingsUser from './Components/SettingsUser';
import PasswordChangeForm from './Components/PasswordChangeForm';
import UserFilterForm from './Components/UserFilterForm';
import ImageUpload from './Components/ImageUpload';
import TopNavigationBar from './Components/TopNavigationBar';

export default function App() {
  // State initialization
  const [user, setUser] = useState(null); // User state to track login state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function for email/password login
  async function loginWithEmail(email, password) {
    setLoading(true);
    
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

    setLoading(false);
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
    const { error } = await supabase.auth.signOut(); 
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

  // If the user is not loaded yet, show a loading spinner or placeholder
  if (loading) {
    return <div>Loading...</div>;
  }

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
        <Route path="/chats" element={user ? <ChatsPage /> : <Navigate to="/login" />} />
        {/* Route to Feed */}
        <Route path="/settings" element={<SettingsUser />} />
        <Route path="/PasswordChangeForm" element={<PasswordChangeForm />} />
        <Route path="/feed" element={user ? <Feed /> : <Navigate to="/login" />} />

        {/* Route to UserFilterForm */}
        <Route path="/userFilterForm" element={user ? <UserFilterForm /> : <Navigate to="/login" />} />
        
        {/* Route to UploadFoto */}
        <Route path="/uploadFoto" element={user ? <ImageUpload /> : <Navigate to="/login" />} />

        <Route path="/bar" element={<TopNavigationBar />} /> {/* Optional navigation bar */}
      </Routes>
    </Router>
  );
}
