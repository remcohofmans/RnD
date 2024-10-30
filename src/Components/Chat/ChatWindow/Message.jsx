export const Message = ({ message, isOwnMessage }) => (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}>
        {message.message}
      </div>
    </div>
  );