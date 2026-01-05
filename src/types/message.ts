export type MessageType = 'text' | 'image' | 'file' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Attachment {
    id: string;
    type: 'image' | 'file';
    url: string;
    name: string;
    size: number;
    mimeType: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    type: MessageType;
    content: string;
    attachments?: Attachment[];
    status: MessageStatus;
    createdAt: Date;
    readAt?: Date;
}

export interface Conversation {
    id: string;
    participants: ConversationParticipant[];
    lastMessage?: Message;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
    isTyping?: string[]; // Array of user IDs currently typing
}

export interface ConversationParticipant {
    userId: string;
    name: string;
    avatar: string;
    role: 'influencer' | 'brand';
    isOnline: boolean;
    lastSeen?: Date;
}

export interface SendMessageData {
    conversationId: string;
    content: string;
    type: MessageType;
    attachments?: File[];
}
