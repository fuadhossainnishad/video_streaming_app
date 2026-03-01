import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ShortsModal from './ShortsModal';
import { useCallback, useEffect, useState } from 'react';
import { ShortData } from '@/shared/types/shorts.types';
import { getShortByChannel } from '@/domain/video/api/shorts.service';
import { useNavigation } from '@react-navigation/native';

export default function ChannelShortsCardComponent({ channelId }: { channelId: string }) {
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 48) / 2;
  const navigation = useNavigation<any>();
  const [shorts, setShorts] = useState<ShortData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('shorts:', shorts);

  const fetchShorts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result = await getShortByChannel(channelId, { page: 1, limit: 10 });
      console.log('fetched shorts:', result);
      setShorts(result.shorts);
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      setError(err.message || 'Failed to load videos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [channelId]);

  useEffect(() => {
    fetchShorts();
  }, [fetchShorts]);

  const handleRefresh = useCallback(() => {
    fetchShorts(true);
  }, [fetchShorts]);

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#9BD71B" />
          <Text className="mt-4 text-gray-400">Loading shorts...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="mb-4 text-center text-red-400">{error}</Text>
          <TouchableOpacity
            onPress={() => fetchShorts()}
            className="rounded-xl bg-[#9BD71B] px-6 py-3">
            <Text className="font-semibold text-black">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (shorts.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-center text-gray-400">No shorts available at the moment</Text>
        </View>
      );
    }

    return (
      <>
        <FlatList
          data={shorts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#9BD71B"
              colors={['#9BD71B']}
            />
          }
          renderItem={({ item }) => (
            <View style={{ width: itemWidth }}>
              <ShortsModal
                short={item}
                onPress={() => {
                  {
                    console.log('rendering short:', item);
                  }
                  navigation.navigate('ShortsView', { shortId: item.id });
                }}
              />
            </View>
          )}
        />
      </>
    );
  };

  return <>{renderContent()}</>;
}

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'black',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});