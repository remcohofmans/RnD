import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import AnimatedDots from '../common/AnimatedDots';


const SubscriptionRequests = () => {
  const { user, fetchSubscriptionRequests, updateSubscription, fetchMentorFacility } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mentorFacility, setMentorFacility] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [SubscriptionRequests, setSubscriptionRequests] = useState([]); 
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const mentorFacility = await fetchMentorFacility();
        setMentorFacility(mentorFacility);
        console.log('Calling fetchSubscriptionRequests...');
        const fetchedUsers = await fetchSubscriptionRequests(mentorFacility); 
        console.log("fetchedUsers: ",fetchedUsers);
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (err) {
        setError('Problem');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user, fetchSubscriptionRequests]);

  const checkoutBasis = (payAnnually) => {

    payAnnually ? window.location.href ="https://vlindersaas-test.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Basis-EUR-Yearly&subscription_items[quantity][0]=1&layout=in_app" :
    window.location.href = "https://vlindersaas-test.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Basis-EUR-Monthly&subscription_items[quantity][0]=1&layout=in_app";

};

const checkoutGevorderd = (payAnnually) => {

    payAnnually ? window.location.href ="https://vlindersaas-test.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Gevorderd-EUR-Yearly&subscription_items[quantity][0]=1&layout=in_app" :
    window.location.href = "https://vlindersaas-test.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Gevorderd-EUR-Monthly&subscription_items[quantity][0]=1&layout=in_app";

};

const checkoutElite = (payAnnually) => {

    payAnnually ? window.location.href ="https://vlindersaas-test.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Elite-EUR-Yearly&subscription_items[quantity][0]=1&layout=in_app" :
    window.location.href = "https://vlindersaas-test.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Elite-EUR-Monthly&subscription_items[quantity][0]=1&layout=in_app";

};

const goToCheckout = async (selectedSubscription,payAnnually) => {
    if (selectedSubscription === 'BASIS') {
        checkoutBasis(payAnnually);
    } 
    if (selectedSubscription === 'GEVORDERD') {
        checkoutGevorderd(payAnnually);
    }
    if (selectedSubscription ==='ELITE') {
        checkoutElite(payAnnually);
    }
}


  const handleViewDetails = async (userId) => {
    try {
      setLoading(true);
      console.log(userId);
      const selected = users.find((user) => user.user_id === userId);
      if (selected) {
        setSelectedUser({ ...selected });
        
        // Ensure subscriptionRequests is set correctly; default to empty array if not present
        setSubscriptionRequests(selected.subscriptionRequests || []);
      }
    } catch (err) {
      setError('Failed to fetch subscription details');
    } finally {
      setLoading(false);
    }
  };

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

  const handleGoBack = () => {
    setSelectedUser(null);
    setSubscriptionRequests([]);
  };

  const handleSubscriptionChange = async (userId, sub,pay,accept) => {
    try {

      const isAnnual = pay;
      console.log("Setting payAnnually to:", isAnnual);
      console.log("Setting pay to:", pay);

      if(accept === 'YES') await goToCheckout(sub,isAnnual);
      await updateSubscription(userId, sub,pay);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== userId));
      setSelectedUser(null);


      const fetchedUsers = await fetchSubscriptionRequests(); // Assuming this returns a list of users with their subscriptions
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);

    } catch {
      setError('Failed to update subscription');
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
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Abonnement verzoeken</h2>

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

        {loading && <AnimatedDots />}

        <div className="overflow-y-auto max-h-[50vh] mb-4">
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
                    onClick={() => handleViewDetails(user.user_id)}
                  >
                    Zie Details
                  </button>
                </li>
              ))}
            </ul>
          )}

          {selectedUser && (
            <div className="bg-white p-6 border border-gray-300 rounded">
              <h3 className="text-xl font-semibold mb-4">Gebruiker Details</h3>
              <p><strong>Naam:</strong> {selectedUser.name || 'Geen naam'}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Huidig abonnement:</strong> {selectedUser.subscription}</p>
              <p><strong>Gevraagd abonnement:</strong> {selectedUser.subscription_request}</p>

              <div className="mt-4">
                <button
                  onClick={() => handleSubscriptionChange(selectedUser.user_id, selectedUser.subscription_request,selectedUser.annual_payment_request,'YES')}
                  className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                >
                  Goedkeuren
                </button>
                <button
                  onClick={() => handleSubscriptionChange(selectedUser.user_id, selectedUser.subscription,selectedUser.annual_payment,'NO')}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Afwijzen
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedUser && (
          <button
            onClick={handleGoBack}
            className="mt-4 text-gray-500 underline self-start"
          >
            Terug
          </button>
        )}

        {!selectedUser && (
          <div className="flex justify-between mt-4">
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

export default SubscriptionRequests;
