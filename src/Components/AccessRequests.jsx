import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient.js';
import { useNavigate } from 'react-router-dom';

const AccessRequests = ({ mentorEmail }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: mentorData, error: mentorError } = await supabase
          .from('users')
          .select('facility')
          .eq('email', mentorEmail)
          .eq('access_granted', 'NO');

        if (mentorError) {
          setError(mentorError.message);
          return;
        }

        const mentorFacility = mentorData.facility;

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'USER');

        if (error) {
          setError(error.message);
        } else {
          const sortedUsers = data.sort((a, b) => {
            const nameA = a.name ? a.name.toLowerCase() : '';
            const nameB = b.name ? b.name.toLowerCase() : '';
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
          });

          setUsers(sortedUsers);
          setFilteredUsers(sortedUsers);
        }
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [mentorEmail]);

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

  const handleViewDetails = (userId) => {
    const selected = users.find(user => user.id === userId);
    setSelectedUser(selected);
  };

  const handleGoBack = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fff1f2]">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg border-4 border-[#fda4af] flex flex-col min-h-[70vh]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Toegangsverzoeken</h2>

        {loading && <p>Laden ...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Only show the search bar if no user is selected */}
        {!selectedUser && (
          <input
            type="text"
            placeholder="Zoek op naam of email"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
        )}

        {/* Scrollable container for users */}
        <div className="overflow-y-auto max-h-[55vh] mb-4">
          {!selectedUser && (
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
                    onClick={() => handleViewDetails(user.id)}
                  >
                    Zie Details
                  </button>
                </li>
              ))}
            </ul>
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
                onClick={handleGoBack}
                className="mt-4 px-4 py-2 bg-[#f43f5e] text-white rounded hover:bg-[#be123c]"
              >
                Terug naar Toegangsverzoeken
              </button>
            </div>
          )}
        </div>

        {/* Only show pagination if no user is selected */}
        {!selectedUser && (
          <div className="flex justify-between items-center mt-auto">
            <button
              disabled={currentPage === 1}
              onClick={goToPreviousPage}
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
              onClick={goToNextPage}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300'
                  : 'bg-[#f43f5e] text-white hover:bg-[#be123c]'
              }`}
            >
              Volgende
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessRequests;
