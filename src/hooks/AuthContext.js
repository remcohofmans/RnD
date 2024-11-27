import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Existing functions for mentor, user and profile management...

  const fetchCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersForMentor = async (mentorId) => {
    try {
      const { data: mentorData, error: mentorError } = await supabase
        .from('users')
        .select('facility_id')
        .eq('id', mentorId)
        .single();

      if (mentorError) throw mentorError;

      const mentorFacility = mentorData.facility_id;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'USER')
        .eq('access_granted', 'PENDING')
        .eq('facility_id', mentorFacility)
        .not('birthday', 'is', null)
        .not('name', 'is', null);

      if (error) throw error;

      return data.sort((a, b) => {
        const nameA = a.name ? a.name.toLowerCase() : '';
        const nameB = b.name ? b.name.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      });
    } catch (error) {
      console.error('Error fetching users for mentor:', error.message);
      throw error;
    }
  };

  // Function to handle login
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {

      console.log('email',email);
      
      
      const {data: userData, error: userError} = await supabase
        .from('users')
        .select('*')
        .eq('email',email);
      
      if (userError) {
        
        console.error("Error fetching user data:", userError.message);
        throw new Error("Failed to verify account.");
      }
  
      console.log("Userdata: ", userData);
  
      if (!userData || userData.length === 0) {
        setError("This account was deleted");
        return { success: false, error: "This account was deleted" }; // Stop further execution
      }
      

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      const loggedInUser = data.user;
      setUser(loggedInUser);
      await fetchUserRole(loggedInUser.id);
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

  // Fetch user role
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

  // Fetch profile picture URL
  const fetchProfilePictureUrl = async (userId) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('pictures')
        .list(`${userId}/profielAfbeelding`);

      if (error || data.length === 0) return null;

      const { data: publicUrlData } = supabase
        .storage
        .from('pictures')
        .getPublicUrl(`${userId}/profielAfbeelding/${data[0].name}`);

      return publicUrlData?.publicUrl || null;
    } catch (error) {
      console.error('Error fetching profile picture:', error.message);
      return null;
    }
  };

  // Update access status
  const updateAccessStatus = async (userId, status) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ access_granted: status })
        .eq('id', userId);

      if (error) throw error;

      return true; // Success
    } catch (error) {
      console.error('Error updating access status:', error.message);
      throw error;
    }
  };

  // Update facility_enum
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

  // Delete user (ban user by removing them from the database)
  const deleteUser = async (userId) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) throw new Error('Failed to delete user');
      
      
    } catch (err) {
      console.error('Error deleting user:', err.message);
      throw err;
    }
  };

  // Fetch users by facility
  const fetchUsersByFacility = async (facilityId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'USER')
        .eq('facility_id', facilityId)
        .eq('access_granted', 'YES');

      if (error) throw new Error('Failed to fetch users');

      return data.sort((a, b) => a.name.localeCompare(b.name));
    } catch (err) {
      console.error('Error fetching users by facility:', err.message);
      throw err;
    }
  };

  // Fetch the current mentor's facility
  const fetchMentorFacility = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) throw new Error('Failed to fetch user information');

      const mentorId = user.id;
      const { data: mentorData, error: mentorError } = await supabase
        .from('users')
        .select('facility_id')
        .eq('id', mentorId)
        .single();

      if (mentorError) throw new Error('Failed to fetch mentor facility');
      return mentorData.facility_id;
    } catch (err) {
      console.error('Error fetching mentor facility:', err.message);
      throw err;
    }
  };

  // Function for email/password sign-up
  const signUpWithEmail = async (email, password, isMentor, selectedFacility) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error(`Sign-up failed: ${error.message}`);

      const newUser = data.user;
      const role = isMentor ? 'STAFF_MEMBER' : 'USER';

      const { data: facilityData, error: facilityError } = await supabase
        .from('facility_enum')
        .select('id')
        .eq('name', selectedFacility);

      if (facilityError) throw new Error(`Failed to fetch facility ID: ${facilityError.message}`);
      const facilityId = facilityData[0]?.id;

      console.log(facilityId);

      const { error: userError } = await supabase.from('users').upsert({
        id: newUser.id,
        email,
        role,
        facility_id: facilityId,
      });

      if (userError) throw new Error(`Failed to insert user into the database: ${userError.message}`);

      setUser(newUser);
      setRole(role);
      setError(null);
    } catch (err) {
      console.error('Error signing up:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
    } catch (err) {
      console.error('Error logging out:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCurrentUserAccount = async () => {
    try {
      
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Unable to fetch user.');
      }

      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (deleteError) {
        throw new Error('Failed to delete user data.');
      }
  
      return true; // Deletion successful
    } catch (err) {
      console.error('Error deleting account:', err.message);
      throw err;
    }
  };

  // Function to log out and navigate
  const logoutAndNavigate = async (navigate) => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error during logout and navigation:', err.message);
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
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('id',sessionUser.id);
      
        if (userError) {
      
          console.error("Error fetching user data:", userError.message);
          throw new Error("Failed to verify account.");
        }
    
        console.log("Userdata: ", userData);
    
        if (!userData || userData.length === 0) {
          logoutAndNavigate();
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

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user, role, loading, error,
      loginWithEmail, signUpWithEmail, logout,
      updateFacilityEnum, fetchUsersForMentor,
      fetchProfilePictureUrl, updateAccessStatus,
      deleteUser, fetchUsersByFacility, fetchMentorFacility,
      fetchUserRole, deleteCurrentUserAccount, logoutAndNavigate
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
