import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/AuthContext';

const MentorBanUser = () => {
  const { deleteUser, fetchUsersByFacility, fetchMentorFacility, error } = useAuth();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userIdToBan, setUserIdToBan] = useState(null);
  const [mentorFacility, setMentorFacility] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState(null);
  const usersPerPage = 10;

  // Fetch mentor's facility ID
  useEffect(() => {
    const getFacility = async () => {
      try {
        const facilityId = await fetchMentorFacility();
        setMentorFacility(facilityId);
      } catch (err) {
        console.error(err.message);
      }
    };

    getFacility();
  }, [fetchMentorFacility]);

  // Fetch users for the facility
  useEffect(() => {
    if (!mentorFacility) return;

    const fetchUsers = async () => {
      try {
        const data = await fetchUsersByFacility(mentorFacility);
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchUsers();
  }, [mentorFacility, fetchUsersByFacility]);

  // Handle banning a user
  const handleBanUser = async (userId) => {
    try {
      await deleteUser(userId);
      const updatedUsers = await fetchUsersByFacility(mentorFacility);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setShowConfirmation(false);
      displaySuccessMessage('User has been successfully banned.');
    } catch (err) {
      console.error(err.message);
    }
  };

  // Display success message
  const displaySuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  // Filter users based on search query
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);

    if (query === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          (user.username && user.username.toLowerCase().includes(query)) ||
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query))
      );
      setFilteredUsers(filtered);
    }
  };

  // Pagination logic
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
    <div className="flex items-center justify-center min-h-screen bg-rose-50">
      <div
        className="flex flex-col gap-4 p-6 rounded-xl shadow-lg w-80"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          height: '90vh',
          maxHeight: '1000px',
        }}
      >
        {error && <div className="p-2 text-sm text-red-600 bg-red-100 rounded">{error}</div>}

        {successMessage && (
          <div className="p-2 text-sm text-green-600 bg-green-100 rounded mb-4">
            {successMessage}
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ban Gebruikers</h2>
        <p className="text-sm text-gray-600 mb-4">Je kan enkel mensen bannen van je eigen faciliteit.</p>

        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 mb-4 border border-gray-300 rounded-lg w-full"
        />

        <div className="space-y-2 overflow-y-auto flex-grow">
          {currentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-2 border-b border-gray-300">
              <div className="flex flex-col">
                <span>{user.name || user.username}</span>
                <span className="text-sm text-gray-500">
                  <button
                    className="text-[#f43f5e] hover:underline"
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

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-[#f43f5e] text-white'}`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-[#f43f5e] text-white'}`}
          >
            Next
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Ban</h2>
            <p className="mt-2 text-sm text-gray-600">
              Weet je zeker dat je deze gebruiker wilt verbannen? Deze actie kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 text-gray-800 rounded-lg"
                style={{ backgroundColor: '#FFFFFF', border: '2px solid #fda4af' }}
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white rounded-lg"
                style={{ backgroundColor: '#f43f5e' }}
                onClick={() => handleBanUser(userIdToBan)}
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorBanUser;
