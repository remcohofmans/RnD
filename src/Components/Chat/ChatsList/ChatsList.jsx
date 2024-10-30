import React from 'react';
import { ChatListItem } from './ChatListItem';

export const ChatsList = ({ matches, onSelectMatch, selectedMatchId }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
    <h2 className="text-xl font-semibold p-4 bg-gray-100">Your Matches</h2>
    <ul className="divide-y divide-gray-200">
      {matches.map((match) => (
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