import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

export const ChatListItem = ({ match, isSelected, onSelect }) => {
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    checkForSentMessages();
  }, [match.match_id]);

  const checkForSentMessages = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      
      if (!currentUser) {
        console.error('No user session found');
        return;
      }

      const { data: messages, error: messagesError } = await supabase
        .from('chats')
        .select('id, message, sender_id')
        .eq('match_id', match.match_id)
        .eq('sender_id', currentUser.id)
        .limit(1);

      if (messagesError) {
        throw messagesError;
      }

      // Get the last message for preview, can be of both users
      const { data: lastMessageData, error: lastMessageError } = await supabase
        .from('chats')
        .select('id, message')
        .eq('match_id', match.match_id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (lastMessageError) {
        throw lastMessageError;
      }

      setHasSentMessage(Boolean(messages && messages.length > 0));
      setLastMessage(lastMessageData?.[0] || null);
    } catch (error) {
      console.error('Error checking for sent messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li
      className={`cursor-pointer hover:bg-rose-50 transition-colors duration-150 ease-in-out ${
        isSelected ? 'bg-rose-100' : ''
      }`}
      onClick={() => onSelect(match.match_id)}
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-rose-900">
            {match.otherUserName || 'Unknown name in db'}
          </h3>
          {lastMessage && (
            <p className="text-sm text-rose-500 truncate">
              {lastMessage.message}
            </p>
          )}
        </div>
        {!isLoading && !hasSentMessage && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-rose-100 text-rose-800">
            New Match
          </span>
        )}
      </div>
    </li>
  );
};