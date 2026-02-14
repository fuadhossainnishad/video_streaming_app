// shared/types/notification.types.ts

export type NotificationType = 'upload' | 'comment' | 'report';

export interface BaseNotification {
    id: string;
    type: NotificationType;
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
