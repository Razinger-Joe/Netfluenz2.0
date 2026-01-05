import React from 'react';
import { Conversation } from '../../types/message';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
    conversations: Conversation[];
    currentUserId: string;
    selectedId?: string;
    onSelect: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    currentUserId,
    selectedId,
    onSelect,
}) => {
    const getOtherParticipant = (conv: Conversation) => {
        return conv.participants.find(p => p.userId !== currentUserId);
    };

    if (conversations.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-gray-500">No conversations yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start chatting with influencers or brands</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto">
            {conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                if (!other) return null;

                return (
                    <button
                        key={conv.id}
                        onClick={() => onSelect(conv.id)}
                        className={cn(
                            'w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50',
                            selectedId === conv.id && 'bg-orange-50 hover:bg-orange-50'
                        )}
                    >
                        <div className="relative flex-shrink-0">
                            <img
                                src={other.avatar}
                                alt={other.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            {other.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className={cn(
                                    'font-medium truncate',
                                    conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                                )}>
                                    {other.name}
                                </h4>
                                {conv.lastMessage && (
                                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                        {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                {conv.lastMessage ? (
                                    <p className={cn(
                                        'text-sm truncate',
                                        conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                                    )}>
                                        {conv.lastMessage.senderId === currentUserId && 'You: '}
                                        {conv.lastMessage.content}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No messages yet</p>
                                )}

                                {conv.unreadCount > 0 && (
                                    <span className="flex-shrink-0 ml-2 w-5 h-5 bg-orange-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                                        {conv.unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
