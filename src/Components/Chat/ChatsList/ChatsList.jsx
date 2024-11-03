import React, { useState, useEffect } from 'react';
import { ChatListItem } from './ChatListItem';
import { supabase } from '../../../supabaseClient';

export const ChatsList = ({ matches, onSelectMatch, selectedMatchId }) => {
  const [sortedMatches, setSortedMatches] = useState([]);

  useEffect(() => {
    sortMatches();
  }, [matches]);

  const sortMatches = async () => {
    try {
      // Get last message for each match
      const matchesWithLastMessage = await Promise.all(
        matches.map(async (match) => {
          const { data: messages } = await supabase
            .from('chats')
            .select('created_at')
            .eq('match_id', match.match_id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            ...match,
            lastMessageTime: messages?.[0]?.created_at || null,
          };
        })
      );

      // Sort matches: new matches first, then by last message time
      const sorted = matchesWithLastMessage.sort((a, b) => {
        // If neither has messages, sort by match creation time (newest first)
        if (!a.lastMessageTime && !b.lastMessageTime) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        // If only one has messages, the one without messages goes first
        if (!a.lastMessageTime) return -1;
        if (!b.lastMessageTime) return 1;
        // Otherwise sort by last message time
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      });

      setSortedMatches(sorted);
    } catch (error) {
      console.error('Error sorting matches:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <h2 className="text-xl font-semibold p-4 bg-gray-100">Your Matches</h2>
      <ul className="divide-y divide-gray-200">
        {sortedMatches.map((match) => (
          <ChatListItem
            key={match.match_id}
            match={match}
            isSelected={selectedMatchId === match.match_id}
            onSelect={onSelectMatch}
          />
        ))}
      </ul>
    </div>
  );
};