import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Notification } from '../types/notification';
import { notificationService } from '../services/notifications';
import { useAuth } from '../hooks/useAuth';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    addNotification: (type: Notification['type'], title: string, message: string, link?: string) => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const refreshNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const [notifs, count] = await Promise.all([
                notificationService.getByUserId(user.id),
                notificationService.getUnreadCount(user.id),
            ]);
            setNotifications(notifs);
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isAuthenticated && user) {
            refreshNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(refreshNotifications, 30000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
            setIsLoading(false);
        }
    }, [isAuthenticated, user, refreshNotifications]);

    const markAsRead = useCallback(async (id: string) => {
        await notificationService.markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(async () => {
        if (!user) return;
        await notificationService.markAllAsRead(user.id);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }, [user]);

    const addNotification = useCallback(async (
        type: Notification['type'],
        title: string,
        message: string,
        link?: string
    ) => {
        if (!user) return;
        const newNotif = await notificationService.create(user.id, type, title, message, link);
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
    }, [user]);

    const deleteNotification = useCallback(async (id: string) => {
        await notificationService.delete(id);
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAll = useCallback(async () => {
        if (!user) return;
        await notificationService.clearAll(user.id);
        setNotifications([]);
        setUnreadCount(0);
    }, [user]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isLoading,
            markAsRead,
            markAllAsRead,
            addNotification,
            deleteNotification,
            clearAll,
            refreshNotifications,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
