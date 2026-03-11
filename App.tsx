import './src/shims/buffer';  // ← must be first line
import { Buffer } from 'buffer';



import './global.css';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import FontLoader from '@/context/FontLoader';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthProvider';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from './src/navigation/RootNavigation';
import Toast from 'react-native-toast-message';
import SplashScreenComponent from '@/screens/splash.screen';
import { AppModeProvider } from './src/context/ModeProvider';
import { getFcmToken, requestNotificationPermissions, syncFcmToken } from '@/domain/video/api/notifications.service';
import { createNotificationChannel, registerForegroundHandler } from '@/shared/utils/notificationHandler';

global.Buffer = global.Buffer || Buffer;

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise((res) => setTimeout(res, 1500));
        // await requestNotificationPermissions()

        await createNotificationChannel();
        await syncFcmToken()
        await getFcmToken()
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    const unsubscribe = registerForegroundHandler();
    return unsubscribe; // clean up on unmount
  }, []);

  if (!appReady) {
    return <SplashScreenComponent onFinish={() => setAppReady(true)} />;
  }

  return (
    <FontLoader>
      <NavigationContainer>
        <AppModeProvider>
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <RootNavigation />
              </View>
            </GestureHandlerRootView>
          </AuthProvider>
        </AppModeProvider>
      </NavigationContainer>
      <Toast />
    </FontLoader>
  );
}

// const styles = StyleSheet.create({

// })
