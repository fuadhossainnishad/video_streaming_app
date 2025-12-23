// components/CreatorCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type CreatorCardProps = {
  avatar?: ImageSourcePropType; // require() or { uri: ... }
  name: string;
  followers: string;
  bio?: string; // Not used in this compact version, but kept for future
  onFollow?: () => void;
};

export default function CreatorCard({ avatar, name, followers, onFollow }: CreatorCardProps) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-white/30 px-4 py-2 backdrop-blur-lg">
      <View className="flex-1 flex-row items-center gap-4">
        {avatar ? (
          <Image source={avatar} className="h-14 w-14 rounded-xl" resizeMode="cover" />
        ) : (
          <View className="h-14 w-14 rounded-xl bg-gray-400/50" />
        )}

        <View className="justify-center">
          <Text className="text-lg font-semibold text-white">{name}</Text>
          <Text className="text-sm text-white/60">{followers} Followers</Text>
        </View>
      </View>

      <LinearGradient
        colors={['#282828', '#9BD71B1A', '#9BD71B1A', '#282828']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="overflow-hidden rounded-2xl shadow">
        <TouchableOpacity onPress={onFollow} activeOpacity={0.8} className="px-8 py-2.5">
          <Text className="text-center text-base font-bold text-[#9BD71B]">Follow</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
