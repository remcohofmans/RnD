import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/helper/supabaseClient';
import { UserPicture } from '../../UserSettings/UserPicture';

export const ChatListItem = ({ match, isSelected, onSelect }) => {
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastMessage, setLastMessage] = useState(null);
  const [isOtherUserLastSender, setIsOtherUserLastSender] = useState(false);
  const [loveLikeStatus, setLoveLikeStatus] = useState(null);

  useEffect(() => {
    checkForSentMessages();
    fetchLoveLikeStatus();
  }, [match.match_id]);

  const checkForSentMessages = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;

      if (!currentUser) {
        console.error('No user session found');
        return;
      }

      const { data: messages, error: messagesError } = await supabase
        .from('chats')
        .select('id, message, sender_id')
        .eq('match_id', match.match_id)
        .eq('sender_id', currentUser.id)
        .limit(1);

      if (messagesError) {
        throw messagesError;
      }

      const { data: lastMessageData, error: lastMessageError } = await supabase
        .from('chats')
        .select('id, message, sender_id')
        .eq('match_id', match.match_id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (lastMessageError) {
        throw lastMessageError;
      }

      const hasMessages = Boolean(messages && messages.length > 0);
      setHasSentMessage(hasMessages);
      setLastMessage(lastMessageData?.[0] || null);

      if (lastMessageData?.[0]) {
        setIsOtherUserLastSender(lastMessageData[0].sender_id !== currentUser.id);
      }

    } catch (error) {
      console.error('Error checking for sent messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLoveLikeStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('love_like')
        .eq('match_id', match.match_id)
        .single();

      if (error) {
        throw error;
      }

      console.log("love_like status:", data.love_like);
      const loveLike = data.love_like === 'true' ? true : data.love_like === 'false' ? false : Boolean(data.love_like);

      // Set loveLikeStatus based on fetched data
      setLoveLikeStatus(loveLike);

    } catch (error) {
      console.error('Error fetching love_like status:', error);
    }
  };

  const StatusBadge = () => {
    if (isLoading) return null;

    if (!hasSentMessage) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-rose-100 text-rose-800">
          New Match
        </span>
      );
    }

    if (isOtherUserLastSender) {
      return (
        <span className="flex items-center justify-center px-2.5 py-0.5 rounded-full font-medium bg-rose-100 text-rose-800">
          Jouw Beurt
        </span>
      );
    }

    return null;
  };

  return (
    <li
      className={`cursor-pointer hover:bg-rose-50 transition-colors duration-150 ease-in-out ${isSelected ? 'bg-rose-50' : ''}`}
      onClick={() => onSelect(match.match_id)}
    >
      <div className="p-4 flex items-center gap-3">
        <UserPicture
          userId={match.otherUserId}
          category="profielAfbeelding"
          variant="circle"
          size="md" // Adjust size based on your design
          fallbackText={match.otherUserName || 'U'}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-rose-900 flex items-center gap-1">
            {match.otherUserName || 'Unknown name in db'}
            {loveLikeStatus !== null && (
              <p>
                {console.log("Rendering loveLikeStatus:", loveLikeStatus)}
                {loveLikeStatus ? '❤️' : '🤝'}
              </p>
            )}

          </h3>
          {lastMessage && (
            <p className="text-sm text-gray-600 truncate mt-1">
              {lastMessage.message.length > 30
                ? lastMessage.message.slice(0, 25) + '...'
                : lastMessage.message}
            </p>
          )}
        </div>
        <StatusBadge />
      </div>
    </li>
  );
};

export default ChatListItem;
