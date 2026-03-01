// components/Creator-Optimistic.tsx
// Version with optimistic updates for better UX
import React, { useState } from 'react';
import {
    Image,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChannelData } from '@/shared/types/channel.types';
import { toggleFollow } from '@/domain/video/api/follow.service';

interface CreatorProps {
    channelData: ChannelData;
    onPress?: () => void;
    initialFollowing?: boolean;
    onFollowChange?: (isFollowing: boolean) => void;
}

export default function Creator({
    channelData,
    onPress,
    initialFollowing = false,
    onFollowChange,
}: CreatorProps) {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [loading, setLoading] = useState(false);
    // const [followersCount, setFollowersCount] = useState(channelData?.totalfollowers || 0);

    const handleFollowPress = async (e: any) => {
        e.stopPropagation();

        if (loading) return;

        // Optimistic update
        const previousState = isFollowing;
        // const previousCount = followersCount;

        setIsFollowing(!isFollowing);
        // setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
        setLoading(true);

        try {
            const response = await toggleFollow(channelData.id);

            // Confirm state from server
            setIsFollowing(response.data.isFollowing);

            // Notify parent component
            onFollowChange?.(response.data.isFollowing);
        } catch (error: any) {
            // Revert on error
            setIsFollowing(previousState);
            // setFollowersCount(previousCount);

            Alert.alert('Error', error.message || 'Failed to update follow status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View className="items-center justify-between gap-2 rounded-2xl p-4">
                {/* Avatar and Info */}
                <View className="items-center gap-4">
                    <Image
                        source={{ uri: channelData.avatar }}
                        className="h-14 w-14 rounded-xl"
                        resizeMode="cover"
                    />
                    <View>
                        <Text className="text-center text-lg font-semibold text-white">
                            {channelData.name}
                        </Text>
                        {/* <Text className="text-center text-sm text-gray-400">
                            {followersCount.toLocaleString()} Followers
                        </Text> */}
                    </View>
                </View>

                {/* Follow Button */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleFollowPress}
                    disabled={loading}
                    style={styles.followButtonContainer}>
                    <LinearGradient
                        colors={
                            isFollowing
                                ? ['#374151', '#4B5563', '#4B5563', '#374151']
                                : ['#282828', '#9BD71B', '#9BD71B', '#282828']
                        }
                        locations={[0.5, 1, 1, 0.5]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.followButton, loading && styles.followButtonLoading]}>
                        {loading ? (
                            <View className="flex-row items-center gap-2">
                                <ActivityIndicator size="small" color={isFollowing ? '#9CA3AF' : '#9BD71B'} />
                                <Text
                                    className={`text-xs font-medium ${isFollowing ? 'text-gray-400' : 'text-[#9BD71B]'
                                        }`}>
                                    {isFollowing ? 'Unfollowing...' : 'Following...'}
                                </Text>
                            </View>
                        ) : (
                            <Text
                                className={`text-sm font-bold ${isFollowing ? 'text-gray-400' : 'text-[#9BD71B]'
                                    }`}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    followButtonContainer: {
        overflow: 'hidden',
        borderRadius: 10,
    },
    followButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 10,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    followButtonLoading: {
        paddingHorizontal: 12,
    },
});