import React from 'react';
import { Message } from '../../types/message';
import { cn } from '../../lib/utils';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
    const getStatusIcon = () => {
        switch (message.status) {
            case 'sending':
                return <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />;
            case 'sent':
                return <Check className="w-3 h-3 text-gray-400" />;
            case 'delivered':
                return <CheckCheck className="w-3 h-3 text-gray-400" />;
            case 'read':
                return <CheckCheck className="w-3 h-3 text-blue-500" />;
            case 'failed':
                return <span className="text-xs text-red-500">!</span>;
            default:
                return null;
        }
    };

    return (
        <div className={cn('flex gap-2 mb-3', isOwn ? 'justify-end' : 'justify-start')}>
            {!isOwn && (
                <img
                    src={message.senderAvatar}
                    alt={message.senderName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
            )}

            <div className={cn('max-w-[70%]', isOwn && 'order-first')}>
                <div
                    className={cn(
                        'px-4 py-2 rounded-2xl',
                        isOwn
                            ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    )}
                >
                    {message.type === 'text' && (
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    )}

                    {message.type === 'image' && message.attachments && (
                        <div className="space-y-2">
                            {message.attachments.map((att) => (
                                <img
                                    key={att.id}
                                    src={att.url}
                                    alt={att.name}
                                    className="max-w-full rounded-lg"
                                />
                            ))}
                            {message.content && (
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            )}
                        </div>
                    )}

                    {message.type === 'file' && message.attachments && (
                        <div className="space-y-2">
                            {message.attachments.map((att) => (
                                <a
                                    key={att.id}
                                    href={att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        'flex items-center gap-2 px-3 py-2 rounded-lg',
                                        isOwn ? 'bg-white/20' : 'bg-gray-200'
                                    )}
                                >
                                    <span className="text-2xl">📎</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{att.name}</p>
                                        <p className={cn(
                                            'text-xs',
                                            isOwn ? 'text-white/70' : 'text-gray-500'
                                        )}>
                                            {(att.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div className={cn(
                    'flex items-center gap-1 mt-1 px-1',
                    isOwn ? 'justify-end' : 'justify-start'
                )}>
                    <span className="text-xs text-gray-400">
                        {format(new Date(message.createdAt), 'HH:mm')}
                    </span>
                    {isOwn && getStatusIcon()}
                </div>
            </div>
        </div>
    );
};
