import React, { useState } from 'react';
import { ChatsList } from '../Components/Chat/ChatsList/ChatsList.jsx';
import { ChatWindow } from '../Components/Chat/ChatWindow/ChatWindow.jsx';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth.js';
import { useMatches } from '../hooks/useMatches.jsx';
import { LoadingSpinner } from '../Components/common/LoadingSpinner.jsx';

const ChatsPage = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { currentUser, loading: authLoading, error: authError } = useSupabaseAuth();
  const { matches, loading: matchesLoading, error: matchesError } = useMatches(currentUser?.id);

  if (authLoading || matchesLoading) return <LoadingSpinner />;
  if (authError || matchesError) return <div className="text-red-500 text-center p-4">{authError || matchesError}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Chats</h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* ChatsList - Positioned to the left */}
          <div className="md:col-span-3">
            {matches.length === 0 ? (
              <p className="text-center text-gray-500 bg-white p-4 rounded-lg shadow">
                You don't have any matches yet.
              </p>
            ) : (
              <ChatsList 
                matches={matches} 
                onSelectMatch={setSelectedMatch} 
                selectedMatchId={selectedMatch}
              />
            )}
          </div>

          {/* ChatWindow - Centered */}
          <div className="md:col-span-6">
            {selectedMatch ? (
              <ChatWindow 
                matchId={selectedMatch} 
                otherUserName={matches.find(m => m.match_id === selectedMatch).otherUserName}
              />
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                Select a match to start chatting
              </div>
            )}
          </div>
          
          {/* Placeholder for right-alignment (optional) */}
          <div className="md:col-span-3"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
