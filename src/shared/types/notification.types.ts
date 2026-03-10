// shared/types/notification.types.ts

export type NotificationType2 = 'upload' | 'comment' | 'report';

export interface BaseNotification {
    id: string;
    type: NotificationType2;
    details: string
    action: string;
    title: string;
    timeAgo: string;
}

export interface CommentNotification extends BaseNotification {
    type: 'comment';
    commentText: string;
}

export interface ReportNotification extends BaseNotification {
    type: 'report';
    reportDetails: {
        message: string;
        reportsReceived: number;
    };
}

export interface UploadNotification extends BaseNotification {
    type: 'upload';
    thumbnail: string;
}

export type NotificationItem =
    | UploadNotification
    | CommentNotification
    | ReportNotification;

export interface ApiNotificationsResponse {
    status: 'success' | 'error';
    data: {
        notifications: NotificationItem[];
    };
}



export type NotificationPriority = 'low' | 'medium' | 'high';

export interface NotificationEntity {
    _id: string;
    recipient: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    priority: NotificationPriority;
    createdAt: string;
    updatedAt: string;
}


export type NotificationType =
    | 'new_video'
    | 'new_short'
    | 'new_post'
    | 'comment'
    | 'comment_reply'
    | 'like'
    | 'dislike'
    | 'new_follower'
    | 'mention'
    | 'system';

export interface Notification {
    _id: string;
    recipient: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    priority: 'high' | 'medium' | 'low';
    isDeleted: boolean;
    deliveryStatus: { socket: boolean; push: boolean };
    createdAt: string;
    updatedAt: string;
}

export interface NotificationPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GetNotificationsResponse {
    status: 'success' | 'error';
    data: {
        notifications: Notification[];
        pagination: NotificationPagination;
        unreadCount: number;
    };
}