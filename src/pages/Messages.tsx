import React from 'react';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import { ConversationList } from '../components/messages/ConversationList';
import { ChatWindow } from '../components/messages/ChatWindow';
import { MessageSquare, Sparkles } from 'lucide-react';

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
        <div className="h-[calc(100vh-64px)] flex gradient-mesh">
            {/* Conversation List */}
            <div className="w-80 border-r border-border/50 glass-panel flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-border/50">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-foreground">Messages</h2>
                        <Sparkles className="w-4 h-4 text-secondary animate-twinkle" />
                    </div>
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
            <div className="flex-1">
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
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-card flex items-center justify-center">
                                <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">Select a conversation</h3>
                            <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
