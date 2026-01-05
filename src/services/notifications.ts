import { Notification, NotificationType } from '../types/notification';

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
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    },
    {
        id: '2',
        userId: '1',
        type: 'application_accepted',
        title: 'Application Accepted!',
        message: 'Congratulations! Your application to Kenya Airways campaign has been accepted.',
        link: '/campaigns/2',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
        id: '3',
        userId: '1',
        type: 'payment_received',
        title: 'Payment Received',
        message: 'You received KES 25,000 for completing the Jumia campaign.',
        link: '/payments',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
        id: '4',
        userId: '1',
        type: 'new_message',
        title: 'New Message',
        message: 'Brand Manager sent you a message.',
        link: '/messages/1',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
];

class NotificationService {
    private getNotifications(): Notification[] {
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

    private saveNotifications(notifications: Notification[]): void {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }

    async getByUserId(userId: string): Promise<Notification[]> {
        await delay(300);
        return this.getNotifications()
            .filter(n => n.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async getUnreadCount(userId: string): Promise<number> {
        await delay(100);
        return this.getNotifications().filter(n => n.userId === userId && !n.read).length;
    }

    async markAsRead(id: string): Promise<void> {
        await delay(200);
        const notifications = this.getNotifications();
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications[index].read = true;
            this.saveNotifications(notifications);
        }
    }

    async markAllAsRead(userId: string): Promise<void> {
        await delay(300);
        const notifications = this.getNotifications();
        const updated = notifications.map(n =>
            n.userId === userId ? { ...n, read: true } : n
        );
        this.saveNotifications(updated);
    }

    async create(
        userId: string,
        type: NotificationType,
        title: string,
        message: string,
        link?: string
    ): Promise<Notification> {
        await delay(200);
        const notifications = this.getNotifications();
        const newNotification: Notification = {
            id: Math.random().toString(36).substring(7),
            userId,
            type,
            title,
            message,
            link,
            read: false,
            createdAt: new Date(),
        };
        notifications.unshift(newNotification);
        this.saveNotifications(notifications);
        return newNotification;
    }

    async delete(id: string): Promise<void> {
        await delay(200);
        const notifications = this.getNotifications();
        this.saveNotifications(notifications.filter(n => n.id !== id));
    }

    async clearAll(userId: string): Promise<void> {
        await delay(300);
        const notifications = this.getNotifications();
        this.saveNotifications(notifications.filter(n => n.userId !== userId));
    }
}

export const notificationService = new NotificationService();
