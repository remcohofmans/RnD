import React from 'react';
import { UserPicture } from '../../UserSettings/UserPicture';

export const ChatHeader = ({ otherUserName, otherUserId }) => {
  return (
    <div className="bg-rose-100 px-4 py-3 border-b border-rose-200">
      <div className="flex items-center gap-3">
        <UserPicture
          userId={otherUserId}
          category="profielAfbeelding"
          variant='rounded'
          size="lg"
          fallbackText={otherUserName}
        />
        <h3 className="text-xl font-semibold text-rose-800">
          Chat with {otherUserName}
        </h3>
      </div>
    </div>
  );
};