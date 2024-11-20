import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false); // New state for profile completion
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper func to check profile completion
  const checkProfileCompletion = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, birthday')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile data:', error.message);
        setProfileComplete(false);
        return;
      }

      setProfileComplete(!!data.name && !!data.birthdate);
    } catch (err) {
      console.error('Unexpected error checking profile completion:', err);
      setProfileComplete(false);
    }
  };

  // Authenticate using Supabase
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
          setRole(userData.role);
          await checkProfileCompletion(data.user.id); // Check profile completion on login
        }
      } catch (err) {
        console.error('Error in fetching user role:', err);
      }
    }
    setLoading(false);
    return error;
  };

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
      console.log('Signed up successfully:', data);
      setUser(data.user); // Set the user after successful sign-up
      await checkProfileCompletion(data.user.id); // Check profile completion after sign-up
      setError(''); // Clear any previous errors on success
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
      setUser(null);
      setRole(null);
      setProfileComplete(false); // Reset profile completion state on logout
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
        const sessionUser = data?.session?.user || null;
        setUser(sessionUser);

        if (sessionUser) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', sessionUser.id)
              .single();

            if (userError) {
              console.error('Error fetching user role:', userError.message);
            } else {
              setRole(userData?.role);
              await checkProfileCompletion(sessionUser.id); // Check profile completion on session restore
            }
          } catch (err) {
            console.error('Error fetching user role:', err);
          }
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, profileComplete, loading, error, loginWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
