import AppHeader from '@/components/AppHeader';
import CreatorCard from '@/components/CreatorCard';
import CreatorCardWithFollow from '@/components/CreatorCardWithFollow';
import { getAllDiscoveryChannels } from '@/domain/video/api/channel.service';
import { HomeParamalist } from '@/navigation/HomeStack';
import { DiscoveryChannelData } from '@/shared/types/channel.types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackNavigationProp<HomeParamalist, 'DiscoverCreator'>;

export default function DiscoverCreatorScreen() {
  const navigation = useNavigation<Props>();
  const [channels, setChannels] = useState<DiscoveryChannelData[]>([]);
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

      const result = await getAllDiscoveryChannels()
      console.log("discovery channel:", result)
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
          <CreatorCardWithFollow
            key={channel.id}
            channel={channel}

          />))}
      </>
    );
  };
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className="flex-1 bg-black px-4 gap-4">
      <AppHeader title="Discover Creators" onPress={() => { navigation.goBack() }} />
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
}


const styles = StyleSheet.create({
  scrollViewContent: {
    backgroundColor: 'black',
    gap: 8,
  },
});
