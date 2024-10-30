import { useState } from 'react';

export const MessageInput = ({ onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;
      onSendMessage(newMessage);
      setNewMessage('');
    };
  
    return (
      <form onSubmit={handleSubmit} className="bg-gray-100 px-4 py-3 border-t">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send
          </button>
        </div>
      </form>
    );
  };