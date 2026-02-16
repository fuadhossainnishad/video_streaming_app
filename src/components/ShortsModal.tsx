// components/ShortsModal.tsx
import { Image, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import ViewIcon from '../../assets/icons/view.svg';
import { ShortData } from '@/shared/types/shorts.types';
import { useState, useEffect } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';

export interface ShortsModalProps {
  short: ShortData;
  onPress: () => void;
}

export default function ShortsModal({ short, onPress }: ShortsModalProps) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const player = useVideoPlayer(short.videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.pause(); // Start paused
  });

  // Listen for player ready state
  useEffect(() => {
    if (!player) return;

    const subscription = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay' && !isVideoReady) {
        setIsVideoReady(true);
      }
      if (status.status === 'error') {
        console.error('Video error:', status.error);
        setHasError(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View className="overflow-hidden rounded-3xl bg-[#FFFFFF1A]">
        <View className="relative h-80 w-full">
          {/* Video Preview */}
          {!hasError ? (
            <View className="h-full w-full rounded-2xl">
              <VideoView
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                }}
                player={player}
                allowsFullscreen={false}
                allowsPictureInPicture={false}
                nativeControls={false}
              />

              {/* Loading overlay */}
              {!isVideoReady && (
                <View className="absolute inset-0 items-center justify-center rounded-2xl bg-[#1C1C1E]">
                  <ActivityIndicator size="small" color="#9BD71B" />
                </View>
              )}
            </View>
          ) : (
            // Fallback on error
            <View className="h-full w-full items-center justify-center rounded-2xl bg-[#1C1C1E]">
              <Image
                source={{ uri: short.channelIcon }}
                className="h-20 w-20 rounded-xl opacity-50"
                resizeMode="cover"
              />
              <Text className="mt-2 text-xs text-gray-500">Video unavailable</Text>
            </View>
          )}

          {/* Gradient overlay for better visibility */}
          <View className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-2xl bg-gradient-to-t from-black/70 to-transparent" />

          {/* Play icon overlay */}
          <View className="pointer-events-none absolute inset-0 items-center justify-center">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <View className="ml-1 h-0 w-0 border-b-[12px] border-l-[20px] border-t-[12px] border-b-transparent border-l-white border-t-transparent" />
            </View>
          </View>

          {/* Bottom Overlay */}
          <View className="absolute bottom-3 left-3 right-3 flex-row items-center justify-between">
            {/* Left: Channel Avatar */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                // Navigate to channel
              }}>
              <Image
                source={{ uri: short.channelIcon }}
                className="h-12 w-12 rounded-xl border-2 border-white/30"
                resizeMode="cover"
              />
            </TouchableOpacity>

            {/* Right: View Count Badge */}
            <View className="flex-row items-center rounded-xl bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <ViewIcon height={20} width={20} />
              <Text className="ml-1.5 text-base font-semibold text-white">
                {short.views?.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
