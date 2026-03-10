// shared/utils/notification.utils.ts
import { NotificationItem, NotificationType } from '@/shared/types/notification.types';

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

export const COMMENT_NOTIFICATION_TYPES: NotificationType[] = [
  'comment',
  'comment_reply',
  'mention',
];

export const ACTIVITY_NOTIFICATION_TYPES: NotificationType[] = [
  'like',
  'dislike',
  'new_follower',
];

export const CONTENT_NOTIFICATION_TYPES: NotificationType[] = [
  'new_video',
  'new_short',
  'new_post',
];

export const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    new_video: '🎬',
    new_short: '⚡',
    new_post: '📝',
    comment: '💬',
    comment_reply: '↩️',
    like: '❤️',
    dislike: '👎',
    new_follower: '👤',
    mention: '@',
    system: '🔔',
  };
  return icons[type] ?? '🔔';
};

export const getNotificationColor = (type: NotificationType): string => {
  const colors: Record<NotificationType, string> = {
    new_video: '#3B82F6',
    new_short: '#8B5CF6',
    new_post: '#10B981',
    comment: '#F59E0B',
    comment_reply: '#F59E0B',
    like: '#EF4444',
    dislike: '#6B7280',
    new_follower: '#9BD71B',
    mention: '#06B6D4',
    system: '#9CA3AF',
  };
  return colors[type] ?? '#9CA3AF';
};

export const formatNotificationTime = (createdAt: string): string => {
  const diff = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(createdAt).toLocaleDateString();
};