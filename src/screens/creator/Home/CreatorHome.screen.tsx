// presentation/Home/HomeScreen2.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../../../assets/icon.svg';
import StarIcon from '../../../../assets/icons/star.svg';
import NotificationIcon from '../../../../assets/icons/notification.svg';
import VideoRender from '@/components/VideoRender';
import { VideoData } from '../../../shared/types/video.types';
import { getAllVideos } from '@/domain/video/api/video.service';
import BarChart from '@/components/BarChart';
import { chartData } from './data';
import ChannelStatsCard from '@/components/ChannelStatsCard';
import { CreatorHomeParamalist } from '@/navigation/creator/CreatorHomeStack';

type Props = NativeStackNavigationProp<CreatorHomeParamalist, 'CreatorHome'>;

export default function CreatorHomeScreen() {
  const navigation = useNavigation<Props>();
  const [searchQuery, setSearchQuery] = useState('');
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

      const result = await getAllVideos({ page: 1, limit: 10 });
      setVideos(result.videos);
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      setError(err.message || 'Failed to load videos');
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

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  }, [searchQuery]);

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
        {videos.slice(0, 2).map((video) => (
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

  return (
    <LinearGradient
      colors={['#46464640', '#17191A', '#17191A', '#17191A', '#17191A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View className="gap-y-4">
          {/* Header */}
          <View style={styles.headerContainer}>
            <Logo height={80} width={80} />
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => {}}
                style={styles.buttonContent}
                className="rounded-2xl border border-[#9BD71B]/50 px-5 py-3.5">
                <StarIcon height={20} width={20} />
                <Text style={styles.buttonText}>Go Pro</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('CreatorNotification');
                }}>
                <NotificationIcon height={50} width={50} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
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
            <ChannelStatsCard />

            <BarChart data={chartData} year="2024" />

            {/* Video Feed */}
            {renderContent()}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 18,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: '500',
    color: '#9BD71B',
  },
});
