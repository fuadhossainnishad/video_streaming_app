import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import TimeIcon from '../../assets/icons/time.svg';
interface NotificationItemProps {
    channelAvatar: any; // require('../../assets/poster/channel.png')
    channelName: string;
    action: string; // e.g., "Uploaded:"
    videoTitle: string;
    timeAgo: string;
    thumbnail?: any; // Optional video thumbnail
    onPress?: () => void;
}

export default function NotificationModal({
    channelAvatar,
    channelName = 'CatWorld TV',
    action = 'Uploaded:',
    videoTitle = 'Top 10 AI Tools You Need in 2025',
    timeAgo = '1 day ago',
    thumbnail,
    onPress,
}: NotificationItemProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            className="flex-row items-start bg-white/20 rounded-xl p-4 gap-2"
        >
            <View className="">
                <Image
                    source={channelAvatar}
                    className="w-12 h-12 rounded-xl"
                    resizeMode="cover"
                />
            </View>

            <View className="flex-1">
                <View className="text-white text-base leading-6 flex-col gap-1">
                    <Text className="text-white font-semibold text-base">{channelName}</Text>
                    <Text className="font-medium text-white/70  text-sm text-wrap">Uploaded: {videoTitle}</Text>
                </View>
                <View className='flex-row items-center gap-2'>
                    <TimeIcon height={24} width={24} />
                    <Text className="text-white text-sm">{timeAgo}</Text>
                </View>
            </View>

            {thumbnail && (
                <View className='rounded-lg flex-1 h-24'>
                    <Image
                        source={thumbnail}
                        className="h-full w-full rounded-lg"
                        resizeMode='cover'
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}