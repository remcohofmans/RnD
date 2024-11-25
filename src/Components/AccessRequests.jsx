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

  

  // Fetch users function
  const fetchUsers = async () => {
    try {

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log(user);


      const mentorId = user.id;
      console.log(mentorId);

      const { data: mentorData, error: mentorError } = await supabase
        .from('users')
        .select('facility_id')
        .eq('id', mentorId)
        .single();
      
      const mentorFacility = mentorData.facility_id
      console.log(mentorData.facility_id);
      

      
      

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'USER')
        .eq('access_granted', 'PENDING')
        .eq('facility_id',mentorFacility)
        .not('birthday', 'is', null)
        .not('name', 'is',null );

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

  useEffect(() => {
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

  const fetchProfilePicture = async (userId) => {
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

  const handleViewDetails = async (userId) => {
    const selected = users.find(user => user.id === userId);
    if (selected) {
      const profilePictureUrl = await fetchProfilePicture(userId);
      setSelectedUser({ ...selected, profilePictureUrl });
    }
  };

  const handleGoBack = () => {
    setSelectedUser(null);
  };

  // Update access_granted in Supabase
  const handleAccessChange = async (userId, status) => {
    // Update access_granted in Supabase
    const { error } = await supabase
      .from('users')
      .update({ access_granted: status })
      .eq('id', userId);

    if (error) {
      setError('Failed to update access status');
    } else {
      // Optionally, remove the user from the current list after the change
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setFilteredUsers((prevFilteredUsers) => prevFilteredUsers.filter((user) => user.id !== userId));

      // Refetch users to get the updated list
      await fetchUsers();
      setSelectedUser(null); // Optionally close details view after the change
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-100">
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
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                >
                  Toestaan
                </button>
                <button
                  onClick={() => handleAccessChange(selectedUser.id, 'NO')}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Weigeren
                </button>
              </div>
              <button
                onClick={handleGoBack}
                className="mt-4 px-4 py-2 bg-[#f43f5e] text-white rounded hover:bg-[#be123c]"
              >
                Terug naar Toegangsverzoeken
              </button>
            </div>
          )}
        </div>

        {!selectedUser && (
          <div className="flex justify-between items-center mt-auto">
            <button
              disabled={currentPage === 1}
              onClick={goToPreviousPage}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-[#f43f5e] text-white hover:bg-[#be123c]'}`}
            >
              Vorige
            </button>
            <span className="text-sm text-gray-600">
              Pagina {currentPage} van {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={goToNextPage}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-[#f43f5e] text-white hover:bg-[#be123c]'}`}
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