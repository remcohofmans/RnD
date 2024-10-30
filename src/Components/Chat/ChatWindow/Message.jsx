import React from 'react';

export const Message = ({ message, isOwnMessage }) => {
  const formattedTimestamp = new Date(message.created_at).toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`flex items-center my-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {/* Timestamp on the left for own messages */}
      {isOwnMessage && (
        <p className="text-xs text-gray-500 mr-2">{formattedTimestamp}</p>
      )}

      {/* Message Bubble */}
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
        isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}>
        <p>{message.message}</p>
      </div>

      {/* Timestamp on the right for other user's messages */}
      {!isOwnMessage && (
        <p className="text-xs text-gray-500 ml-2">{formattedTimestamp}</p>
      )}
    </div>
  );
};