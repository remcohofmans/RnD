import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

export const ChatListItem = ({ match, isSelected, onSelect, onConversationStatusChange }) => {
  const [hasMessages, setHasMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkForExistingConversation();
  }, [match.match_id]);

  const checkForExistingConversation = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chats')
        .select('id')
        .eq('match_id', match.match_id)
        .limit(1);

      if (error) {
        throw error;
      }
      const hasExistingMessages = data && data.length > 0;
      setHasMessages(hasExistingMessages);
      onConversationStatusChange(match.match_id, hasExistingMessages);
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
