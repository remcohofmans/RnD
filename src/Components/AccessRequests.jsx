import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';


const AccessRequests = () => {
  const { user, fetchUsersForMentor, fetchProfilePictureUrl, updateAccessStatus } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 10;


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchUsersForMentor(user.id);
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsersForMentor]);

  //search bar
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

  const handleViewDetails = async (userId) => {
    const selected = users.find(user => user.id === userId);
    if (selected) {
      const profilePictureUrl = await fetchProfilePictureUrl(userId);
      setSelectedUser({ ...selected, profilePictureUrl });
    }
  };

  const handleGoBack = () => {
    setSelectedUser(null);
  };

  const handleAccessChange = async (userId, status) => {
    try {
      await updateAccessStatus(userId, status);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== userId));
      setSelectedUser(null);
    } catch {
      setError('Failed to update access status');
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg flex flex-col min-h-[70vh]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Toegangsverzoeken</h2>

        {loading && <p>Laden ...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!selectedUser && (
          <input
            type="text"
            placeholder="Zoek op naam of email"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
        )}

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
              <p><strong>Geboortedatum:</strong> {selectedUser.birthday || 'Niet beschikbaar'}</p>
              {selectedUser.profilePictureUrl && (
                <img
                  src={selectedUser.profilePictureUrl}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full"
                />
              )}
              <div className="mt-4">
                <button
                  onClick={() => handleAccessChange(selectedUser.id, 'YES')}
                  className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                >
                  Goedkeuren
                </button>
                <button
                  onClick={() => handleAccessChange(selectedUser.id, 'NO')}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Afwijzen
                </button>
              </div>
              <button
                onClick={handleGoBack}
                className="mt-4 text-gray-500 underline"
              >
                Terug
              </button>
            </div>
          )}
        </div>

        {!selectedUser && (
          <div className="flex justify-between">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Vorige
            </button>
            <p>Pagina {currentPage} van {totalPages}</p>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
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
