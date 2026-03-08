export enum NotificationType {
    COMMENT = 'COMMENT',
    REPLY = 'REPLY',
    REVIEW = 'REVIEW',
    NEW_JOB = 'NEW_JOB',
    FOLLOW = 'FOLLOW',
    UNFOLLOW = 'UNFOLLOW',
}

export interface Notification {
    id: number;
    userId: number;
    title: string;
    content: string;
    isRead: boolean;
    createDate: string;
    type?: NotificationType;     // COMMENT | REVIEW | NEW_JOB | FOLLOW | UNFOLLOW
    referenceId?: number;        // userId (FOLLOW/UNFOLLOW) hoặc jobId (COMMENT/REVIEW/NEW_JOB)
}

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}