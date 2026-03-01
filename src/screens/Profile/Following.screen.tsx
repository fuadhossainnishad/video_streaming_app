import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileParamalist } from '@/navigation/ProfileStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import { UIChannel } from '@/shared/utils/follow.utils';
import { getFollowingChannels } from '@/domain/video/api/follow.service';
import FollowableCreator from './FollowableCompo';

type Props = NativeStackNavigationProp<ProfileParamalist, 'Following'>;

export default function FollowingScreen() {
    const navigation = useNavigation<Props>();
    const [searchQuery, setSearchQuery] = useState('');
    const [follwing, setFollowing] = useState<UIChannel[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    console.log("following:", follwing)

    const fetchVideos = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const result = await getFollowingChannels(1, 10);
            console.log("result:", result)
            setFollowing(result.channels);
        } catch (err: any) {
            console.error('Error fetching following channels:', err);
            setError(err.message || 'Failed to load following channels');
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



    const handleSearch = useCallback(() => {
        if (searchQuery.trim()) {
            // TODO: Implement search functionality
            console.log('Searching for:', searchQuery);
        }
    }, [searchQuery]);

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

        if (follwing.length === 0) {
            return (
                <View className="flex-1 justify-center items-center py-20">
                    <Text className="text-gray-400 text-center">
                        No following channels available at the moment
                    </Text>
                </View>
            );
        }

        return (
            <>
                {follwing.map((creator) => (
                    <FollowableCreator
                        key={creator.id}
                        creator={creator}
                    />
                ))}
            </>
        );
    };

    return (
        <SafeAreaView
            edges={['top']}
            className='bg-black p-4 gap-4'
            style={styles.container}
        >
            <AppHeader title='Following' onPress={() => { navigation.goBack() }} />

            <ScrollView
                showsVerticalScrollIndicator={false}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        backgroundColor: 'black',
        gap: 12,
    },
});