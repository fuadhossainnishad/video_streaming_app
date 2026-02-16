import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface BottomInfoProps {
  username: string;
  avatar: string;
  title: string;
  description: string;
  views: number;
  timeAgo: string;
  hashtags: string[];
}
export default function BottomInfo({
  username,
  avatar,
  title,
  description,
  views,
  timeAgo,
  hashtags,
}: BottomInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="">
      {/* User Info */}
      <View className="mb-3 flex-row items-center gap-2">
        <Image source={{ uri: avatar! }} className="h-9 w-9 rounded-xl" />
        <Text className="mr-2.5 text-base font-semibold text-white">{username}</Text>

        <LinearGradient
          colors={['#9BD71B1A', '#9BD71B1A']}
          style={{
            borderWidth: 1,
            borderColor: '#9BD71B',
            borderRadius: 16,
          }}
          className="w-fit rounded-xl px-7 py-2">
          <TouchableOpacity className="rounded-xl">
            <Text className="text-xl font-normal text-white">Follow </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Title */}
      <Text className="mb-1.5 text-base font-bold text-white">{title}</Text>

      {/* Description */}
      <Text className="mb-2 text-sm text-gray-200" numberOfLines={isExpanded ? undefined : 2}>
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

        <Text className="mr-2 text-xs text-gray-400">•</Text>

        <Text className="text-xs font-medium text-blue-400">{hashtags}</Text>
      </View>

      {/* See More */}
      {!isExpanded && description.length > 60 && (
        <TouchableOpacity onPress={() => setIsExpanded(true)}>
          <Text className="text-xs font-semibold text-green-500">...See more</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
