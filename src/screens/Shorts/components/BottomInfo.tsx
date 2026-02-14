import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface BottomInfoProps {
    username: string;
    avatar: string;
    title: string;
    description: string;
    views: number;
    timeAgo: string;
    hashtags: string[]
}
export default function BottomInfo({
    username,
    avatar,
    title,
    description,
    views,
    timeAgo,
    hashtags
}: BottomInfoProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View className="">
            {/* User Info */}
            <View className="flex-row items-center mb-3 gap-2">
                <Image
                    source={{ uri: avatar! }}
                    className="w-9 h-9 rounded-xl"
                />
                <Text className="text-white font-semibold text-base mr-2.5">
                    {username}
                </Text>
                <TouchableOpacity className="rounded-xl bg-green-500">
                    <LinearGradient
                        colors={['#282828', '#9BD71B1A']}
                        className="w-full px-7 py-2"
                    >
                        <Text className="text-white text-xl font-normal">Follow</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Title */}
            <Text className="text-white font-bold text-base mb-1.5">
                {title}
            </Text>

            {/* Description */}
            <Text
                className="text-gray-200 text-sm mb-2"
                numberOfLines={isExpanded ? undefined : 2}
            >
                {description}
            </Text>

            {/* Meta Info */}
            <View className="flex-row items-center flex-wrap mb-1">
                <View className="flex-row items-center mr-2">
                    <Ionicons name="eye-outline" size={13} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs ml-1">{views}</Text>
                </View>

                <Text className="text-gray-400 text-xs mr-2">•</Text>

                <View className="flex-row items-center mr-2">
                    <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs ml-1">{timeAgo}</Text>
                </View>

                <Text className="text-gray-400 text-xs mr-2">•</Text>

                <Text className="text-blue-400 text-xs font-medium">{hashtags}</Text>
            </View>

            {/* See More */}
            {!isExpanded && description.length > 60 && (
                <TouchableOpacity onPress={() => setIsExpanded(true)}>
                    <Text className="text-green-500 text-xs font-semibold">
                        ...See more
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}