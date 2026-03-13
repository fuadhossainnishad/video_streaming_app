import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface BottomInfoProps {
    username: string;
    avatar: string;
    title: string;
    description: string;
    views: number;
    timeAgo: string;
    hashtags: string[];
    channelId: string;
    onSheetOpen: () => void
}

export default function BottomInfo({
    title,
    description,
    views,
    timeAgo,
    hashtags,
    onSheetOpen
}: BottomInfoProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <TouchableOpacity onPress={onSheetOpen}>


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
                <TouchableOpacity onPress={onSheetOpen}>
                    <Text className="text-xs font-semibold text-green-500">...See description</Text>
                </TouchableOpacity>
            )}

        </TouchableOpacity>
    );
}