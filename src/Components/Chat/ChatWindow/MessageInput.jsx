import React, { useState, useRef, useEffect } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

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
        setNewMessage((prevMessage) => prevMessage + emoji.native);
        setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-rose-50 px-4 py-3 border-t border-rose-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <button
                        ref={emojiButtonRef}
                        type="button"
                        onClick={toggleEmojiPicker}
                        className="flex-shrink-0 p-2 text-xl hover:bg-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    >
                        😊
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow min-w-0 px-3 py-2 bg-white border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="Schrijf een bericht"
                    />
                    <button
                        type="submit"
                        className="flex-shrink-0 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 flex items-center justify-center transition-colors duration-200"
                    >
                        <span className="hidden sm:block">Verstuur</span>
                        <span className="block sm:hidden text-xl">→</span>
                    </button>
                </div>

                {showEmojiPicker && (
                    <div
                        ref={emojiPickerRef}
                        className="fixed z-50 bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md"
                    >
                        <div className="w-full overflow-x-auto">
                            <Picker
                                data={data}
                                onEmojiSelect={handleEmojiSelect}
                                theme="light"
                                perLine={8}
                                maxFrequentRows={2}
                                className="w-full"
                            />
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};