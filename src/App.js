import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/AuthContext'; // The context provider and hook

import LoginRegister from './Components/Auth/LoginRegister';
import Home from './Components/Home';
import ChatsPage from './Components/Chat/ChatsPage';
import Feed from './Components/Feed';
import SettingsUser from './Components/UserSettings/SettingsUser';
import PasswordChangeForm from './Components/UserSettings/PasswordChangeForm';
import UserFilterForm from './Components/UserSettings/UserFilterForm';
import ImageUpload from './Components/UserSettings/ImageUpload';
import MentorBanUser from './Components/MentorSettings/MentorBanUser';
import SettingsMentor from './Components/MentorSettings/SettingsMentor';
import SubscriptionPlans from './Components/SubscriptionPlans';
import PasswordRecovery from './Components/Auth/PasswordRecovery';
import PasswordUpdate from './Components/Auth/PasswordUpdate';
import ProfielPauzeren from './Components/UserSettings/ProfielPauzeren';

import MainLayout from './MainLayout';

function AppRoutes() {
  const { user, role, loginWithEmail, signUpWithEmail, logout } = useAuth(); // Use the hook inside the routes

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            role === 'STAFF_MEMBER' ? (
              <Navigate to="/settingsMentor" />
            ) : (
              <MainLayout loggedIn={!!user}>
                <Home loggedIn={!!user} email={user?.email} />
              </MainLayout>
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <LoginRegister />}
      />

      <Route
        path="/chats"
        element={
          user ? (
            <MainLayout loggedIn={!!user}>
              <ChatsPage />
            </MainLayout>
          ) : (
            <LoginRegister />
          )
        }
      />

      <Route
        path="/settingsMentor"
        element={
          user && role === 'STAFF_MEMBER' ? (
            <MainLayout loggedIn={!!user}>
              <SettingsMentor />
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
            <MainLayout loggedIn={!!user}>
              <MentorBanUser />
            </MainLayout>
          ) : (
            <LoginRegister />
          )
        }
      />

      <Route
        path="/feed"
        element={
          user ? (
            <MainLayout loggedIn={!!user}>
              <Feed />
            </MainLayout>
          ) : (
            <LoginRegister />
          )
        }
      />

      <Route
        path="/settingsUser"
        element={
          user ? (
            <MainLayout loggedIn={!!user}>
              <SettingsUser />
            </MainLayout>
          ) : (
            <LoginRegister />
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
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
