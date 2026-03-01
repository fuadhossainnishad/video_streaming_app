import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type CreatorCardProps = {
  avatar: string;
  name: string;
  followers: number;
  isFollowing: boolean;
  loading: boolean;
  onToggle: () => void;
};

export default function CreatorCard({
  avatar,
  name,
  followers,
  isFollowing,
  loading,
  onToggle,
}: CreatorCardProps) {
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
            {followers} Followers
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
          onPress={onToggle}
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
              {isFollowing ? 'Unfollowing' : 'Unfollow'}
            </Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}