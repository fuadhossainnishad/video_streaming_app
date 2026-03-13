import React, { useCallback, useEffect } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { COMMENT_NOTIFICATION_TYPES } from '@/shared/utils/notification.utils';
import NotificationItem from '../Notification/components/NotificationItem';
import { Notification } from '@/shared/types/notification.types';

export default function CommentsNotificationsScreen() {
    const {
        notifications,
        filteredUnreadCount,
        loading,
        loadingMore,
        refreshing,
        error,
        refresh,
        loadMore,
        markAsRead,
        markAllAsRead,
    } = useNotifications({ filter: COMMENT_NOTIFICATION_TYPES });

    // Refresh when new FCM message arrives while screen is open
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async () => refresh());
        return unsubscribe;
    }, [refresh]);

    const handlePress = useCallback((notification: Notification) => {
        if (!notification.isRead) markAsRead(notification._id);
    }, [markAsRead]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator style={styles.loader} color="#9BD71B" size="large" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text style={styles.emptyIcon}>⚠️</Text>
                    <Text style={styles.emptyTitle}>Failed to load</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={refresh}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text className=" text-2xl font-bold text-white">Comments</Text>
                    {filteredUnreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {filteredUnreadCount > 99 ? '99+' : filteredUnreadCount}
                            </Text>
                        </View>
                    )}
                </View>
                {filteredUnreadCount > 0 && (
                    <TouchableOpacity onPress={markAllAsRead}>
                        <Text style={styles.actionText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <NotificationItem notification={item} onPress={handlePress} />
                )}
                onRefresh={refresh}
                refreshing={refreshing}
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                    loadingMore ? (
                        <ActivityIndicator style={styles.footerLoader} color="#9BD71B" size="small" />
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={styles.emptyIcon}>💬</Text>
                        <Text style={styles.emptyTitle}>No comment activity</Text>
                        <Text style={styles.emptyMessage}>
                            New comments, replies and mentions on your content will appear here.
                        </Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={notifications.length === 0 ? styles.emptyList : undefined}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#17191A' },
    loader: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        // borderBottomWidth: 1,
        // borderBottomColor: '#1F2937',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
    badge: {
        backgroundColor: '#EF4444',
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
    },
    badgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
    actionText: { fontSize: 13, color: '#9BD71B', fontWeight: '500' },
    footerLoader: { paddingVertical: 20 },
    emptyList: { flex: 1 },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        gap: 12,
        paddingTop: 80,
    },
    emptyIcon: { fontSize: 48 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' },
    emptyMessage: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
    retryButton: {
        backgroundColor: '#9BD71B',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 8,
    },
    retryText: { fontSize: 14, fontWeight: '600', color: '#000000' },
});