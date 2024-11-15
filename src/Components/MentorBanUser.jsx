import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient.js';
import { useNavigate } from 'react-router-dom';
import TopNavigationBar from './TopNavigationBar.jsx';

const MentorBanUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userIdToBan, setUserIdToBan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
          setError(error.message);
        } else {
          // Sort users by email alphabetically
          const sortedUsers = data.sort((a, b) => a.email.localeCompare(b.email));
          setUsers(sortedUsers);
          setFilteredUsers(sortedUsers); // Initialize filtered users with all users
        }
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBanUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ banned: true })
        .eq('id', userId);

      if (error) {
        throw new Error('Failed to ban user');
      }

      // Refresh the user list after banning
      const { data } = await supabase.from('users').select('*');
      setUsers(data);
      setFilteredUsers(data); // Update the filtered list

      // Close the confirmation modal
      setShowConfirmation(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to check if the search query is in sequence within the text
  const isMatchInSequence = (text, query) => {
    let i = 0;
    // Loop through the text and try to find each character of the query in sequence
    for (let j = 0; j < text.length; j++) {
      if (text[j].toLowerCase() === query[i].toLowerCase()) {
        i++;
        if (i === query.length) return true; // If all characters matched, return true
      }
    }
    return false; // If we don't find the entire query in sequence, return false
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setFilteredUsers(users);
    } else {
      // Filter users by checking if their username or email matches the query in sequence
      const filtered = users.filter(
        (user) =>
          (user.username && isMatchInSequence(user.username, query)) ||
          (user.email && isMatchInSequence(user.email, query))
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <div>
      <TopNavigationBar />

      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
        <div
          className="flex flex-col gap-4 p-6 rounded-xl shadow-lg w-80"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #f1f5f8',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          {loading && <div>Loading...</div>}
          {error && <div className="p-2 text-sm text-red-600 bg-red-100 rounded">{error}</div>}

          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ban gebruikers</h2>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-2 mb-4 border border-gray-300 rounded-lg w-full"
          />

          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 border-b border-gray-300">
                <div className="flex flex-col">
                  <span>{user.username}</span>
                  <span className="text-sm text-gray-500">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setUserIdToBan(user.id); // Set the user ID to ban
                        setShowConfirmation(true); // Show the confirmation modal
                      }}
                    >
                      {user.email}
                    </button>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="p-6 bg-white rounded-lg shadow-lg w-80"
            style={{
              border: '4px solid #fda4af',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 className="text-lg font-semibold text-gray-800">Confirm Ban</h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to ban this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 text-gray-800 rounded-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #fda4af',
                }}
                onClick={() => setShowConfirmation(false)} // Close modal without banning
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white rounded-lg"
                style={{ backgroundColor: '#f43f5e' }}
                onClick={() => handleBanUser(userIdToBan)} // Confirm banning the user
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorBanUser;
