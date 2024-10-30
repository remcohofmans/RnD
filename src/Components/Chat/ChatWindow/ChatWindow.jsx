import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../supabaseClient';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';

export const ChatWindow = ({ matchId, otherUserEmail }) => {
  // State management
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Effect to handle initial setup
  useEffect(() => {
    fetchCurrentUser();
    fetchMessages();
    setupRealtimeSubscription();
  }, [matchId]);

  // Effect to handle auto-scrolling
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to fetch the current user's data
  const fetchCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching current user:', error);
      setError('Failed to fetch user data');
    } else {
      setCurrentUser(user);
    }
  };

  // Function to fetch existing messages
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

  // Function to set up real-time message subscription
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

    // Cleanup subscription on component unmount
    return () => {
      channel.unsubscribe();
    };
  };

  // Function to handle new messages from real-time subscription
  const handleNewMessage = (payload) => {
    console.log("New message received:", payload);
    setMessages(prevMessages => {
      // Check if the message is already in the list to prevent duplicates
      const messageExists = prevMessages.some(msg => msg.id === payload.new.id);
      if (!messageExists) {
        return [...prevMessages, payload.new];
      }
      return prevMessages;
    });
  };

  // Function to send a new message
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
      
      // Note: We don't need to manually update messages here
      // because the real-time subscription will handle it
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  // Function to scroll to the bottom of the message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Error handling
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  // Render component
  return (
    <div className="bg-white shadow-lg rounded-lg flex flex-col h-full">
      <ChatHeader otherUserEmail={otherUserEmail} />
      <MessageList 
        messages={messages}
        currentUser={currentUser}
        messagesEndRef={messagesEndRef}
      />
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};