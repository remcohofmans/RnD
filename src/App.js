import React, { useEffect, useState } from 'react';
import { supabase } from './lib/helper/supabaseClient';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginRegister from './Components/Auth/LoginRegister';
import Home from './Components/Home';
import ChatsPage from './Components/Chat/ChatsPage';
import Feed from './Components/Feed'
import SettingsUser from './Components/UserSettings/SettingsUser';
import PasswordChangeForm from './Components/UserSettings/PasswordChangeForm';
import UserFilterForm from './Components/UserSettings/UserFilterForm';
import ImageUpload from './Components/UserSettings/ImageUpload';
import TopNavigationBar from './Components/common/TopNavigationBar';
import MentorBanUser from './Components/MentorSettings/MentorBanUser';
import SettingsMentor from './Components/MentorSettings/SettingsMentor';
import SubscriptionPlans from './Components/SubscriptionPlans';
import PasswordRecovery from './Components/Auth/PasswordRecovery';
import PasswordUpdate from './Components/Auth/PasswordUpdate';
import ProfielPauzeren from './Components/UserSettings/ProfielPauzeren';
import MainLayout from './MainLayout'; // Import MainLayout


export default function App() {
  // Employ useState -a React built-in webhook- to  store the user object in the component's state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);

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
      setUser(data.user);
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();
        if (userError) {
          console.error('Error fetching user role:', userError.message);
        } else {
          console.log('User role fetched successfully:', userData.role);
          setRole(userData.role);
        }
      } catch (err) {
        console.error('Error in fetching user role:', err);
      }
    }
    setLoading(false);
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
    setRole(role);

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


  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        setError(error.message);
      } else {
        setUser(data?.session?.user || null);
        if (data?.session?.user) {
          try {
            // Fetch the role of the user from your 'users' table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.session.user.id) // Ensure we use the correct ID for the user
              .single();
            if (userError) {
              console.error('Error fetching user role:', userError.message);
            } else {
              setRole(userData?.role); // Set role properly
            }
          } catch (err) {
            console.error('Error fetching user role:', err);
          }
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []); // Runs once when the component is mounted
  if (loading) return <div>Loading...</div>;


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              role === 'STAFF_MEMBER' ? (
                <Navigate to="/settingsMentor" />
              ) : (
                <MainLayout loggedIn={!!user} logout={logout}>
                  <Home loggedIn={!!user} logout={logout} email={user?.email} role={role} />
                </MainLayout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" />
            ) : (
              <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />
            )
          }
        />

        <Route
          path="/chats"
          element={
            user ? (
              <MainLayout loggedIn={!!user} logout={logout}>
                <ChatsPage role={role} />
              </MainLayout>
            ) : (
              <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />
            )
          }
        />

        <Route
          path="/settingsMentor"
          element={
            user && role === 'STAFF_MEMBER' ? (
              <MainLayout loggedIn={!!user} logout={logout}>
                <SettingsMentor role={role} logout={logout} />
              </MainLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/mentorBanUser"
          element={
            user ? (
              <MainLayout loggedIn={!!user} logout={logout}>
                <MentorBanUser role={role} />
              </MainLayout>
            ) : (
              <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />
            )
          }
        />

        <Route
          path="/feed"
          element={
            user ? (
              <MainLayout loggedIn={!!user} logout={logout}>
                <Feed role={role} />
              </MainLayout>
            ) : (
              <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />
            )
          }
        />

        <Route
          path="/settingsUser"
          element={
            user ? (
              <MainLayout loggedIn={!!user} logout={logout}>
                <SettingsUser role={role} />
              </MainLayout>
            ) : (
              <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />
            )
          }
        />

        <Route
          path="/PasswordChangeForm"
          element={
            user ? (
              <MainLayout loggedIn={!!user} logout={logout}>
                <PasswordChangeForm role={role} />
              </MainLayout>
            ) : (
              <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />
            )
          }
        />

        <Route
          path="/userFilterForm"
          element={
            user ? (
              <MainLayout loggedIn={!!user} logout={logout}>
                <UserFilterForm userId={user.id} role={role} />
              </MainLayout>
            ) : (
              <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />
            )
          }
        />

        <Route
          path="/uploadFoto"
          element={
            user ? (
              <MainLayout loggedIn={!!user} logout={logout}>
                <ImageUpload role={role} />
              </MainLayout>
            ) : (
              <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />
            )
          }
        />

        <Route
          path="/subscription"
          element={
            user ? (
              <MainLayout loggedIn={!!user} logout={logout}>
                <SubscriptionPlans role={role} />
              </MainLayout>
            ) : (
              <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail} />
            )
          }
        />

        <Route path="/forgotPassword" element={<PasswordRecovery />} />

        <Route path="/updatePassword" element={<PasswordUpdate />} />

        <Route path="/pp" element={<ProfielPauzeren />} />
      </Routes>
    </Router>
  );
};