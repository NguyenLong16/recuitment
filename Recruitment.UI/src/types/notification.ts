export interface Notification {
    id: number;
    userId: number;
    title: string;
    content: string;
    isRead: boolean;
    createDate: string;
}

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}