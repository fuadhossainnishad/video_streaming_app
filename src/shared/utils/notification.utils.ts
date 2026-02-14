// shared/utils/notification.utils.ts
import { NotificationItem } from '@/shared/types/notification.types';

/**
 * Extract thumbnail if exists (only for uploads)
 */
export const getNotificationThumbnail = (notification: NotificationItem) => {
    if (notification.type === 'upload') return notification.thumbnail;
    return undefined;
};

/**
 * Extract comment text if exists
 */
export const getNotificationCommentText = (notification: NotificationItem) => {
    if (notification.type === 'comment') return notification.commentText;
    return undefined;
};

/**
 * Extract report details if exists
 */
export const getNotificationReportDetails = (notification: NotificationItem) => {
    if (notification.type === 'report') return notification.reportDetails;
    return undefined;
};
