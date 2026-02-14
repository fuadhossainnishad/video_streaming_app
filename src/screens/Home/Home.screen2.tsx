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
import Logo from '../../../assets/icon.svg';
import StarIcon from '../../../assets/icons/star.svg';
import NotificationIcon from '../../../assets/icons/notification.svg';
import SearchIcon from '../../../assets/icons/search.svg';
import { HomeParamalist } from '@/navigation/HomeStack';
import VideoRender from '@/components/VideoRender';
import TopCreator from '@/components/TopCreator';
import { VideoData } from '../../shared/types/video.types';
import { getAllVideos } from '@/domain/video/api/video.service';


type Props = NativeStackNavigationProp<HomeParamalist, 'Home'>;

export default function HomeScreen2() {
  const navigation = useNavigation<Props>();
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log("videos:", videos)

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

    if (videos.length === 0) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <Text className="text-gray-400 text-center">
            No videos available at the moment
          </Text>
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

        <TopCreator />

        {videos.slice(2).map((video) => (
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
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View className="gap-y-4">
          {/* Header */}
          <View style={styles.headerContainer}>
            <Logo height={80} width={80} />
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => { }}
                style={styles.buttonContent}
                className="border border-[#9BD71B]/50 px-5 py-3.5 rounded-2xl"
              >
                <StarIcon height={20} width={20} />
                <Text style={styles.buttonText}>Go Pro</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { navigation.navigate('Notification') }}>
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
            }
          >
            {/* Hero Banner */}
            <View>
              <Image
                source={require('../../../assets/poster/hero.png')}
                style={{ width: '100%', height: 200, resizeMode: 'contain' }}
              />
            </View>

            {/* Search Section */}
            <View className="gap-y-3">
              <Text className="w-2/3 px-4 text-xl font-semibold text-[#B4BABD]">
                Let&apos;s explore today&apos;s trending moments
              </Text>
              <View className="flex-row items-center gap-2 rounded-2xl bg-[#FFFFFF1A] px-4 py-2">
                <SearchIcon height={20} width={20} />
                <TextInput
                  className="flex-1 text-base text-white"
                  placeholder="Search"
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="search"
                />
              </View>
            </View>

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