// components/Creator.tsx
import React from 'react';
import {
    Image,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChannelData } from '@/shared/types/channel.types';
import { useFollow } from '@/shared/hooks/useFollow';

interface CreatorProps {
    channelData: ChannelData;
    onPress?: () => void;
}

export default function Creator({
    channelData,
    onPress,
}: CreatorProps) {

    const {
        isFollowing,
        checking,
        loading,
        toggleFollow,
    } = useFollow(
        channelData?.id ?? '',
        0,
    );

    const handleFollowPress = (e: any) => {
        e.stopPropagation();
        toggleFollow();
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
                    </View>
                </View>

                {/* Follow Button */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleFollowPress}
                    disabled={loading || checking}
                    style={styles.followButtonContainer}
                >
                    <LinearGradient
                        colors={
                            isFollowing
                                ? ['#374151', '#4B5563', '#4B5563', '#374151']
                                : ['#282828', '#9BD71B', '#9BD71B', '#282828']
                        }
                        locations={[0.5, 1, 1, 0.5]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            styles.followButton,
                            (loading || checking) && styles.followButtonLoading,
                        ]}
                    >
                        {checking ? (
                            // Initial status check
                            <ActivityIndicator size="small" color="#9BD71B" />
                        ) : loading ? (
                            // Toggle in progress
                            <View className="flex-row items-center gap-2">
                                <ActivityIndicator
                                    size="small"
                                    color={isFollowing ? '#9CA3AF' : '#9BD71B'}
                                />
                                <Text className={`text-xs font-medium ${isFollowing ? 'text-gray-400' : 'text-[#9BD71B]'
                                    }`}>
                                    {isFollowing ? 'Unfollowing...' : 'Following...'}
                                </Text>
                            </View>
                        ) : (
                            <Text className={`text-sm font-bold ${isFollowing ? 'text-gray-400' : 'text-[#9BD71B]'
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
