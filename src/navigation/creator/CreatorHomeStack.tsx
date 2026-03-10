import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationScreen from '@/screens/Notification/Notification.screen';
import HomeScreen2 from '@/screens/Home/Home.screen2';
import SearchScreen from '@/screens/Home/Search.screen';
import DiscoverCreatorScreen from '@/screens/Home/DiscoverCreator.screen';
import VideoPlayerScreen from '@/screens/Video/VideoPlayer.screen';
import ChannelProfileScreen from '@/screens/Follow/ChannelOverview.screen';
import CreatorHomeScreen from '@/screens/creator/Home/CreatorHome.screen';
import CreatorNotificationScreen from '@/screens/creator/Notification/CreatorNotification.screen';
import CreatorNotificationDetailsScreen from '@/screens/creator/Notification/CreatorNotificationDetails.screen';
// import OnboardingScreen from '../screens/Onboarding/onboarding.screen';
// import AuthScreen from '@/screens/Auth/login.screen';
// import VerifyOtpScreen from '@/screens/Auth/verifyOtp.screen';
// import VerifyOtp2Screen from '@/screens/Auth/verifyOtp2.screen';
// import SendOtpScreen from '@/screens/Auth/sendOtp.screen';
// import resetPasswordScreen from '@/screens/Auth/resetPassword.screen';

const Stack = createNativeStackNavigator();
export type CreatorHomeParamalist = {
  CreatorNotification: undefined;
  CreatorNotificationDetails: { details: string, receivedReports: number, timeago: string }
  CreatorHome: undefined;
  Search: undefined;
  DiscoverCreator: undefined;
  VideoPlayer: { videoId: string };
  ChannelOverview: { channelId: string };
};
export default function CreatorHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Onboarding">
        {(props) => <OnboardingScreen {...props} onFinish={onFinish} />}
      </Stack.Screen> */}
      <Stack.Screen name="CreatorHome" component={CreatorHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreatorNotificationDetails" component={CreatorNotificationDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="CreatorNotification"
        component={CreatorNotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="DiscoverCreator"
        component={DiscoverCreatorScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChannelOverview"
        component={ChannelProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={CreatorNotificationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
