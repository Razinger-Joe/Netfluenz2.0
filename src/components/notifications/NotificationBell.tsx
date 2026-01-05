import React from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const NotificationBell: React.FC = () => {
    const { unreadCount } = useNotifications();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <NotificationPanel onClose={() => setIsOpen(false)} />
                </>
            )}
        </div>
    );
};

interface NotificationPanelProps {
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
    const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'campaign_update':
            case 'campaign_application':
                return '📢';
            case 'application_accepted':
                return '✅';
            case 'application_rejected':
                return '❌';
            case 'new_message':
                return '💬';
            case 'payment_received':
            case 'payment_sent':
                return '💰';
            case 'profile_view':
                return '👀';
            default:
                return '🔔';
        }
    };

    return (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={markAllAsRead}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Mark all as read"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-orange-500 border-r-transparent" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={cn(
                                'flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0',
                                !notification.read && 'bg-orange-50/50'
                            )}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    'text-sm',
                                    notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'
                                )}>
                                    {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={clearAll}
                        className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Clear all notifications
                    </button>
                </div>
            )}
        </div>
    );
};
