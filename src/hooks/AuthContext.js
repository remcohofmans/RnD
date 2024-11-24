import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  // const [profileComplete, setProfileComplete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to update the 'facility_enum' column in 'users' table
  const updateFacilityEnum = async (signUpEmail, selectedFacility) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ facility_enum: selectedFacility })
        .eq('email', signUpEmail); // Update the user with the provided userId

      if (error) {
        console.error('Error updating facility_enum:', error);
        throw new Error('Error updating facility_enum');
      }
      console.log('Facility updated successfully:', data);
    } catch (error) {
      console.error('An error occurred during the update process:', error);
    }
  };

  // Helper to fetch user role
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setRole(data.role);
      console.log("Data object retrieved from fetchUserRole:", data);

    } catch (err) {
      console.error('Error fetching user role:', err.message);
      setRole(null);
    }
  };

  // Helper func to check profile completion
  const checkProfileCompletion = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, birthday')
        .eq('id', userId)
        .single();

      if (error) throw error;

      console.log("Checking profile ... Data object: ", data);

      // setProfileComplete(!!data.name && !!data.birthday);
    } catch (err) {
      console.error('Error checking profile completion:', err.message);
      // setProfileComplete(false);
    }
  };

  // Function to handle login
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      const loggedInUser = data.user;
      setUser(loggedInUser);
      await fetchUserRole(loggedInUser.id);
      // await checkProfileCompletion(loggedInUser.id);
      setError('');  // Clear any previous errors
      return { success: true, user: loggedInUser };
    } catch (err) {
      console.error('Error logging in:', err.message);
      setError(err.message);  // Set error state
      return { success: false, error: err.message }; // Return error message
    } finally {
      setLoading(false);
    }
  };

  // Function for email/password sign-up
  const signUpWithEmail = async (email, password, isMentor, selectedFacility) => {
    setLoading(true); // Show loading state
    try {
      // Sign up the user using Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error(`Sign-up failed: ${error.message}`);

      const newUser = data.user;
      const role = isMentor ? 'STAFF_MEMBER' : 'USER';

      // Fetch the facility ID based on the selected facility name
      const { data: facilityData, error: facilityError } = await supabase
        .from('facility_enum')
        .select('id')
        .eq('name', selectedFacility);

      if (facilityError) throw new Error(`Failed to fetch facility ID: ${facilityError.message}`);
      const facilityId = facilityData[0]?.id;

      console.log(facilityId);

      // Upsert the user into the 'users' table
      const { error: userError } = await supabase.from('users').upsert({
        id: newUser.id,
        email,
        role,
        facility_id: facilityId,
      });

      if (userError) throw new Error(`Failed to insert user into the database: ${userError.message}`);

      // Set user state or perform post-sign-up actions
      setUser(newUser);
      setRole(role);
      setError(null);

      console.log('User successfully registered:', { email, role, facilityId });
    } catch (err) {
      console.error('Error signing up:', err.message);
      setError(err.message); // Display error to the user
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
      // setProfileComplete(false);
    } catch (err) {
      console.error('Error logging out:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const sessionUser = data.session?.user;
        if (sessionUser) {
          setUser(sessionUser);
          await fetchUserRole(sessionUser.id);
          // await checkProfileCompletion(sessionUser.id);
        }
      } catch (err) {
        console.error('Error restoring session:', err.message);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, error, loginWithEmail, signUpWithEmail, logout, updateFacilityEnum }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
