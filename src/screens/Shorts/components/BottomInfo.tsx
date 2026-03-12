import { useFollow } from '@/shared/hooks/useFollow';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';

interface BottomInfoProps {
  username: string;
  avatar: string;
  title: string;
  description: string;
  views: number;
  timeAgo: string;
  hashtags: string[];
  channelId: string;
}

export default function BottomInfo({
  username,
  avatar,
  title,
  description,
  views,
  timeAgo,
  hashtags,
  channelId,
}: BottomInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // ─── Follow ───────────────────────────────────────────────────────────
  const {
    isFollowing,
    checking,   // ← initial status check
    loading,    // ← toggle in progress
    toggleFollow,
  } = useFollow(channelId, 0);

  return (
    <View>

      {/* User Info Row */}
      <View className="mb-3 flex-row items-center gap-2">
        <Image source={{ uri: avatar }} className="h-9 w-9 rounded-xl" />
        <Text className=" flex-1 text-base font-semibold text-white">
          {username}
        </Text>

        {/* Follow Button */}
        <TouchableOpacity
          disabled={loading || checking}
          onPress={toggleFollow}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              isFollowing
                ? ['#4B5563', '#4B5563']
                : ['#9BD71B', '#7CB518']
            }
            style={{
              borderRadius: 16,
              paddingHorizontal: 20,
              paddingVertical: 8,
              minWidth: 90,
              alignItems: 'center',
              opacity: loading || checking ? 0.7 : 1,
            }}
          >
            {checking || loading ? (
              <ActivityIndicator
                size="small"
                color={isFollowing ? '#9CA3AF' : '#000'}
              />
            ) : (
              <Text className="text-sm font-semibold text-black">
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text className="mb-1.5 text-base font-bold text-white">{title}</Text>

      {/* Description */}
      <Text
        className="mb-2 text-sm text-gray-200"
        numberOfLines={isExpanded ? undefined : 2}
      >
        {description}
      </Text>

      {/* Meta Info */}
      <View className="mb-1 flex-row flex-wrap items-center">
        <View className="mr-2 flex-row items-center">
          <Ionicons name="eye-outline" size={13} color="#9CA3AF" />
          <Text className="ml-1 text-xs text-gray-400">{views}</Text>
        </View>

        <Text className="mr-2 text-xs text-gray-400">•</Text>

        <View className="mr-2 flex-row items-center">
          <Ionicons name="time-outline" size={13} color="#9CA3AF" />
          <Text className="ml-1 text-xs text-gray-400">{timeAgo}</Text>
        </View>

        {hashtags?.length > 0 && (
          <>
            <Text className="mr-2 text-xs text-gray-400">•</Text>
            <Text className="text-xs font-medium text-blue-400">
              {hashtags.map(tag => `#${tag}`).join(' ')}
            </Text>
          </>
        )}
      </View>

      {/* See More */}
      {!isExpanded && description?.length > 60 && (
        <TouchableOpacity onPress={() => setIsExpanded(true)}>
          <Text className="text-xs font-semibold text-green-500">...See more</Text>
        </TouchableOpacity>
      )}

    </View>
  );
}