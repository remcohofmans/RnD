import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../supabaseClient';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { RefreshCw } from 'lucide-react';

export const ChatWindow = ({ matchId, otherUserName }) => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [matchedUserId, setMatchedUserId] = useState(null);
  const [error, setError] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const messagesContainerRef = useRef(null);

  const suggestedMessages = [
    "Wat doe je graag in je vrije tijd?",
    "Heb je een favoriete plek om te ontspannen?",
    "Wat was het leukste dat je deze week hebt gedaan?",
    "Heb je onlangs een goede film gezien?",
    "Wat voor muziek luister je het liefst?",
    "Heb je leuke plannen voor het weekend?",
    "Wat is je favoriete manier om een dag door te brengen?",
    "Als je één ding zou kunnen leren, wat zou dat zijn?",
    "Wat is het mooiste reisbestemming die je ooit hebt bezocht?",
    "Heb je een favoriete hobby waar je veel tijd mee doorbrengt?"
  ];

  useEffect(() => {
    fetchCurrentUser();
    fetchMatchedUser();
    fetchMessages();
    setupRealtimeSubscription();
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setShowSuggestion(messages.length === 0);
    if (showSuggestion) {
      setCurrentSuggestion(suggestedMessages[Math.floor(Math.random() * suggestedMessages.length)]);
    }
  }, [messages, showSuggestion]);

  const fetchCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching current user:', error);
      setError('Failed to fetch user data');
    } else {
      setCurrentUser(user);
    }
  };

  const fetchMatchedUser = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('id, matched_user_id')
        .eq('match_id', matchId)
        .single();

      if (error) throw error;

      if (data) {
        const { data: { user } } = await supabase.auth.getUser();
        const otherUserId = data.id === user.id ? data.matched_user_id : data.id;
        setMatchedUserId(otherUserId);
      }
    } catch (error) {
      console.error('Error fetching matched user:', error);
      setError('Failed to fetch matched user data');
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
      setShowSuggestion(data.length === 0);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`match_${matchId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chats', 
          filter: `match_id=eq.${matchId}` 
        }, 
        handleNewMessage
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      channel.unsubscribe();
    };
  };

  const handleNewMessage = (payload) => {
    console.log("New message received:", payload);
    setMessages(prevMessages => {
      const messageExists = prevMessages.some(msg => msg.id === payload.new.id);
      if (!messageExists) {
        return [...prevMessages, payload.new];
      }
      return prevMessages;
    });
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || !currentUser) return;

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({ 
          match_id: matchId, 
          sender_id: currentUser.id, 
          message: messageText 
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Message sent successfully:", data);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const handleSendSuggestion = () => {
    sendMessage(currentSuggestion);
    setShowSuggestion(false);
  };

  const handleRefreshSuggestion = () => {
    setCurrentSuggestion(suggestedMessages[Math.floor(Math.random() * suggestedMessages.length)]);
  };

  const scrollToBottom = () => {
    messagesContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg border border-rose-200 h-[80vh] flex flex-col">
      <ChatHeader otherUserName={otherUserName} otherUserId={matchedUserId}/>
      <div className="flex-grow overflow-auto p-4" ref={messagesContainerRef}>
        {showSuggestion && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center mb-4">
            <p className="text-gray-600 text-sm">
            Als je niets weet te zeggen, gebruik een gespreksstarter:
            </p>
            <div className="flex items-center justify-center space-x-3 mt-2">
              <p className="text-gray-800 font-medium">
                "{currentSuggestion}"
              </p>
              <button
                onClick={handleRefreshSuggestion}
                className="px-2 py-1.5 text-gray-600 hover:bg-rose-200 rounded-lg focus:outline-none"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button 
                onClick={handleSendSuggestion}
                className="px-4 py-1.5 bg-rose-500 text-white text-sm rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              >
                Send
              </button>
            </div>
          </div>
        )}
        <MessageList 
          messages={messages}
          currentUser={currentUser}
          matchId={matchId}
        />
      </div>
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};