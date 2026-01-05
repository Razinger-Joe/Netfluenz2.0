import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../types/message';
import { MessageBubble } from './MessageBubble';
import { cn } from '../../lib/utils';
import { Send, Paperclip, Smile, Image } from 'lucide-react';

interface ChatWindowProps {
    messages: Message[];
    currentUserId: string;
    recipientName: string;
    recipientAvatar: string;
    isOnline: boolean;
    typingUsers: string[];
    isSending: boolean;
    onSendMessage: (content: string) => Promise<void>;
    onStartTyping: () => void;
    onStopTyping: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    messages,
    currentUserId,
    recipientName,
    recipientAvatar,
    isOnline,
    typingUsers,
    isSending,
    onSendMessage,
    onStartTyping,
    onStopTyping,
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;

        const content = input.trim();
        setInput('');
        onStopTyping();

        try {
            await onSendMessage(content);
        } catch (error) {
            setInput(content); // Restore input on error
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        onStartTyping();
    };

    const isTyping = typingUsers.filter(id => id !== currentUserId).length > 0;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
                <div className="relative">
                    <img
                        src={recipientAvatar}
                        alt={recipientName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{recipientName}</h3>
                    <p className="text-xs text-gray-500">
                        {isTyping ? 'Typing...' : isOnline ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <img
                                src={recipientAvatar}
                                alt={recipientName}
                                className="w-16 h-16 rounded-full mx-auto mb-3"
                            />
                            <p className="text-gray-500">Start a conversation with {recipientName}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                isOwn={message.senderId === currentUserId}
                            />
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span>{recipientName} is typing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
                <div className="flex items-end gap-2">
                    <div className="flex gap-1">
                        <button
                            type="button"
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Attach file"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Send image"
                        >
                            <Image className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            rows={1}
                            className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            style={{ minHeight: '42px', maxHeight: '120px' }}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Add emoji"
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!input.trim() || isSending}
                        className={cn(
                            'p-3 rounded-xl transition-all',
                            input.trim() && !isSending
                                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:shadow-lg'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        )}
                    >
                        {isSending ? (
                            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
