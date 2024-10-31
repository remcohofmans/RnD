import React, { useState, useRef, useEffect } from 'react';
import data from '@emoji-mart/data' //bevat alle emojis, altijd ingeladen
import Picker from '@emoji-mart/react'

export const MessageInput = ({ onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current && 
                !emojiPickerRef.current.contains(event.target) &&
                emojiButtonRef.current && 
                !emojiButtonRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
        setShowEmojiPicker(false);
    };

    const handleEmojiSelect = (emoji) => {
        setNewMessage(prevMessage => prevMessage + emoji.native);
        setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="bg-gray-100 px-4 py-3 border-t">
                <div className="flex space-x-3 relative">
                    <button 
                        ref={emojiButtonRef}
                        type="button"
                        onClick={toggleEmojiPicker}
                        className="px-2 py-2 text-xl hover:bg-gray-200 rounded-lg focus:outline-none"
                    >
                        😊
                    </button>
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

                {showEmojiPicker && (
                    <div 
                        ref={emojiPickerRef}
                        className="fixed z-50"
                        style={{
                            position: 'fixed',
                            bottom: '80px', 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            maxWidth: 'calc(100% - 40px)', // Ensure it doesn't exceed screen width
                            width: 'max-content', 
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Picker 
                            data={data}
                            onEmojiSelect={handleEmojiSelect}
                            theme="light"
                            perLine={8}
                            maxFrequentRows={2}
                        />
                    </div>
                )}
            </form>
        </div>
    );
};