import React, { useState, useEffect } from 'react';
import { ChatsList } from './ChatsList/ChatsList.jsx';
import { ChatWindow } from './ChatWindow/ChatWindow.jsx';
import { useMatches } from '../../hooks/useMatches.jsx';
import ChatsPageSkeleton from './ChatPageSkeleton.jsx';
import useCheckUserProfile from '../../hooks/useCheckUserProfile.jsx';
import UserCardChats from './ChatWindow/UserCardChats.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { useMobileView } from '../../hooks/ViewSelector.js'
import { ChevronLeft, Users, MessageCircle, UserCircle2 } from 'lucide-react';

const ChatsPage = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [mobileView, setMobileView] = useState('matches');
  const { user: currentUser, loading: authLoading, error: authError } = useAuth();
  const { checkUserProfile } = useCheckUserProfile(currentUser);
  const { matches, loading: matchesLoading, error: matchesError } = useMatches(currentUser?.id);
  const { checkSubscription } = useAuth();
  const navigate = useNavigate();
  // Detect if it's a mobile view
  const isMobile = useMobileView();

  useEffect(() => {
    checkUserProfile();
    checkSubscription(navigate);
  }, [checkUserProfile]);

  // Reset mobile view when a match is selected
  useEffect(() => {
    if (selectedMatch) {
      setMobileView('chat');
    }
  }, [selectedMatch]);

  if (authLoading || matchesLoading) return <ChatsPageSkeleton />;
  if (authError || matchesError) return <div className="text-red-500 text-center p-4">{authError || matchesError}</div>;

  const selectedMatchDetails = matches.find(m => m.match_id === selectedMatch);

  // Mobile Navigation Component
  const MobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-50">
      <div className="grid grid-cols-3 text-center">
        <button
          onClick={() => setMobileView('matches')}
          className={`p-4 flex flex-col items-center ${mobileView === 'matches' ? 'text-rose-600' : 'text-gray-500'}`}
        >
          <Users size={24} />
          <span className="text-xs mt-1">Matches</span>
        </button>
        <button
          onClick={() => {
            if (selectedMatchDetails) {
              setMobileView('chat');
            }
          }}
          className={`p-4 flex flex-col items-center ${mobileView === 'chat' ? 'text-rose-600' : 'text-gray-500'} 
            ${!selectedMatchDetails ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <MessageCircle size={24} />
          <span className="text-xs mt-1">Chat</span>
        </button>
        <button
          onClick={() => {
            if (selectedMatchDetails) {
              setMobileView('profile');
            }
          }}
          className={`p-4 flex flex-col items-center ${mobileView === 'profile' ? 'text-blue-600' : 'text-gray-500'}
            ${!selectedMatchDetails ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <UserCircle2 size={24} />
          <span className="text-xs mt-1">Profiel</span>
        </button>
      </div>
    </div>
  );

  // Render based on mobile view
  const renderMobileContent = () => {
    switch (mobileView) {
      case 'matches':
        return (
          <div className="md:hidden">
            {matches.length === 0 ? (
              <p className="text-center text-gray-500 bg-white p-4 rounded-lg shadow">
                Je hebt nog geen matches.
              </p>
            ) : (
              <ChatsList
                matches={matches}
                onSelectMatch={(matchId) => {
                  setSelectedMatch(matchId);
                  setMobileView('chat');
                }}
                selectedMatchId={selectedMatch}
                isMobile={true}
              />
            )}
          </div>
        );
      case 'chat':
        return (
          <div className="md:hidden relative">
            {selectedMatchDetails ? (
              <>
                <ChatWindow
                  matchId={selectedMatchDetails.match_id}
                  otherUserName={selectedMatchDetails.otherUserName}
                  isMobile={true}
                />
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                Selecteer een match om het gesprek te openen.
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="md:hidden relative">
            {selectedMatchDetails ? (
              <>
                <UserCardChats user={selectedMatchDetails.otherUserId} isMobile={true} />
              </>
            ) : null}
          </div>
        );
      default:
        return null;
    }
  };

  return (
<div className="bg-gray-100 min-h-screen mt-16 max-md:mt-0 px-8 md:px-6 flex flex-col">
  {/* Desktop Layout */}
  <div className="container mx-auto py-8 max-md:py-0 hidden md:flex flex-grow">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-grow">
      <div className="md:col-span-3 overflow-auto">
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
      <div className="md:col-span-6 flex-grow flex flex-col overflow-hidden">
        {selectedMatchDetails ? (
          <ChatWindow
            matchId={selectedMatchDetails.match_id}
            otherUserName={selectedMatchDetails.otherUserName}
          />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500 flex-grow flex items-center justify-center">
            Selecteer een match om het gesprek te openen.
          </div>
        )}
      </div>
      <div className="md:col-span-3 overflow-auto">
        {selectedMatchDetails && (
          <UserCardChats user={selectedMatchDetails.otherUserId} />
        )}
      </div>
    </div>
  </div>

  {/* Mobile Layout */}
  {isMobile && (
    <div className="md:hidden mt-12 md:mt-16 py-8 flex-grow mobile-content">
      {renderMobileContent()}
    </div>
  )}

  {/* Mobile Navigation */}
  <MobileNavigation />
</div>

  );
};

export default ChatsPage;