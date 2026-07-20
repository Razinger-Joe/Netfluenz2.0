import { Message, Conversation, SendMessageData } from '../types/message';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const CONVERSATIONS_KEY = 'netfluenz_conversations';
const MESSAGES_KEY = 'netfluenz_messages';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initialConversations: Conversation[] = [
    {
        id: '1',
        participants: [
            { userId: '1', name: 'Alex Influencer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', role: 'influencer', isOnline: true },
            { userId: '2', name: 'Brand Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brand', role: 'brand', isOnline: false, lastSeen: new Date() },
        ],
        unreadCount: 0,
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
];

class MessageService {
    private getLocalConversations(): Conversation[] {
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

    private saveLocalConversations(conversations: Conversation[]): void {
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    }

    private getLocalMessages(): Message[] {
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

    private saveLocalMessages(messages: Message[]): void {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }

    async getConversationsByUserId(userId: string): Promise<Conversation[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('conversations')
                .select('*, participant1:profiles!participant1_id(id, full_name, avatar_url, role), participant2:profiles!participant2_id(id, full_name, avatar_url, role)')
                .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
                .order('last_message_at', { ascending: false });

            if (!error && data && data.length > 0) {
                return data.map((c: any) => ({
                    id: c.id,
                    participants: [
                        {
                            userId: c.participant1?.id || c.participant1_id,
                            name: c.participant1?.full_name || 'User 1',
                            avatar: c.participant1?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.participant1_id}`,
                            role: c.participant1?.role || 'influencer',
                            isOnline: true,
                        },
                        {
                            userId: c.participant2?.id || c.participant2_id,
                            name: c.participant2?.full_name || 'User 2',
                            avatar: c.participant2?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.participant2_id}`,
                            role: c.participant2?.role || 'brand',
                            isOnline: false,
                        },
                    ],
                    lastMessage: c.last_message_text ? {
                        id: 'last',
                        conversationId: c.id,
                        senderId: c.participant1_id,
                        senderName: c.participant1?.full_name || '',
                        senderAvatar: c.participant1?.avatar_url || '',
                        type: 'text',
                        content: c.last_message_text,
                        status: 'delivered',
                        createdAt: new Date(c.last_message_at || c.created_at),
                    } : undefined,
                    unreadCount: 0,
                    createdAt: new Date(c.created_at),
                    updatedAt: new Date(c.updated_at || c.last_message_at),
                }));
            }
        }

        await delay(300);
        return this.getLocalConversations().filter(c =>
            c.participants.some(p => p.userId === userId)
        );
    }

    async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('messages')
                .select('*, sender:profiles!sender_id(full_name, avatar_url)')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (!error && data) {
                return data.map((m: any) => ({
                    id: m.id,
                    conversationId: m.conversation_id,
                    senderId: m.sender_id,
                    senderName: m.sender?.full_name || 'User',
                    senderAvatar: m.sender?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.sender_id}`,
                    type: 'text',
                    content: m.content,
                    status: m.is_read ? 'read' : 'delivered',
                    createdAt: new Date(m.created_at),
                }));
            }
        }

        await delay(300);
        return this.getLocalMessages()
            .filter(m => m.conversationId === conversationId)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    async sendMessage(
        data: SendMessageData,
        senderId: string,
        senderName: string,
        senderAvatar: string
    ): Promise<Message> {
        if (isSupabaseConfigured() && supabase) {
            const { data: inserted, error } = await (supabase.from('messages') as any)
                .insert([{
                    conversation_id: data.conversationId,
                    sender_id: senderId,
                    content: data.content,
                    is_read: false,
                }])
                .select('*')
                .single();

            if (!error && inserted) {
                await (supabase.from('conversations') as any)
                    .update({
                        last_message_text: data.content,
                        last_message_at: new Date().toISOString(),
                    })
                    .eq('id', data.conversationId);

                return {
                    id: inserted.id,
                    conversationId: inserted.conversation_id,
                    senderId,
                    senderName,
                    senderAvatar,
                    type: data.type,
                    content: data.content,
                    status: 'sent',
                    createdAt: new Date(inserted.created_at),
                };
            }
        }

        await delay(200);
        const messages = this.getLocalMessages();
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
        this.saveLocalMessages(messages);

        const conversations = this.getLocalConversations();
        const convIndex = conversations.findIndex(c => c.id === data.conversationId);
        if (convIndex !== -1) {
            conversations[convIndex].lastMessage = newMessage;
            conversations[convIndex].updatedAt = new Date();
            this.saveLocalConversations(conversations);
        }

        return newMessage;
    }

    async markAsRead(conversationId: string, userId: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            await (supabase.from('messages') as any)
                .update({ is_read: true })
                .eq('conversation_id', conversationId)
                .neq('sender_id', userId);
        }

        await delay(200);
        const messages = this.getLocalMessages();
        const updated = messages.map(m => {
            if (m.conversationId === conversationId && m.senderId !== userId && !m.readAt) {
                return { ...m, status: 'read' as const, readAt: new Date() };
            }
            return m;
        });
        this.saveLocalMessages(updated);
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
        if (isSupabaseConfigured() && supabase) {
            const [p1, p2] = [currentUserId, otherUserId].sort();
            const { data: existing } = await supabase
                .from('conversations')
                .select('*')
                .eq('participant1_id', p1)
                .eq('participant2_id', p2)
                .single();

            if (existing) {
                return {
                    id: existing.id,
                    participants: [
                        { userId: currentUserId, name: currentUserName, avatar: currentUserAvatar, role: currentUserRole, isOnline: true },
                        { userId: otherUserId, name: otherUserName, avatar: otherUserAvatar, role: otherUserRole, isOnline: false },
                    ],
                    unreadCount: 0,
                    createdAt: new Date(existing.created_at),
                    updatedAt: new Date(existing.updated_at || existing.created_at),
                };
            }

            const { data: created } = await (supabase.from('conversations') as any)
                .insert([{
                    participant1_id: p1,
                    participant2_id: p2,
                }])
                .select('*')
                .single();

            if (created) {
                return {
                    id: created.id,
                    participants: [
                        { userId: currentUserId, name: currentUserName, avatar: currentUserAvatar, role: currentUserRole, isOnline: true },
                        { userId: otherUserId, name: otherUserName, avatar: otherUserAvatar, role: otherUserRole, isOnline: false },
                    ],
                    unreadCount: 0,
                    createdAt: new Date(created.created_at),
                    updatedAt: new Date(created.created_at),
                };
            }
        }

        await delay(300);
        const conversations = this.getLocalConversations();
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
        this.saveLocalConversations(conversations);
        return newConversation;
    }
}

export const messageService = new MessageService();
