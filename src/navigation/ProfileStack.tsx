import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationScreen from '@/screens/Notification/Notification.screen';
import HomeScreen2 from '@/screens/Home/Home.screen2';
import SearchScreen from '@/screens/Home/Search.screen';
import DiscoverCreatorScreen from '@/screens/Home/DiscoverCreator.screen';
import ShortsScreen from '@/screens/Shorts/Shorts.screen';
import FollowScreen from '@/screens/Follow/Follow.screen';
import ChannelOverviewScreen from '@/screens/Follow/ChannelOverview.screen';
// import OnboardingScreen from '../screens/Onboarding/onboarding.screen';
// import AuthScreen from '@/screens/Auth/login.screen';
// import VerifyOtpScreen from '@/screens/Auth/verifyOtp.screen';
// import VerifyOtp2Screen from '@/screens/Auth/verifyOtp2.screen';
// import SendOtpScreen from '@/screens/Auth/sendOtp.screen';
// import resetPasswordScreen from '@/screens/Auth/resetPassword.screen';

const Stack = createNativeStackNavigator();
export type ProfileParamalist = {
  Follow: undefined;
  ChannelOverview: undefined;
};
export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Onboarding">
        {(props) => <OnboardingScreen {...props} onFinish={onFinish} />}
      </Stack.Screen> */}
      <Stack.Screen name="Profile" component={FollowScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ChannelOverview"
        component={ChannelOverviewScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} /> */}
      {/* <Stack.Screen
        name="DiscoverCreator"
        component={DiscoverCreatorScreen}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="VerifyOtp2"
        component={VerifyOtp2Screen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SendOtp" component={SendOtpScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ResetPassword"
        component={resetPasswordScreen}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
}
