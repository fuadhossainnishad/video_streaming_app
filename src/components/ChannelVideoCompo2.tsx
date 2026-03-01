import { getChannelAllVideos } from '@/domain/video/api/video.service';
import { useCallback, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import VideoRender from './VideoRender';
import { VideoData } from '@/shared/types/video.types';
import { useNavigation } from '@react-navigation/native';

export default function ChannelVideoCardComponent({ channelId, vertical = false }: { channelId: string, vertical?: boolean }) {
  const navigation = useNavigation<any>();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log('videos:', videos);

  const fetchVideos = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result = await getChannelAllVideos(channelId, { page: 1, limit: 10 });
      setVideos(result.videos);
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      setError(err.message || 'Failed to load videos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [channelId]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleRefresh = useCallback(() => {
    fetchVideos(true);
  }, [fetchVideos]);

  const handleVideoPress = useCallback(
    (videoId: string) => {
      navigation.navigate('VideoPlayer', { videoId: videoId });
    },
    [navigation]
  );

  const handleVideoMenu = useCallback((videoId: string) => {
    console.log('Menu pressed for video:', videoId);
    // TODO: Implement menu actions (Share, Save, Report, etc.)
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#9BD71B" />
          <Text className="mt-4 text-gray-400">Loading videos...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="mb-4 text-center text-red-400">{error}</Text>
          <TouchableOpacity
            onPress={() => fetchVideos()}
            className="rounded-xl bg-[#9BD71B] px-6 py-3">
            <Text className="font-semibold text-black">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (videos.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-center text-gray-400">No videos available at the moment</Text>
        </View>
      );
    }

    return (
      <>
        {videos.map((video) => (
          <VideoRender
            key={video.id}
            videoData={video}
            onPress={() => handleVideoPress(video.id)}
            onMenuPress={() => handleVideoMenu(video.id)}
          />
        ))}
      </>
    );
  };
  if (vertical) {
    return <>{renderContent()}</>;
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#9BD71B"
          colors={['#9BD71B']}
        />
      }>
      {renderContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 24,
    gap: 16,
  },
});
