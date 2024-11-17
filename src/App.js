import React, { useEffect, useState } from 'react';
import { supabase } from './lib/helper/supabaseClient';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginRegister from './Components/LoginRegister';
import Home from './Components/Home';
import ChatsPage from './pages/ChatsPage';
import Feed from './Components/Feed'
import SettingsUser from './Components/SettingsUser';
import PasswordChangeForm from './Components/PasswordChangeForm';
import UserFilterForm from './Components/UserFilterForm';
import ImageUpload from './Components/ImageUpload';
import TopNavigationBar from './Components/TopNavigationBar';
import MentorBanUser from './Components/MentorBanUser';
import SettingsMentor from './Components/SettingsMentor';
import SubscriptionPlans from './Components/SubscriptionPlans';
import PasswordRecovery from './Components/PasswordRecovery';
import PasswordUpdate from './Components/PasswordUpdate';
import ProfielPauzeren from './Components/ProfielPauzeren';


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
  async function signUpWithEmail(email, password, isMentor) {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      throw new Error(error.message); // Handle errors from signUp
    }

    const role = isMentor ? 'STAFF_MEMBER' : 'USER';
    const { error: updateError } = await supabase
      .from('users')
      .update({ role })
      .eq('email', email);

    if (updateError) {
      throw new Error(updateError.message); // Handle errors from update query
    }


    if (error) {
      setError(error.message);
    } else {
      console.log('Logged in successfully with email/password:', data);
      setUser(data.user); // Set the user after successful login
      setError(''); // Clear any previous errors on success
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
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} error={error} />}
        />
        <Route path="/chats" element={user ? <ChatsPage /> : <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />} />
        {/* Route to Feed */}
        <Route path="/settingsMentor" element={<SettingsMentor />} />
        <Route path="/mentorBanUser" element={<MentorBanUser />} />

        <Route 
          path="/feed" 
          element={user ? <Feed user={user} /> : <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />} 
        />
        {/* Add other routes here */}
        <Route path="/settingsUser" element={<SettingsUser />} />
        <Route path="/PasswordChangeForm" element={<PasswordChangeForm />} />
        <Route 
          path="/userFilterForm" 
          element={user ? <UserFilterForm userId={user.id} /> : <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />} />
        {/* Route to UploadFoto */}
        <Route path="/uploadFoto" element={user ? <ImageUpload /> : <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />} />
        <Route path="/bar" element={<TopNavigationBar />} /> {/*Wanneer de bar overal geïntegreerd is mag dit weg*/}

        <Route path="/subscription" element={user ? <SubscriptionPlans /> : <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />} />
        <Route path="/forgotPassword" element={<PasswordRecovery />} /> 
        <Route path="/updatePassword" element={<PasswordUpdate />} /> 
        <Route path="/pp" element={<ProfielPauzeren />} />
        
      </Routes>
    </Router>
  );
}
