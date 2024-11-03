export const ChatHeader = ({ otherUserName }) => (
  <div className="bg-rose-100 px-4 py-3 border-b border-rose-200">
    <h3 className="text-xl font-semibold text-rose-800">
      Chat with {otherUserName}
    </h3>
  </div>
);
