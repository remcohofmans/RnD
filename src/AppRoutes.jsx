import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/AuthContext';

import LoginRegister from './components/auth/LoginRegister';
import PasswordRecovery from './components/auth/PasswordRecovery';
import PasswordUpdate from './components/auth/PasswordUpdate';
import Home from './components/Home';
import ChatsPage from './components/chat/ChatsPage';
import Feed from './components/Feed';
import FeedFriends from './components/FeedFriends';
import SettingsUser from './components/userSettings/SettingsUser';
import SettingsMentor from './components/mentorSettings/SettingsMentor';
import CompleteRegistration from './components/auth/CompleteRegistration';
import SubscriptionPlans from './components/SubscriptionPlans'

import MainLayout from './MainLayout';
import ProtectedRoute from './ProtectedRoute';
import TopNavigationBar from './components/common/TopNavigationBar';
import { useAnalytics } from './hooks/AnalyticsContext';

function AppRoutes() {

  const { user, role, loginWithEmail, signUpWithEmail, checkSubscription, logoutAndNavigate } = useAuth();
  const { track } = useAnalytics();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <LoginRegister loginWithEmail={loginWithEmail} signUpWithEmail={signUpWithEmail}/> : <Navigate to="/" />} />
      <Route path="/forgotPassword" element={<PasswordRecovery />} />
      <Route path="/updatePassword" element={<PasswordUpdate />} />
      <Route path="/topbar" element={<TopNavigationBar />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          user ? (
            (role === 'STAFF_MEMBER') ? (
              <Navigate to="/settingsMentor" />
            ) : (
              <MainLayout >
                <Home track={track} user={user} role={role} checkSubscription={checkSubscription} logoutAndNavigate={logoutAndNavigate}/>
              </MainLayout>
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/chats"
        element={
          <MainLayout>
            <ChatsPage />
          </MainLayout>
        }
      />

      <Route
        path="/settingsMentor"
        element={
          <ProtectedRoute allowedRoles={['STAFF_MEMBER']}>
            <SettingsMentor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/feed"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <MainLayout>
              <Feed />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/feedFriends"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <MainLayout>
              <FeedFriends />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/subscription"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <MainLayout>
              <SubscriptionPlans />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settingsUser"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <MainLayout>
              <SettingsUser />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/completeProfile"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <MainLayout>
              <CompleteRegistration />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/accessRequests"
        element={
          <ProtectedRoute allowedRoles={['STAFF_MEMBER']}>
            <MainLayout>
              <CompleteRegistration />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;