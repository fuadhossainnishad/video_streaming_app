import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import TimeIcon from '../../assets/icons/time.svg';
import Report from '../../assets/icons/report2.svg'
import Comment from '../../assets/icons/comments3.svg'
import { NotificationItem } from '@/shared/types/notification.types';

interface NotificationModalProps {
    notification: NotificationItem
    onPress: () => void;
}

export default function CreatorNotificationModal({ notification, onPress }: NotificationModalProps) {
    const renderTypeIcon = () => {
        switch (notification.type) {
            case 'upload':
                return <Comment height={24} width={24} />;
            case 'comment':
                return <Comment height={24} width={24} />;
            case 'report':
                return <Report height={24} width={24} />;
            default:
                return null;
        }
    };
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            className="flex-row items-start bg-white/20 rounded-xl p-4 gap-2"
        >
            <View className="">
                {renderTypeIcon()}
            </View>

            <View className="flex-1">
                <View className="text-white text-base leading-6 flex-col gap-1">
                    <Text className="text-white font-semibold text-base">{notification.title}</Text>
                    <Text className="font-medium text-white/70  text-sm text-wrap">{notification.details}</Text>
                </View>
                <View className='flex-row items-center gap-2'>
                    <TimeIcon height={24} width={24} />
                    <Text className="text-white text-sm">{notification.timeAgo}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}