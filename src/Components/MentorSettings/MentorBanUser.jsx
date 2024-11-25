import React, { useState, useEffect } from 'react'; 
import { supabase } from '../../lib/helper/supabaseClient.js';
import { useNavigate } from 'react-router-dom';
import TopNavigationBar from '../common/TopNavigationBar.jsx';

const MentorBanUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userIdToBan, setUserIdToBan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const [successMessage, setSuccessMessage] = useState(null); // State for success message
  const usersPerPage = 10; // Users per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role','USER')
          .eq('access_granted','YES');
        if (error) {
          setError(error.message);
        } else {
          const sortedUsers = data.sort((a, b) => a.name.localeCompare(b.name));
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
    console.log('User ID to ban:', userId); // Add this log to confirm the userId

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new Error('Failed to ban user');
      }

      const { data } = await supabase
          .from('users')
          .select('*')
          .eq('role','USER')
          .eq('access_granted','YES');
      setUsers(data);
      setFilteredUsers(data); // Update the filtered list
      setShowConfirmation(false);

      // Set success message
      setSuccessMessage('User has been successfully banned.');

      // Remove the success message after 2 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000); // 2000ms = 2 seconds
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isMatchInSequence = (text, query) => {
    if (!text || !query) return false;
    return text.toLowerCase().startsWith(query.toLowerCase());
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1); // Reset to the first page on search

    if (query === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          (user.username && isMatchInSequence(user.username, query)) ||
          (user.name && isMatchInSequence(user.name, query)) || // Added name search
          (user.email && isMatchInSequence(user.email, query)) // Added email search
      );
      setFilteredUsers(filtered);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-100">
      <div
        className="flex flex-col gap-4 p-6 rounded-xl shadow-lg w-80"
        style={{
          backgroundColor: '#FFFFFF', 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          height: '90vh', // Limit the height to 90% of the viewport height
          maxHeight: '1000px', // Max height limit for bigger screens
        }}
      >
        {loading && <div>Laden...</div>}
        {error && <div className="p-2 text-sm text-red-600 bg-red-100 rounded">{error}</div>}

        {/* Success Message */}
        {successMessage && (
          <div className="p-2 text-sm text-green-600 bg-green-100 rounded mb-4">
            {successMessage}
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ban gebruikers</h2>
        <p className="text-sm text-gray-600 mb-4">
          Je kan enkel mensen bannen van jouw eigen faciliteit.
        </p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Zoek op naam of email"
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 mb-4 border border-gray-300 rounded-lg w-full"
        />

        {/* User List */}
        <div className="space-y-2 overflow-y-auto flex-grow">
          {currentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-2 border-b border-gray-300">
              <div className="flex flex-col">
                <span>{user.name || user.username}</span> {/* Display name or username */}
                <span className="text-sm text-gray-500">
                  <button
                    className="text-[#f43f5e] hover:underline" // Ensures the email button is pink
                    onClick={() => {
                      setUserIdToBan(user.id);
                      setShowConfirmation(true);
                    }}
                  >
                    {user.email}
                  </button>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-[#f43f5e] text-white'}`}
          >
            Vorige
          </button>
          <span className="text-sm text-gray-600">
            Pagina {currentPage} van {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-[#f43f5e] text-white'}`}
          >
            Volgende
          </button>
        </div>

       
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="p-6 bg-white rounded-lg shadow-lg w-80"
            style={{
              border: '4px solid #fda4af', // Same pink border for the confirmation modal
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 className="text-lg font-semibold text-gray-800">Bevestig Ban</h2>
            <p className="mt-2 text-sm text-gray-600">
            Bent u zeker dat u dit account wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden.
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 text-gray-800 rounded-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #fda4af',
                }}
                onClick={() => setShowConfirmation(false)}
              >
                Annuleer
              </button>
              <button
                className="px-4 py-2 text-white rounded-lg"
                style={{ backgroundColor: '#f43f5e' }}
                onClick={() => handleBanUser(userIdToBan)}
              >
                Bevestig Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorBanUser;
