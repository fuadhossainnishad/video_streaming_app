import { getAllChannels } from '@/domain/video/api/channel.service';
import { FollowParamalist } from '@/navigation/FollowStack';
import { ChannelData } from '@/shared/types/channel.types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = NativeStackNavigationProp<FollowParamalist>;

export default function FollowChannel() {
    const naviagtion = useNavigation<Props>();
    const [channels, setChannels] = useState<ChannelData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    console.log("channels:", channels)

    const fetchVideos = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const result = await getAllChannels()
            setChannels(result);
        } catch (err: any) {
            console.error('Error fetching channels:', err);
            setError(err.message || 'Failed to load channels');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleRefresh = useCallback(() => {
        fetchVideos(true);
    }, [fetchVideos]);
    const renderContent = () => {
        if (loading) {
            return (
                <View className="flex-1 justify-center items-center py-20">
                    <ActivityIndicator size="large" color="#9BD71B" />
                    <Text className="text-gray-400 mt-4">Loading videos...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View className="flex-1 justify-center items-center py-20">
                    <Text className="text-red-400 text-center mb-4">{error}</Text>
                    <TouchableOpacity
                        onPress={() => fetchVideos()}
                        className="bg-[#9BD71B] px-6 py-3 rounded-xl"
                    >
                        <Text className="text-black font-semibold">Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (channels.length === 0) {
            return (
                <View className="flex-1 justify-center items-center py-20">
                    <Text className="text-gray-400 text-center">
                        No channels available at the moment
                    </Text>
                </View>
            );
        }

        return (
            <>
                {channels.map((channel) => (
                    <TouchableOpacity key={channel.id} onPress={() => { naviagtion.navigate('ChannelOverview', { channelId: channel.id }) }}>
                        <View style={styles.channelContainer} className="items-center gap-2">
                            <Image source={{ uri: channel.avatar }} className="h-10 w-10 rounded-xl" resizeMode="cover" />
                            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.channelName}>
                                {channel.name}
                            </Text>
                        </View>
                    </TouchableOpacity>))}
            </>
        );
    };
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.channelScrollContent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor="#9BD71B"
                    colors={['#9BD71B']}
                />
            }
        >
            {renderContent()}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    channelScrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 16,
    },
    channelContainer: {
        alignItems: 'center',
        paddingHorizontal: 4,
        maxWidth: 'auto',
    },
    channelName: {
        width: 'auto',
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 16,
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 12,
    },
});
