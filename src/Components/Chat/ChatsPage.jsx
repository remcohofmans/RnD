import React, { useState, useEffect } from 'react';
import { ChatsList } from './ChatsList/ChatsList.jsx';
import { ChatWindow } from './ChatWindow/ChatWindow.jsx';
import { useMatches } from '../../hooks/useMatches.jsx';
import ChatsPageSkeleton from './ChatPageSkeleton.jsx';
import useCheckUserProfile from '../../hooks/useCheckUserProfile.jsx';
import UserCardChats from './ChatWindow/UserCardChats.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';

const ChatsPage = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { user: currentUser, loading: authLoading, error: authError } = useAuth();
  const { checkUserProfile } = useCheckUserProfile(currentUser);
  const { matches, loading: matchesLoading, error: matchesError } = useMatches(currentUser?.id);
  const { checkSubscription } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkUserProfile();
    checkSubscription(navigate);
  }, [checkUserProfile]);

  //if (authLoading || matchesLoading) return <LoadingSpinner />;
  if (authLoading || matchesLoading) return <ChatsPageSkeleton />;
  if (authError || matchesError) return <div className="text-red-500 text-center p-4">{authError || matchesError}</div>;

  // Find the selected match object
  const selectedMatchDetails = matches.find(m => m.match_id === selectedMatch);

  return (
    <div className="bg-gray-100 min-h-screen mt-16 max-md:mt-12 px-8 md:px-6">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Chats List */}
          <div className="md:col-span-3">
            {matches.length === 0 ? (
              <p className="text-center text-gray-500 bg-white p-4 rounded-lg shadow">
                Je hebt nog geen matches.
              </p>
            ) : (
              <ChatsList
                matches={matches}
                onSelectMatch={setSelectedMatch}
                selectedMatchId={selectedMatch}
              />
            )}
          </div>

          {/* Middle Column: Chat Window */}
          <div className="md:col-span-6">
            {selectedMatchDetails ? (
              <ChatWindow
                matchId={selectedMatchDetails.match_id}
                otherUserName={selectedMatchDetails.otherUserName}
              />
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                Selecteer een match om het gesprek te openen.
              </div>
            )}
          </div>

          {/* Right Column: User Card Chats */}
          <div className="md:col-span-3">
            <div>
              {selectedMatchDetails ? (
                <UserCardChats user={selectedMatchDetails.otherUserId} />
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
