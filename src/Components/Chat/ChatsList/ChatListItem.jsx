export const ChatListItem = ({ match, isSelected, onSelect }) => (
    <li 
      className={`cursor-pointer hover:bg-gray-50 transition-colors duration-150 ease-in-out ${isSelected ? 'bg-blue-50' : ''}`}
      onClick={() => onSelect(match.match_id)}
    >
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{match.otherUserEmail}</h3>
        <p className="text-sm text-gray-500">Match ID: {match.match_id}</p>
      </div>
    </li>
  );