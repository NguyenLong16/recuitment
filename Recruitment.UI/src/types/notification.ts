export interface Notification {
    id: number;
    userId: number;
    title: string;
    content: string;
    isRead: boolean;
    createDate: string;
    notificationType?: string;   // "follow" | "unfollow" | "comment" | "review"
    referenceId?: number;        // userId (follow/unfollow) hoặc jobId (comment/review)
}

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}