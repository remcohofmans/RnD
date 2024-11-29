import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/AuthContext';

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

import MainLayout from './MainLayout';
import ProtectedRoute from './ProtectedRoute';
import TopNavigationBar from './Components/common/TopNavigationBar';

function AppRoutes() {

  const { user, role } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <LoginRegister /> : <Navigate to="/" />} />
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
                <Home />
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