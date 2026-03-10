import { Notification } from '@/shared/types/notification.types';
import { formatNotificationTime, getNotificationColor, getNotificationIcon } from '@/shared/utils/notification.utils';
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


interface Props {
    notification: Notification;
    onPress: (notification: Notification) => void;
}

const NotificationItem = ({ notification, onPress }: Props) => {
    const icon = getNotificationIcon(notification.type);
    const color = getNotificationColor(notification.type);

    return (
        <TouchableOpacity
            style={[styles.container, !notification.isRead && styles.unread]}
            onPress={() => onPress(notification)}
            activeOpacity={0.7}>
            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Text style={styles.icon}>{icon}</Text>
                {!notification.isRead && (
                    <View style={[styles.unreadDot, { backgroundColor: color }]} />
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
                    <Text style={styles.time}>
                        {formatNotificationTime(notification.createdAt)}
                    </Text>
                </View>
                <Text style={styles.message} numberOfLines={2}>
                    {notification.message}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default memo(NotificationItem);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
    },
    unread: {
        backgroundColor: '#1a1f2e',
    },
    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        flexShrink: 0,
    },
    icon: {
        fontSize: 20,
    },
    unreadDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#17191A',
    },
    content: {
        flex: 1,
        gap: 4,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
    },
    time: {
        fontSize: 11,
        color: '#6B7280',
        flexShrink: 0,
    },
    message: {
        fontSize: 13,
        color: '#9CA3AF',
        lineHeight: 18,
    },
});