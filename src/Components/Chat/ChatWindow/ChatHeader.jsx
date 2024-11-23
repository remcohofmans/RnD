import React, { useState } from 'react';
import { UserPicture } from '../../UserSettings/UserPicture';
import { UnmatchButton } from './UnmatchButton';


export const ChatHeader = ({ otherUserName, otherUserId , matchId}) => {

  const [showReportWindow, setShowReportWindow] = useState(false);

  const handleReportButton = () => {
    console.log('test');
    setShowReportWindow(true);
  }

  const handleCancelReport = () => {
    setShowReportWindow(false);
  }

  /* we tonen enkel nog een bericht, geen echte report meer
  const handleConfirmReport = async () => {
    console.log('match id is:', matchId);
    try {
      const { error } = await supabase
        .from('matches')
        .update({ reported: true })
        .eq('match_id', matchId);

      if (error) {
        console.error('Error reporting match:', error);

        return;
      }
    }
    catch (err){
      console.error('Unexpected error reporting match:', err);
    }
    setShowReportWindow(false);
  }
  */


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
        <button 
          className="px-2 py-1 bg-red-300 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={handleReportButton}
        >
          Help
        </button>
        <UnmatchButton 
            otherUserName={otherUserName}
            otherUserId={otherUserId}
            matchId={matchId}
        />
      </div>

      {showReportWindow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-transform duration-300 scale-95">
            <p className="text-lg font-medium text-gray-800">
            🛡️ Veiligheid eerst!
            Het is belangrijk dat je je veilig voelt tijdens het chatten. Heb je een probleem of voelt iets niet goed? Neem dan contact op met je begeleider voor hulp. Ze staan klaar om je te ondersteunen! 💬❤️
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 text-sm"
                onClick={handleCancelReport}
              >
                Oké
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};