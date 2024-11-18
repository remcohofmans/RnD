import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient.js';
import { useNavigate } from 'react-router-dom';

const AccessRequests = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user's details
  const usersPerPage = 10;
  const navigate = useNavigate();

  // Fetch all users from the database
  useEffect((email) => {
    const fetchUsers = async () => {

      try {
        /*
        const { data: mentorData, error: mentorError } = await supabase
          .from('users')
          .select('facility')
          .eq('email', email) // Replace with the actual mentor's email or identifier
          .single();

        if (mentorError) {
          setError(mentorError.message);
          return;
        }

        const mentorFacility = mentorData.facility;
        console.log('mentorFacility: ', mentorFacility);
        */
        // Assuming mentorFacility is available
        
        // Query to fetch only users with role 'USER' and matching facility
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'USER') // Filter by role 'USER'
          //.eq('facility', mentorFacility); // Filter by matching facility
  
        if (error) {
          setError(error.message);
        } else {
          setUsers(data);
          setFilteredUsers(data); // Initialize filtered users with the query result
        }
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []); // Add any necessary dependencies here, e.g., mentorFacility


  // Search users by name or email
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);

    if (query === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
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

  // Handle "View Details" click
  const handleViewDetails = (userId) => {
    const selected = users.find(user => user.id === userId);
    setSelectedUser(selected);
  };

  // Handle Go Back to User List
  const handleGoBack = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fff1f2' }}>
      <div
        className="bg-white shadow-lg rounded-lg p-6 w-3/4"
        style={{
          border: '4px solid #fda4af', // Pink border to match the theme
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Soft shadow for the card
        }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Access Requests</h2>

        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        {/* If a user is selected, show the detailed information */}
        {selectedUser ? (
          <div className="bg-white p-6 border border-gray-300 rounded mt-4">
            <h3 className="text-xl font-semibold mb-4">User Details</h3>
            <p><strong>Name:</strong> {selectedUser.name || 'No Name'}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone || 'Not provided'}</p>
            <p><strong>Address:</strong> {selectedUser.address || 'Not provided'}</p>
            <p><strong>Status:</strong> {selectedUser.status || 'Unknown'}</p>
            {/* Add any other details you want to display */}
            <button
              onClick={handleGoBack}
              className="mt-4 px-4 py-2 bg-[#f43f5e] text-white rounded-lg hover:bg-[#be123c]"
            >
              Back to User List
            </button>
          </div>
        ) : (
          <>
            {/* User List */}
            <ul className="space-y-2">
              {currentUsers.map((user) => (
                <li
                  key={user.id}
                  className="p-4 bg-gray-50 border border-gray-300 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{user.name || 'No Name'}</p>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  <button
                    className="px-4 py-2 bg-[#f43f5e] text-white rounded hover:bg-[#be123c]"
                    onClick={() => handleViewDetails(user.id)} // Open details for the clicked user
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 ? 'bg-gray-300' : 'bg-[#f43f5e] text-white'
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages ? 'bg-gray-300' : 'bg-[#f43f5e] text-white'
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Go Back Button */}
        <button
          onClick={() => navigate('/settingsMentor')}
          className="mt-4 px-4 py-2 bg-[#f43f5e] text-white rounded-lg hover:bg-[#be123c]"
        >
          Back to Settings
        </button>
      </div>
    </div>
  );
};

export default AccessRequests;
