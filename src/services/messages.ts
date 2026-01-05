import { Message, Conversation, SendMessageData } from '../types/message';

const CONVERSATIONS_KEY = 'netfluenz_conversations';
const MESSAGES_KEY = 'netfluenz_messages';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock initial conversations
const initialConversations: Conversation[] = [
    {
        id: '1',
        participants: [
            { userId: '1', name: 'Alex Influencer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', role: 'influencer', isOnline: true },
            { userId: '2', name: 'Brand Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brand', role: 'brand', isOnline: false, lastSeen: new Date() },
        ],
        unreadCount: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-10'),
    },
];

const initialMessages: Message[] = [
    {
        id: '1',
        conversationId: '1',
        senderId: '2',
        senderName: 'Brand Manager',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brand',
        type: 'text',
        content: 'Hi! We loved your profile and want to discuss a potential collaboration.',
        status: 'read',
        createdAt: new Date('2024-01-10T09:00:00'),
        readAt: new Date('2024-01-10T09:05:00'),
    },
    {
        id: '2',
        conversationId: '1',
        senderId: '1',
        senderName: 'Alex Influencer',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        type: 'text',
        content: 'Thank you! I would love to hear more about the campaign.',
        status: 'read',
        createdAt: new Date('2024-01-10T09:10:00'),
        readAt: new Date('2024-01-10T09:15:00'),
    },
    {
        id: '3',
        conversationId: '1',
        senderId: '2',
        senderName: 'Brand Manager',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brand',
        type: 'text',
        content: 'Great! We are launching a new product line and need influencers in your niche. Are you available next week for a call?',
        status: 'delivered',
        createdAt: new Date('2024-01-10T09:20:00'),
    },
];

class MessageService {
    private getConversations(): Conversation[] {
        try {
            const stored = localStorage.getItem(CONVERSATIONS_KEY);
            if (stored) {
                return JSON.parse(stored).map((c: Conversation) => ({
                    ...c,
                    createdAt: new Date(c.createdAt),
                    updatedAt: new Date(c.updatedAt),
                }));
            }
            localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(initialConversations));
            return initialConversations;
        } catch {
            return initialConversations;
        }
    }

    private saveConversations(conversations: Conversation[]): void {
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    }

    private getMessages(): Message[] {
        try {
            const stored = localStorage.getItem(MESSAGES_KEY);
            if (stored) {
                return JSON.parse(stored).map((m: Message) => ({
                    ...m,
                    createdAt: new Date(m.createdAt),
                    readAt: m.readAt ? new Date(m.readAt) : undefined,
                }));
            }
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(initialMessages));
            return initialMessages;
        } catch {
            return initialMessages;
        }
    }

    private saveMessages(messages: Message[]): void {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }

    async getConversationsByUserId(userId: string): Promise<Conversation[]> {
        await delay(400);
        return this.getConversations().filter(c =>
            c.participants.some(p => p.userId === userId)
        );
    }

    async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
        await delay(300);
        return this.getMessages()
            .filter(m => m.conversationId === conversationId)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    async sendMessage(
        data: SendMessageData,
        senderId: string,
        senderName: string,
        senderAvatar: string
    ): Promise<Message> {
        await delay(200);
        const messages = this.getMessages();
        const newMessage: Message = {
            id: Math.random().toString(36).substring(7),
            conversationId: data.conversationId,
            senderId,
            senderName,
            senderAvatar,
            type: data.type,
            content: data.content,
            status: 'sent',
            createdAt: new Date(),
        };
        messages.push(newMessage);
        this.saveMessages(messages);

        // Update conversation
        const conversations = this.getConversations();
        const convIndex = conversations.findIndex(c => c.id === data.conversationId);
        if (convIndex !== -1) {
            conversations[convIndex].lastMessage = newMessage;
            conversations[convIndex].updatedAt = new Date();
            this.saveConversations(conversations);
        }

        // Simulate delivery after a short delay
        setTimeout(() => {
            const updatedMessages = this.getMessages();
            const msgIndex = updatedMessages.findIndex(m => m.id === newMessage.id);
            if (msgIndex !== -1) {
                updatedMessages[msgIndex].status = 'delivered';
                this.saveMessages(updatedMessages);
            }
        }, 1000);

        return newMessage;
    }

    async markAsRead(conversationId: string, userId: string): Promise<void> {
        await delay(200);
        const messages = this.getMessages();
        const updated = messages.map(m => {
            if (m.conversationId === conversationId && m.senderId !== userId && !m.readAt) {
                return { ...m, status: 'read' as const, readAt: new Date() };
            }
            return m;
        });
        this.saveMessages(updated);

        const conversations = this.getConversations();
        const convIndex = conversations.findIndex(c => c.id === conversationId);
        if (convIndex !== -1) {
            conversations[convIndex].unreadCount = 0;
            this.saveConversations(conversations);
        }
    }

    async createConversation(
        currentUserId: string,
        currentUserName: string,
        currentUserAvatar: string,
        currentUserRole: 'influencer' | 'brand',
        otherUserId: string,
        otherUserName: string,
        otherUserAvatar: string,
        otherUserRole: 'influencer' | 'brand'
    ): Promise<Conversation> {
        await delay(400);
        const conversations = this.getConversations();

        // Check if conversation already exists
        const existing = conversations.find(c =>
            c.participants.some(p => p.userId === currentUserId) &&
            c.participants.some(p => p.userId === otherUserId)
        );
        if (existing) return existing;

        const newConversation: Conversation = {
            id: Math.random().toString(36).substring(7),
            participants: [
                { userId: currentUserId, name: currentUserName, avatar: currentUserAvatar, role: currentUserRole, isOnline: true },
                { userId: otherUserId, name: otherUserName, avatar: otherUserAvatar, role: otherUserRole, isOnline: false },
            ],
            unreadCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        conversations.push(newConversation);
        this.saveConversations(conversations);
        return newConversation;
    }
}

export const messageService = new MessageService();
