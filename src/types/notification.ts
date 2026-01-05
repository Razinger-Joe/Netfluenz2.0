export type NotificationType =
    | 'campaign_update'
    | 'campaign_application'
    | 'application_accepted'
    | 'application_rejected'
    | 'new_message'
    | 'payment_received'
    | 'payment_sent'
    | 'profile_view'
    | 'system';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
    metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
    email: {
        campaigns: boolean;
        messages: boolean;
        payments: boolean;
        marketing: boolean;
    };
    push: {
        campaigns: boolean;
        messages: boolean;
        payments: boolean;
    };
    inApp: {
        all: boolean;
    };
}
