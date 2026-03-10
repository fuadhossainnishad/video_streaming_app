import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { getUniqueId } from 'react-native-device-info';
import { axiosClient } from '@/shared/config/axios.config';
import { REGISTER_FCM, UNREGISTER_FCM } from '@/shared/constants/api.constants';
import { GetNotificationsResponse } from '@/shared/types/notification.types';

// ─── Permissions ─────────────────────────────────────────────────────────────

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const status = await messaging().requestPermission();
  return (
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL
  );
};

// ─── Token ───────────────────────────────────────────────────────────────────

export const getFcmToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    console.log('FCM TOKEN:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// ─── Server Registration ─────────────────────────────────────────────────────

export const registerTokenToServer = async (
  token: string,
  deviceId: string,
  deviceType: 'android' | 'ios'
): Promise<void> => {
  await axiosClient.post(REGISTER_FCM, { fcmToken: token, deviceType, deviceId });
};

export const unregisterTokenFromServer = async (deviceId: string): Promise<void> => {
  await axiosClient.post(UNREGISTER_FCM, { deviceId });
};

export const syncFcmToken = async (): Promise<void> => {
  try {
    const permitted = await requestNotificationPermissions();
    if (!permitted) return;

    const token = await getFcmToken();
    if (!token) return;

    const deviceId = await getUniqueId();
    await registerTokenToServer(token, deviceId, Platform.OS as 'android' | 'ios');

    messaging().onTokenRefresh(async (newToken) => {
      await registerTokenToServer(newToken, deviceId, Platform.OS as 'android' | 'ios');
    });
  } catch (error) {
    console.error('FCM Sync Error:', error);
  }
};

// ─── Notification API ─────────────────────────────────────────────────────────

// Add this temporarily to getNotifications in notifications.service.ts
export const getNotifications = async (
  page: number = 1,
  limit: number = 20
): Promise<GetNotificationsResponse['data']> => {
  try {
    const { data } = await axiosClient.get<GetNotificationsResponse>(
      '/v1/notifications',
      { params: { page, limit } }
    );
    return data.data;
  } catch (error: any) {
    console.log('NOTIF ERROR STATUS:', error?.response?.status);
    console.log('NOTIF ERROR DATA:', JSON.stringify(error?.response?.data));
    console.log('NOTIF ERROR MESSAGE:', error?.message);
    throw error;
  }
};

export const getUnreadCount = async (): Promise<number> => {
  const { data } = await axiosClient.get('/api/v1/notifications/unread-count');
  return data.data.count;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await axiosClient.patch(`/api/v1/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await axiosClient.patch('/api/v1/notifications/read-all');
};

export const clearAllNotifications = async (): Promise<void> => {
  await axiosClient.delete('/api/v1/notifications/clear-all');
};