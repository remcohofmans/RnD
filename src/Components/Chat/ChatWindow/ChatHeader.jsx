export const ChatHeader = ({ otherUserEmail }) => (
    <div className="bg-gray-100 px-4 py-3 border-b">
      <h3 className="text-xl font-semibold text-gray-800">
        Chat with {otherUserEmail}
      </h3>
    </div>
  );