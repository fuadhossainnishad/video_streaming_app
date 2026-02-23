import { getUniqueId } from 'react-native-device-info';
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { getFcmToken, registerTokenToServer, requestNotificationPermissions } from '@/domain/video/api/notifications.service';

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