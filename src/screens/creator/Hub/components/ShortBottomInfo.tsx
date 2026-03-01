import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface BottomInfoProps {
    username: string;
    avatar: string;
    title: string;
    description: string;
    views: number;
    timeAgo: string;
    hashtags: string[]
}
export default function ShortBottomInfo({
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