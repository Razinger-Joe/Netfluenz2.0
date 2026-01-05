import { useState, useCallback, useEffect, useRef } from 'react';
import { Message, Conversation, SendMessageData } from '../types/message';
import { messageService } from '../services/messages';
import { useAuth } from './useAuth';

interface UseMessagesReturn {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    isLoading: boolean;
    isSending: boolean;
    typingUsers: string[];
    selectConversation: (id: string) => void;
    sendMessage: (content: string, type?: 'text' | 'image' | 'file') => Promise<void>;
    markAsRead: () => Promise<void>;
    startTyping: () => void;
    stopTyping: () => void;
    refreshConversations: () => Promise<void>;
}

export const useMessages = (): UseMessagesReturn => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const refreshConversations = useCallback(async () => {
        if (!user) return;
        try {
            const convs = await messageService.getConversationsByUserId(user.id);
            setConversations(convs);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            refreshConversations().finally(() => setIsLoading(false));
        }
    }, [user, refreshConversations]);

    const selectConversation = useCallback(async (id: string) => {
        const conv = conversations.find(c => c.id === id);
        if (!conv) return;

        setCurrentConversation(conv);
        setIsLoading(true);

        try {
            const msgs = await messageService.getMessagesByConversationId(id);
            setMessages(msgs);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setIsLoading(false);
        }
    }, [conversations]);

    const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
        if (!user || !currentConversation || !content.trim()) return;

        setIsSending(true);
        try {
            const newMessage = await messageService.sendMessage(
                { conversationId: currentConversation.id, content, type },
                user.id,
                user.name,
                user.avatar || ''
            );
            setMessages(prev => [...prev, newMessage]);
            await refreshConversations();
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        } finally {
            setIsSending(false);
        }
    }, [user, currentConversation, refreshConversations]);

    const markAsRead = useCallback(async () => {
        if (!user || !currentConversation) return;
        await messageService.markAsRead(currentConversation.id, user.id);
        await refreshConversations();
    }, [user, currentConversation, refreshConversations]);

    const startTyping = useCallback(() => {
        if (!user) return;
        // In a real app, this would emit a typing event to WebSocket
        setTypingUsers(prev => [...new Set([...prev, user.id])]);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            setTypingUsers(prev => prev.filter(id => id !== user.id));
        }, 3000);
    }, [user]);

    const stopTyping = useCallback(() => {
        if (!user) return;
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        setTypingUsers(prev => prev.filter(id => id !== user.id));
    }, [user]);

    // Simulate receiving messages (poll every 5 seconds)
    useEffect(() => {
        if (!currentConversation) return;

        const interval = setInterval(async () => {
            const msgs = await messageService.getMessagesByConversationId(currentConversation.id);
            setMessages(msgs);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentConversation]);

    return {
        conversations,
        currentConversation,
        messages,
        isLoading,
        isSending,
        typingUsers,
        selectConversation,
        sendMessage,
        markAsRead,
        startTyping,
        stopTyping,
        refreshConversations,
    };
};
