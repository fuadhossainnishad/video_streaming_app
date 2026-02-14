import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FollowScreen from '@/screens/Follow/Follow.screen';
import ChannelProfileScreen from '@/screens/Follow/ChannelOverview.screen';
import VideoPlayerScreen from '@/screens/Video/VideoPlayer.screen';
import ShortsScreen from '@/screens/Shorts/Shorts.screen';
import ShortsViewScreen from '@/screens/Shorts/ShortsView.screen';
import { ShortData } from '@/shared/types/shorts.types';
// import OnboardingScreen from '../screens/Onboarding/onboarding.screen';
// import AuthScreen from '@/screens/Auth/login.screen';
// import VerifyOtpScreen from '@/screens/Auth/verifyOtp.screen';
// import VerifyOtp2Screen from '@/screens/Auth/verifyOtp2.screen';
// import SendOtpScreen from '@/screens/Auth/sendOtp.screen';
// import resetPasswordScreen from '@/screens/Auth/resetPassword.screen';

const Stack = createNativeStackNavigator();
export type FollowParamalist = {
  Follow: undefined;
  ChannelOverview: { channelId: string };
  VideoPlayer: { videoId: string };
  Shorts: { short: ShortData };
  ShortsView: { shortId: string };
};
export default function FollowStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Onboarding">
        {(props) => <OnboardingScreen {...props} onFinish={onFinish} />}
      </Stack.Screen> */}
      <Stack.Screen name="Follow" component={FollowScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ChannelOverview"
        component={ChannelProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Shorts"
        component={ShortsScreen}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="ShortsView"
        component={ShortsViewScreen}
        options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
