import { getUniqueId } from 'react-native-device-info';
import { useCallback, useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { clearAllNotifications, getFcmToken, markAllNotificationsAsRead, markNotificationAsRead, registerTokenToServer, requestNotificationPermissions } from '@/domain/video/api/notifications.service';
import { Notification, NotificationPagination, NotificationType } from '../types/notification.types';
import { getNotifications } from '@/domain/video/api/notification.service';

export const useNotificationSetup = (isAuthenticated: boolean) => {
  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribeTokenRefresh: () => void;

    const init = async () => {
      const permissionGranted = await requestNotificationPermissions();
      if (!permissionGranted) return;

      const token = await getFcmToken();
      if (!token) return;

      const deviceId = await getUniqueId();

      await registerTokenToServer(token, deviceId, Platform.OS as 'android' | 'ios');

      // 🔥 Listen for token refresh
      unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
        await registerTokenToServer(newToken, deviceId, Platform.OS as 'android' | 'ios');
      });
    };

    init();

    // Foreground handler
    const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
      console.log('🔥 Foreground Notification:', remoteMessage);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTokenRefresh?.();
    };
  }, [isAuthenticated]);
};


interface UseNotificationsOptions {
  filter?: NotificationType[];
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { filter } = options;

  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<NotificationPagination | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply type filter client-side
  const notifications = filter
    ? allNotifications.filter((n) => filter.includes(n.type))
    : allNotifications;

  const fetchNotifications = useCallback(async (page: number = 1, append = false) => {
    try {
      if (page === 1 && !append) setLoading(true);
      const data = await getNotifications(page);
      setAllNotifications(prev =>
        append ? [...prev, ...data.notifications] : data.notifications
      );
      setPagination(data.pagination);
      setUnreadCount(data.unreadCount);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications(1);
  }, [fetchNotifications]);

  const loadMore = useCallback(() => {
    if (!pagination || loadingMore) return;
    if (pagination.page >= pagination.totalPages) return;
    setLoadingMore(true);
    fetchNotifications(pagination.page + 1, true);
  }, [pagination, loadingMore, fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setAllNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      setAllNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await clearAllNotifications();
      setAllNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  }, []);

  // Unread count scoped to current filter
  const filteredUnreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,         // already filtered
    pagination,
    unreadCount,           // total unread (all types) — use for tab badge
    filteredUnreadCount,   // unread within current filter — use for section badge
    loading,
    loadingMore,
    refreshing,
    error,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
};