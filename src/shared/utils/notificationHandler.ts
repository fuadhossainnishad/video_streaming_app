import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Create Android notification channel
export const createNotificationChannel = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'General Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  }
};

// Display local notification banner (used for foreground FCM messages)
const displayLocalNotification = async (
  message: FirebaseMessagingTypes.RemoteMessage
): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: message.notification?.title ?? 'New Notification',
      body: message.notification?.body ?? '',
      data: message.data ?? {},
      sound: 'default',
    },
    trigger: null, // show immediately
  });
};

// Foreground handler — call inside useEffect, returns cleanup
export const registerForegroundHandler = (): (() => void) => {
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log('FCM foreground message:', remoteMessage);
    await displayLocalNotification(remoteMessage);
  });
  return unsubscribe;
};

// Background handler — must be called in index.js before registerRootComponent
export const registerBackgroundHandler = (): void => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('FCM background message:', remoteMessage);
    // FCM auto-displays — nothing extra needed
  });
};