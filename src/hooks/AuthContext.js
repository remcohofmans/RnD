import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        }
      } catch (err) {
        console.error('Error in fetching user role:', err);
      }
    }
    setLoading(false);
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
      console.log('Logged in successfully with email/password:', data);
      setUser(data.user); // Set the user after successful login
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
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.session.user.id)
              .single();
            if (userError) {
              console.error('Error fetching user role:', userError.message);
            } else {
              setRole(userData?.role);
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
    <AuthContext.Provider value={{ user, role, loading, error, loginWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
