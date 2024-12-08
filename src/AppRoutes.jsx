import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/AuthContext';

import LoginRegister from './Components/Auth/LoginRegister';
import PasswordRecovery from './Components/Auth/PasswordRecovery';
import PasswordUpdate from './Components/Auth/PasswordUpdate';
import Home from './Components/Home';
import ChatsPage from './Components/Chat/ChatsPage';
import Feed from './Components/Feed';
import FeedFriends from './Components/FeedFriends';
import SettingsUser from './Components/UserSettings/SettingsUser';
import SettingsMentor from './Components/MentorSettings/SettingsMentor';
import CompleteRegistration from './Components/Auth/CompleteRegistration';
import SubscriptionPlans from './Components/SubscriptionPlans'
import AccessRequests from './Components/AccessRequests';

import MainLayout from './MainLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginWrapper from './LoginWrapper';


function AppRoutes() {

  return (
    <AuthProvider>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <LoginWrapper>
              <LoginRegister />
            </LoginWrapper>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <LoginWrapper>
              <ProtectedRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </ProtectedRoute>
            </LoginWrapper>
          }
        />

        <Route
          path="/chats"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <MainLayout>
                <ChatsPage />
              </MainLayout>
            </ProtectedRoute>
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
                <AccessRequests />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgotPassword"
          element={
            <ProtectedRoute >
              <MainLayout>
                <PasswordRecovery />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/updatePassword"
          element={
            <ProtectedRoute >
              <MainLayout>
                <PasswordUpdate />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        < Route path="*" element={< Navigate to="/" />} />
      </Routes >
    </AuthProvider>
  );
}

export default AppRoutes;