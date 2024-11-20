import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient.js';
import { useNavigate } from 'react-router-dom';

const AccessRequests = ({mentorEmail}) => {
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
  useEffect(() => {
    const fetchUsers = async () => {

      try {
        const { data: mentorData, error: mentorError } = await supabase
          .from('users')
          .select('facility')
          .eq('email', mentorEmail) // Replace with the actual mentor's email or identifier
          .eq('access_granted', 'NO')
          .single();

        if (mentorError) {
          setError(mentorError.message);
          return;
        }

        const mentorFacility = mentorData.facility;
        console.log('mentorFacility: ', mentorFacility);
        
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
  }, [mentorEmail]); // Add any necessary dependencies here, e.g., mentorFacility


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
  <div className="flex items-center justify-center min-h-screen bg-[#fff1f2]">
    <div
      className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg border-4 border-[#fda4af]"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Toegangsverzoeken
      </h2>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!selectedUser && (
        <>
          <input
            type="text"
            placeholder="Zoek op naam of email"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <ul className="space-y-2">
            {currentUsers.map((user) => (
              <li
                key={user.id}
                className="p-4 bg-gray-50 border border-gray-300 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{user.name || 'Geen naam'}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                <button
                  className="px-4 py-2 bg-[#f43f5e] text-white rounded hover:bg-[#be123c]"
                  onClick={() => setSelectedUser(user)}
                >
                  Zie Details
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-300'
                  : 'bg-[#f43f5e] text-white hover:bg-[#be123c]'
              }`}
            >
              Vorige
            </button>
            <span className="text-sm text-gray-600">
              Pagina {currentPage} van {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300'
                  : 'bg-[#f43f5e] text-white hover:bg-[#be123c]'
              }`}
            >
              Volgende
            </button>
          </div>
        </>
      )}

      {selectedUser && (
        <div className="bg-white p-6 border border-gray-300 rounded mt-4">
          <h3 className="text-xl font-semibold mb-4">Gebruiker Details</h3>
          <p><strong>Naam:</strong> {selectedUser.name || 'Geen naam'}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Telefoon:</strong> {selectedUser.phone || 'Niet beschikbaar'}</p>
          <p><strong>Faciliteit:</strong> {selectedUser.facility || 'Niet beschikbaar'}</p>
          {selectedUser.profilepictureBASE64 && (
            <img
              src={`data:image/jpeg;base64,${selectedUser.profilepictureBASE64}`}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full"
            />
          )}
          <button
            onClick={() => setSelectedUser(null)}
            className="mt-4 px-4 py-2 bg-[#f43f5e] text-white rounded hover:bg-[#be123c]"
          >
            Terug naar Toegangsverzoeken
          </button>
        </div>
      )}

      <button
        onClick={() => navigate('/settingsMentor')}
        className="mt-4 px-4 py-2 bg-[#f43f5e] text-white rounded-lg hover:bg-[#be123c]"
      >
        Terug naar Instellingen
      </button>
    </div>
  </div>
)};
  

export default AccessRequests;
