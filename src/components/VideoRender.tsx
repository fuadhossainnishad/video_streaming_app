// components/VideoRender.tsx
import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import ViewIcon from '../../assets/icons/view.svg';
import TimeIcon from '../../assets/icons/time.svg';
import ThreeDotIcon from '../../assets/icons/threeDot.svg';
import { VideoData } from '../shared/types/video.types';

export interface VideoRenderProps {
  onPress: () => void;
  videoData?: VideoData
  onMenuPress?: () => void;
}

export default function VideoRender({
  onPress,
  videoData,
  onMenuPress,
}: VideoRenderProps) {
  if (!videoData) {
    return null;
  }

  const displayDuration = videoData.currentTime
    ? `${videoData.currentTime} / ${videoData.duration}`
    : videoData.duration;

  const handleMenuPress = (e: any) => {
    e.stopPropagation();
    onMenuPress?.();
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View className="gap-2 overflow-hidden rounded-3xl bg-[#FFFFFF1A]">
        {/* Video Thumbnail */}
        <View className="relative">
          <Image
            source={{ uri: videoData.thumbnailUrl }}
            className="h-80 w-full rounded-2xl"
            resizeMode="cover"
          />

          {/* Duration Badge */}
          <View className="absolute bottom-2 right-2 rounded-xl bg-black/60 px-2 py-1.5">
            <Text className="text-sm font-semibold text-white">
              {displayDuration}
            </Text>
          </View>

          {/* Three Dot Menu */}
          <View className="absolute right-2 top-3">
            <TouchableOpacity
              onPress={handleMenuPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ThreeDotIcon height={50} width={50} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Video Info */}
        <View className="flex-row items-center gap-2 p-3">
          {/* Channel Avatar */}
          <Image
            source={{ uri: videoData.channelAvatarUrl }}
            className="h-12 w-12 rounded-xl"
            resizeMode="cover"
          />

          {/* Video Details */}
          <View className="flex-1 gap-1">
            <Text
              className="text-base font-semibold leading-5 text-white"
              numberOfLines={2}
            >
              {videoData.title}
            </Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-400" numberOfLines={1}>
                {videoData.channelName}
              </Text>

              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1">
                  <ViewIcon height={20} width={20} />
                  <Text className="text-xs text-gray-400">
                    {videoData.views}
                  </Text>
                </View>

                <View className="flex-row items-center gap-1">
                  <TimeIcon height={20} width={20} />
                  <Text className="text-xs text-gray-400">
                    {videoData.timeAgo}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}