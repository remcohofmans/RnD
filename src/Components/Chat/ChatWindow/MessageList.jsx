import { Message } from './Message';


export const MessageList = ({ messages, currentUser, matchId, messagesEndRef }) => (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <Message 
          key={msg.id}
          message={msg}
          isOwnMessage={msg.sender_id === currentUser?.id}
          matchId={matchId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
);