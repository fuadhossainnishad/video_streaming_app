import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChannelProfileScreen from '@/screens/Follow/ChannelOverview.screen';
import ShortsScreen from '@/screens/Shorts/Shorts.screen';
import { ShortData } from '@/shared/types/shorts.types';
import HubScreen from '../../screens/creator/Hub/Hub.screen';
import CreateVideoScreen from '@/screens/creator/Hub/Createvideo.screen';
import CreateShortsScreen from '@/screens/creator/Hub/CreateShorts.screen';
import CreatePostScreen from '@/screens/creator/Hub/CreatePost.screen';
import CreatorVideoPlayerScreen from '@/screens/creator/Hub/CreatorVideoPlayer.screen';
import CreatorShortsViewScreen from '@/screens/creator/Hub/CreatorShortsView.screen';
import EditPostScreen from '@/screens/creator/Hub/EditPost.scren';


const Stack = createNativeStackNavigator();
export type HubParamalist = {
  Hub: undefined;
  CreateVideo: undefined;
  CreateShorts: undefined;
  CreatePost: undefined;
  ChannelOverview: { channelId: string };
  VideoPlayer: { videoId: string };
  Shorts: { short: ShortData };
  ShortsView: { shortId: string };
  EditPost: { postId: string };

};
export default function HubStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Onboarding">
        {(props) => <OnboardingScreen {...props} onFinish={onFinish} />}
      </Stack.Screen> */}
      <Stack.Screen name="Hub" component={HubScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="CreateVideo"
        component={CreateVideoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateShorts"
        component={CreateShortsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChannelOverview"
        component={ChannelProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoPlayer"
        component={CreatorVideoPlayerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Shorts" component={ShortsScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ShortsView"
        component={CreatorShortsViewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditPost"
        component={EditPostScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
