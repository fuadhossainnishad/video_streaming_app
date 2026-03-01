// components/CreatorCard.tsx

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { toggleFollow } from '@/domain/video/api/follow.service';

type CreatorCardProps = {
  channelId: string;
  avatar: string;
  name: string;
  followers: number;
  initialFollowing?: boolean;
  onFollow?: (isFollowing: boolean) => void;
};

export default function FollowingCreatorCard({
  channelId,
  avatar,
  name,
  followers,
  initialFollowing = false,
  onFollow,
}: CreatorCardProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [followersCount, setFollowersCount] = useState(followers);
  const [loading, setLoading] = useState(false);

  const handleFollowPress = useCallback(async () => {
    if (loading) return;

    // ✅ Save previous state for rollback
    const previousFollowing = isFollowing;
    const previousCount = followersCount;

    // ✅ Optimistic UI update
    const optimisticFollowing = !previousFollowing;

    setIsFollowing(optimisticFollowing);
    setFollowersCount((prev) =>
      optimisticFollowing ? prev + 1 : prev - 1
    );

    setLoading(true);

    try {
      const response = await toggleFollow(channelId);

      const serverState = response?.data?.isFollowing;

      // ✅ Sync with backend truth
      if (typeof serverState === 'boolean' && serverState !== optimisticFollowing) {
        setIsFollowing(serverState);
        setFollowersCount((prev) =>
          serverState ? prev + 1 : prev - 1
        );
      }

      onFollow?.(serverState ?? optimisticFollowing);
    } catch (error: any) {
      // 🔁 Rollback on error
      setIsFollowing(previousFollowing);
      setFollowersCount(previousCount);

      Alert.alert(
        'Error',
        error?.message ?? 'Failed to update follow status'
      );
    } finally {
      setLoading(false);
    }
  }, [channelId, loading, isFollowing, followersCount, onFollow]);

  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-white/15 p-3 backdrop-blur-lg">

      {/* Left Section */}
      <View className="flex-1 flex-row items-center gap-4">
        <Image
          source={{ uri: avatar }}
          className="h-14 w-14 rounded-xl"
          resizeMode="cover"
        />

        <View>
          <Text className="text-lg font-semibold text-white">
            {name}
          </Text>
          <Text className="text-sm text-white/60">
            {followersCount} Followers
          </Text>
        </View>
      </View>

      {/* Follow Button */}
      <LinearGradient
        colors={
          isFollowing
            ? ['#374151', '#4B5563', '#4B5563', '#374151']
            : ['#282828', '#9BD71B1A', '#9BD71B1A', '#282828']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="overflow-hidden rounded-2xl"
      >
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={loading}
          onPress={handleFollowPress}
          className="min-w-[100px] items-center justify-center px-6 py-2.5"
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={isFollowing ? '#9CA3AF' : '#9BD71B'}
            />
          ) : (
            <Text
              className={`text-base font-bold ${isFollowing ? 'text-gray-400' : 'text-[#9BD71B]'
                }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}