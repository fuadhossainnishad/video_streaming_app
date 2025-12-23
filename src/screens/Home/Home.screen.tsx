import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import VideoRender from '@/components/VideoRender';
import AppHeader from '@/components/AppHeader';

type AuthStackParamList = {
  Auth: undefined;
  HomeScreen: undefined;
};

type Props = NativeStackNavigationProp<AuthStackParamList, 'HomeScreen'>;

export default function HomeScreen({
  navigation,
  onFinish,
}: {
  navigation: Props;
  onFinish: () => void;
}) {

  const channels = [
    { id: '1', name: 'CatWorld TV', image: require('../../../assets/poster/channel.png') },
    { id: '2', name: 'Doggy Vlogs', image: require('../../../assets/poster/channel.png') },
    { id: '3', name: 'Funny Pets Daily', image: require('../../../assets/poster/channel.png') },
    { id: '4', name: 'Pet Adventures', image: require('../../../assets/poster/channel.png') },
    { id: '1', name: 'CatWorld TV', image: require('../../../assets/poster/channel.png') },
    { id: '2', name: 'Doggy Vlogs', image: require('../../../assets/poster/channel.png') },
    { id: '3', name: 'Funny Pets Daily', image: require('../../../assets/poster/channel.png') },
    { id: '4', name: 'Pet Adventures', image: require('../../../assets/poster/channel.png') },
  ];

  return (
    <View className="flex-1 bg-[#17191A]">
      <View>
        <AppHeader title="Channel Overview" onPress={() => navigation.goBack()} />
      </View>
      <View>
        <View className="flex-row gap-3 items-center">
          <Image
            source={require('../../../assets/poster/profile.jpg')}
            className="h-28 w-28 rounded-2xl"
            resizeMode="cover"
          />
          <View className="gap-1">
            <Text className="text-lg font-semibold text-white">Lukas Wagner</Text>
            <Text className="text-base font-semibold text-white/70">Lukas Wagner</Text>
            <View className="flex-row gap-1 items-center">
              <Text className="text-base font-semibold text-white/70">Lukas Wagner</Text>
              <Text className="text-base font-extrabold text-white/70">|</Text>

              <Text className="text-base font-semibold text-white/70">Lukas Wagner</Text>
            </View>
          </View>
        </View>
        <Text

        >Lorem ipsum dolor sit amet consectetur. Ultrices id feugiat venenatis habitant ...more</Text>
      </View>

      <Text className="mt-4 px-4 pb-4 text-xl font-bold text-white">Most Relevant</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <VideoRender />
        <VideoRender />
        <VideoRender />
        <VideoRender />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  channelScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  channelContainer: {
    alignItems: 'center',
    paddingHorizontal: 4,
    maxWidth: 'auto'
  },
  channelName: {
    width: 'auto',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 16,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
});