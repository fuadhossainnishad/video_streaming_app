// components/CreatorCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type CreatorCardProps = {
  avatar: string;
  name: string;
  followers: number;
  isFollowing: boolean;
  checking: boolean;
  loading: boolean;
  onToggle: () => void;
  onPress?: () => void;
};

export default function CreatorCard({
  avatar,
  name,
  followers,
  isFollowing,
  checking,
  loading,
  onToggle,
  onPress,
}: CreatorCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between rounded-2xl bg-white/15 p-3">

        {/* Left — Avatar + Info */}
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
              {followers?.toLocaleString()} Followers
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
          style={{ borderRadius: 16, overflow: 'hidden' }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={loading || checking}
            onPress={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            style={{
              minWidth: 100,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 24,
              paddingVertical: 10,
              opacity: loading || checking ? 0.7 : 1,
            }}
          >
            {checking || loading ? (
              <ActivityIndicator
                size="small"
                color={isFollowing ? '#9CA3AF' : '#9BD71B'}
              />
            ) : (
              <Text className={`text-base font-bold ${isFollowing ? 'text-gray-400' : 'text-[#9BD71B]'
                }`}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            )}
          </TouchableOpacity>
        </LinearGradient>

      </View>
    </TouchableOpacity>
  );
}