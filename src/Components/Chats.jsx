import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

const ChatsList = ({ matches, onSelectMatch, selectedMatchId }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
    <h2 className="text-xl font-semibold p-4 bg-gray-100">Your Matches</h2>
    <ul className="divide-y divide-gray-200">
      {matches.map((match) => (
        <li 
          key={match.match_id}
          className={`cursor-pointer hover:bg-gray-50 transition-colors duration-150 ease-in-out ${selectedMatchId === match.match_id ? 'bg-blue-50' : ''}`}
          onClick={() => onSelectMatch(match.match_id)}
        >
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">{match.otherUserEmail}</h3>
            <p className="text-sm text-gray-500">Match ID: {match.match_id}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const ChatWindow = ({ matchId, otherUserEmail }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchMessages();
    
    const channel = supabase
      .channel(`match_${matchId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chats', filter: `match_id=eq.${matchId}` }, 
        handleNewMessage
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching current user:', error);
      setError('Failed to fetch user data');
    } else {
      setCurrentUser(user);
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } else {
      setMessages(data);
    }
  };

  const handleNewMessage = (payload) => {
    console.log("New message received:", payload);
    setMessages(prevMessages => {
      // Check if the message is already in the list
      const messageExists = prevMessages.some(msg => msg.id === payload.new.id);
      if (!messageExists) {
        return [...prevMessages, payload.new];
      }
      return prevMessages;
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({ 
          match_id: matchId, 
          sender_id: currentUser.id, 
          message: newMessage 
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Message sent successfully:", data);
      setNewMessage('');
      setMessages(prevMessages => [...prevMessages, data]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg flex flex-col h-full">
      <div className="bg-gray-100 px-4 py-3 border-b">
        <h3 className="text-xl font-semibold text-gray-800">Chat with {otherUserEmail}</h3>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender_id === currentUser?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="bg-gray-100 px-4 py-3 border-t">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

const ChatsPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .or(`id.eq.${user.id},matched_user_id.eq.${user.id}`);

      if (matchesError) throw matchesError;

      const userIds = new Set(matchesData.flatMap(match => [match.id, match.matched_user_id]));
      userIds.delete(user.id);

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .in('id', Array.from(userIds));

      if (usersError) throw usersError;

      const userMap = Object.fromEntries(usersData.map(user => [user.id, user]));

      const processedMatches = matchesData.map(match => {
        const otherUserId = match.id === user.id ? match.matched_user_id : match.id;
        const otherUser = userMap[otherUserId];
        return {
          match_id: match.match_id,
          otherUserId: otherUserId,
          otherUserEmail: otherUser ? otherUser.email : 'Unknown'
        };
      });

      setMatches(processedMatches);
    } catch (error) {
      console.error('Error in fetchMatches:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>;
  
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Chats</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            {matches.length === 0 ? (
              <p className="text-center text-gray-500 bg-white p-4 rounded-lg shadow">You don't have any matches yet.</p>
            ) : (
              <ChatsList 
                matches={matches} 
                onSelectMatch={setSelectedMatch} 
                selectedMatchId={selectedMatch}
              />
            )}
          </div>
          <div className="md:col-span-2">
            {selectedMatch ? (
              <ChatWindow 
                matchId={selectedMatch} 
                otherUserEmail={matches.find(m => m.match_id === selectedMatch).otherUserEmail}
              />
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                Select a match to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;