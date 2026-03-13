import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import Arrow from '../../assets/icons/arrow.svg';
import Creator from './Creator'; // Adjust path as needed
import { getAllChannels } from '@/domain/video/api/channel.service';
import { ChannelData } from '@/shared/types/channel.types';
import { HomeParamalist } from '@/navigation/HomeStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackNavigationProp<HomeParamalist>;

export default function TopCreator() {
    const navigation = useNavigation<Props>();
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
            console.log("Channel data fetched:", result);

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
                    <Creator
                        key={channel.id}
                        channelData={channel}
                    // onPress={() => navigation.navigate('ChannelOverview', { channel: channel })}
                    />
                ))}
            </>
        );
    };

    return (
        <View className="my-3">
            <View className="flex-row justify-between items-center">
                <Text className="text-xl font-semibold text-white">
                    Top creators you might like
                </Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('DiscoverCreator')}
                    className="flex-row items-center gap-2">
                    <Text className="text-base font-medium text-[#9BD71B]">
                        View All
                    </Text>
                    <Arrow height={20} width={20} fill="#9BD71B" />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
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
        </View>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        paddingRight: 16,
        paddingVertical: 12,
        gap: 12
    },

});