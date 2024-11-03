import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

export const ChatListItem = ({ match, isSelected, onSelect }) => {
  const [hasMessages, setHasMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    checkForExistingConversation();
  }, [match.match_id]);

  const checkForExistingConversation = async () => {
    try {
      setIsLoading(true);
      const { data: messages, error: messagesError } = await supabase
        .from('chats')
        .select('id, message')
        .eq('match_id', match.match_id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (messagesError) {
        throw messagesError;
      }

      setHasMessages(messages && messages.length > 0);
      setLastMessage(messages?.[0] || null);
    } catch (error) {
      console.error('Error checking for existing conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li
      className={`cursor-pointer hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={() => onSelect(match.match_id)}
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            {match.otherUserName}
          </h3>
          {lastMessage && (
            <p className="text-sm text-gray-500 truncate">
              {lastMessage.message}
            </p>
          )}
        </div>
        {!isLoading && !hasMessages && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            New Match
          </span>
        )}
      </div>
    </li>
  );
};