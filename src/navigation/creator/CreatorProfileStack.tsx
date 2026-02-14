import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChannelOverviewScreen from '@/screens/Follow/ChannelOverview.screen';
import PrivacyPolicyScreen from '@/screens/Profile/PrivacyPolicy.screen copy';
import TermsAndConditionScreen from '@/screens/Profile/TermsAndCondition.screen';
import AboutUsScreen from '@/screens/Profile/AboutUs.screen';
import SettingsStack from '../SettingsStack';
import DownloadScreen from '@/screens/Profile/Download.screen';
import HistoryScreen from '@/screens/Profile/History.screen';
import CouponScreen from '@/screens/Profile/Coupon.screen';
import FollowingScreen from '@/screens/Profile/Following.screen';
import { ShortData } from '@/shared/types/shorts.types';
import ShortsScreen from '@/screens/Shorts/Shorts.screen';
import ShortsViewScreen from '@/screens/Shorts/ShortsView.screen';
import VideoPlayerScreen from '@/screens/Video/VideoPlayer.screen';
import SavedScreen from '@/screens/Profile/Saved.screen';
import CreatorProfileScreen from '@/screens/creator/CreatorProfile/CreatorProfile.screen';
import EditCreatorProfileScreen from '@/screens/creator/CreatorProfile/EditCreatorProfile.screen';


const Stack = createNativeStackNavigator();
export type CreatorProfileParamalist = {
  CreatorProfile: undefined;
  EditCreatorProfile: {
    username: string,
    email: string,
    avatar: string,
  }
  PivacyPolicy: undefined
  TermsAndConditions: undefined
  AboutUs: undefined
  Settings: undefined
  Saved: undefined
  Download: undefined
  History: undefined
  Coupon: undefined
  Following: undefined
  ChannelOverview: { channelId: string };
  VideoPlayer: { videoId: string };
  Shorts: { short: ShortData };
  ShortsView: { shortId: string };
};
export default function CreatorProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CeatorProfile" component={CreatorProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="EditCreatorProfile"
        component={EditCreatorProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewChannel"
        component={ChannelOverviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChannelOverview"
        component={ChannelOverviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Following"
        component={FollowingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Saved"
        component={SavedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Download"
        component={DownloadScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Coupon"
        component={CouponScreen}
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
