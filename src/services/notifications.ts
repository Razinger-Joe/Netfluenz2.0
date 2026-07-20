import { Notification } from '../types/notification';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const NOTIFICATIONS_KEY = 'netfluenz_notifications';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initialNotifications: Notification[] = [
    {
        id: '1',
        userId: '1',
        type: 'campaign_application',
        title: 'New Campaign Available',
        message: 'Safaricom is looking for tech influencers for their M-Pesa campaign.',
        link: '/campaigns/1',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
        id: '2',
        userId: '1',
        type: 'application_accepted',
        title: 'Application Accepted!',
        message: 'Congratulations! Your application to Kenya Airways campaign has been accepted.',
        link: '/campaigns/2',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
        id: '3',
        userId: '1',
        type: 'payment_received',
        title: 'Payment Received',
        message: 'You received KES 25,000 for completing the Jumia campaign.',
        link: '/payments',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
];

class NotificationService {
    private getLocalNotifications(): Notification[] {
        try {
            const stored = localStorage.getItem(NOTIFICATIONS_KEY);
            if (stored) {
                return JSON.parse(stored).map((n: Notification) => ({
                    ...n,
                    createdAt: new Date(n.createdAt),
                }));
            }
            localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(initialNotifications));
            return initialNotifications;
        } catch {
            return initialNotifications;
        }
    }

    private saveLocalNotifications(notifications: Notification[]): void {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }

    async getByUserId(userId: string): Promise<Notification[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                return data.map((n: any) => ({
                    id: n.id,
                    userId: n.user_id,
                    type: n.type || 'system',
                    title: n.title,
                    message: n.message,
                    link: n.link || undefined,
                    read: n.read || false,
                    createdAt: new Date(n.created_at),
                }));
            }
        }

        await delay(300);
        return this.getLocalNotifications()
            .filter(n => n.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async getUnreadCount(userId: string): Promise<number> {
        if (isSupabaseConfigured() && supabase) {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('read', false);

            if (!error && count !== null) {
                return count;
            }
        }

        await delay(100);
        return this.getLocalNotifications().filter(n => n.userId === userId && !n.read).length;
    }

    async markAsRead(id: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            await (supabase.from('notifications') as any)
                .update({ read: true })
                .eq('id', id);
        }

        await delay(200);
        const notifications = this.getLocalNotifications();
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications[index].read = true;
            this.saveLocalNotifications(notifications);
        }
    }

    async markAllAsRead(userId: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            await (supabase.from('notifications') as any)
                .update({ read: true })
                .eq('user_id', userId);
        }

        await delay(300);
        const notifications = this.getLocalNotifications();
        const updated = notifications.map(n =>
            n.userId === userId ? { ...n, read: true } : n
        );
        this.saveLocalNotifications(updated);
    }

    async create(userId: string, type: any, title: string, message: string, link?: string): Promise<Notification> {
        if (isSupabaseConfigured() && supabase) {
            const { data: inserted } = await (supabase.from('notifications') as any)
                .insert([{
                    user_id: userId,
                    title: title,
                    message: message,
                    type: type || 'info',
                    link: link,
                    read: false,
                }])
                .select('*')
                .single();

            if (inserted) {
                return {
                    id: inserted.id,
                    userId,
                    type: inserted.type || 'system',
                    title: inserted.title,
                    message: inserted.message,
                    link: inserted.link,
                    read: false,
                    createdAt: new Date(inserted.created_at),
                };
            }
        }

        await delay(200);
        const notifications = this.getLocalNotifications();
        const newNotif: Notification = {
            id: Math.random().toString(36).substring(7),
            userId,
            type: (type as any) || 'system',
            title,
            message,
            link,
            read: false,
            createdAt: new Date(),
        };
        notifications.unshift(newNotif);
        this.saveLocalNotifications(notifications);
        return newNotif;
    }

    async delete(id: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            await (supabase.from('notifications') as any)
                .delete()
                .eq('id', id);
        }

        await delay(200);
        const notifications = this.getLocalNotifications().filter(n => n.id !== id);
        this.saveLocalNotifications(notifications);
    }

    async clearAll(userId: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            await (supabase.from('notifications') as any)
                .delete()
                .eq('user_id', userId);
        }

        await delay(300);
        const notifications = this.getLocalNotifications().filter(n => n.userId !== userId);
        this.saveLocalNotifications(notifications);
    }
}

export const notificationService = new NotificationService();
