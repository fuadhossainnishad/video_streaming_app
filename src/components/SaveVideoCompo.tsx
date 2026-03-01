import { useCallback } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useSavedContent } from '@/shared/hooks/useSavedContent';

export default function SaveVideoCardComponent({ vertical = false }: { vertical?: boolean }) {
  const navigation = useNavigation<any>();
  const {
    videos,
    loading,
    refreshing,
    error,
    refresh,
  } = useSavedContent();
  console.log("SaveVideoCardComponent:", videos)
  // const fetchVideos = useCallback(async (isRefresh = false) => {
  //   try {
  //     if (isRefresh) {
  //       setRefreshing(true);
  //     } else {
  //       setLoading(true);
  //     }
  //     setError(null);

  //     const result = await getAllVideos({ page: 1, limit: 10 });
  //     setVideos(result.videos);
  //   } catch (err: any) {
  //     console.error('Error fetching videos:', err);
  //     setError(err.message || 'Failed to load videos');
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchVideos();
  // }, [fetchVideos]);

  // const handleRefresh = useCallback(() => {
  //   fetchVideos(true);
  // }, [fetchVideos]);

  // const handleVideoPress = useCallback(
  //   (videoId: string) => {
  //     navigation.navigate('VideoPlayer', { videoId: videoId });
  //   },
  //   [navigation]
  // );
  const handleVideoPress = (videoId: string) => {
    navigation.navigate("VideoPlayer", { videoId });
  };

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
            onPress={refresh}
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
          onRefresh={refresh}
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
