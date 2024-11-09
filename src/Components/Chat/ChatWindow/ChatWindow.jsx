import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../supabaseClient';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';

export const ChatWindow = ({ matchId, otherUserName }) => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [matchedUserId, setMatchedUserId] = useState(null);
  const [error, setError] = useState(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchMatchedUser();
    fetchMessages();
    setupRealtimeSubscription();
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        // Determine which ID is the matched user's ID
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
        <MessageList 
          messages={messages}
          currentUser={currentUser}
        />
      </div>
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};
