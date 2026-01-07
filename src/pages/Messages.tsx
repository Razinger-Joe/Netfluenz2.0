import React from 'react';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import { ConversationList } from '../components/messages/ConversationList';
import { ChatWindow } from '../components/messages/ChatWindow';
import { EmptyState } from '../components/common/EmptyState';
import { MessageSquare } from 'lucide-react';

export const Messages: React.FC = () => {
    const { user } = useAuth();
    const {
        conversations,
        currentConversation,
        messages,
        isSending,
        typingUsers,
        selectConversation,
        sendMessage,
        markAsRead,
        startTyping,
        stopTyping,
    } = useMessages();

    if (!user) return null;

    const getRecipient = () => {
        if (!currentConversation) return null;
        return currentConversation.participants.find(p => p.userId !== user.id);
    };

    const recipient = getRecipient();

    return (
        <div className="h-[calc(100vh-64px)] flex">
            {/* Conversation List */}
            <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                </div>
                <ConversationList
                    conversations={conversations}
                    currentUserId={user.id}
                    selectedId={currentConversation?.id}
                    onSelect={(id) => {
                        selectConversation(id);
                        markAsRead();
                    }}
                />
            </div>

            {/* Chat Window */}
            <div className="flex-1 bg-white">
                {currentConversation && recipient ? (
                    <ChatWindow
                        messages={messages}
                        currentUserId={user.id}
                        recipientName={recipient.name}
                        recipientAvatar={recipient.avatar}
                        isOnline={recipient.isOnline}
                        typingUsers={typingUsers}
                        isSending={isSending}
                        onSendMessage={sendMessage}
                        onStartTyping={startTyping}
                        onStopTyping={stopTyping}
                    />
                ) : (
                    <EmptyState
                        icon={<MessageSquare className="w-full h-full" />}
                        title="Select a conversation"
                        description="Choose a conversation from the list to start messaging"
                        className="h-full"
                    />
                )}
            </div>
        </div>
    );
};
