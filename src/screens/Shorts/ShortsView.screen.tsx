// presentation/shorts/ShortsViewScreen.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Share from '../../../assets/icons/share.svg'
import Saved from '../../../assets/icons/saved.svg'
import Report from '../../../assets/icons/report.svg'
import Like from '../../../assets/icons/like2.svg'
import LikeInActive from '../../../assets/icons/like3.svg'
import Dislike from '../../../assets/icons/dislike3.svg'
import DislikeInActive from '../../../assets/icons/dislike2.svg'
import ActionButton from './components/ActionButton';
import VideoPlayer from './components/VideoPlayer';
import BottomInfo from './components/BottomInfo';
import SeekableProgressBar from './components/SeekableProgressBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShortsParamalist } from '@/navigation/ShortsStack';
import { ShortData } from '@/shared/types/shorts.types';
import { getShortById } from '@/domain/video/api/shorts.service';
import { formatTimeAgo } from '@/shared/utils/formatters';

type Props = NativeStackNavigationProp<ShortsParamalist, 'ShortsView'>;

export default function ShortsViewScreen() {
  const navigation = useNavigation<Props>();
  const route = useRoute<any>();
  const { shortId } = route.params;
  const videoRef = useRef<Video>(null);
  const [likeCount, setLikeCount] = useState(16);
  const [dislikeCount, setDislikeCount] = useState(16);
  const [commentCount] = useState(16);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortData, setShortData] = useState<ShortData>();
  console.log("videos:", shortData)

  const fetchVideos = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result = await getShortById(shortId)
      setShortData(result);
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      setError(err.message || 'Failed to load videos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [shortId]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleRefresh = useCallback(() => {
    fetchVideos(true);
  }, [fetchVideos]);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      if (isDisliked) {
        setDislikeCount(prev => prev - 1);
        setIsDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setDislikeCount(prev => prev - 1);
      setIsDisliked(false);
    } else {
      setDislikeCount(prev => prev + 1);
      setIsDisliked(true);
      if (isLiked) {
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      }
    }
  };

  const handleProgressUpdate = (progress: number, duration: number) => {
    setVideoProgress(progress);
    setVideoDuration(duration);
  };

  const handleSeek = async (position: number) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(position * 1000); // Convert to milliseconds
    }
  };

  const skipBackward = async () => {
    if (videoRef.current) {
      const newPosition = Math.max(0, videoProgress - 10); // Skip back 10 seconds
      await videoRef.current.setPositionAsync(newPosition * 1000);
    }
  };

  const skipForward = async () => {
    if (videoRef.current && videoDuration) {
      const newPosition = Math.min(videoDuration, videoProgress + 10); // Skip forward 10 seconds
      await videoRef.current.setPositionAsync(newPosition * 1000);
    }
  };

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

    if (!shortData) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <Text className="text-gray-400 text-center">
            No shorts available at the moment
          </Text>
        </View>
      );
    }

    return (
      <>
        <VideoPlayer
          uri={shortData.videoUrl}
          onProgressUpdate={handleProgressUpdate}
          videoRef={videoRef}
          onSkipBackward={skipBackward}
          onSkipForward={skipForward}
        />

        {/* Top Controls - Inside SafeArea */}
        <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0">
          <View className="flex-row justify-between items-center px-4">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-14 h-14 rounded-2xl bg-black/40 justify-center items-center">
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Search Button */}
            <TouchableOpacity className="w-14 h-14 rounded-2xl bg-black/40 justify-center items-center">
              <Ionicons name="search-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Top Right Actions (Below SafeArea) */}
        <SafeAreaView edges={['top']} className="absolute top-0 right-4">
          <View className="gap-2 mt-20">
            <TouchableOpacity className="flex-row justify-end items-center px-4 py-2 rounded-lg bg-black/50">
              <Share height={24} width={24} />
              <Text className="text-white text-base ml-1.5 font-medium">Share</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row justify-end items-center px-4 py-2 rounded-lg bg-black/50">
              <Saved height={24} width={24} />
              <Text className="text-white text-base ml-1.5 font-medium">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Report')}
              className="flex-row justify-end items-center px-4 py-2 rounded-lg bg-black/50">
              <Report height={24} width={24} />
              <Text className="text-white text-base ml-1.5 font-medium">Report</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Bottom Info Section - Inside SafeArea */}
        <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-16 p-6 py-4 bg-black/10 w-full gap-4">
          <View className="flex-row gap-3">
            <ActionButton
              Icon={isLiked ? Like : LikeInActive}
              count={shortData.likes.toString()}
              isActive={isLiked}
              onPress={handleLike}
            />
            <ActionButton
              Icon={isDisliked ? Dislike : DislikeInActive}
              count={shortData.dislikes.toString()}
              isActive={isDisliked}
              onPress={handleDislike}
            />
            <ActionButton
              Icon="chatbubble-outline"
              count={shortData.comments.toString()}
            />
          </View>

          <BottomInfo
            username={shortData.ownerName}
            avatar={shortData.ownerAvatar!}
            title={shortData.title}
            description={shortData.description}
            views={shortData.views}
            timeAgo={formatTimeAgo(shortData.createdAt)}
            hashtags={shortData.hashtags}
          />

          {/* Seekable Progress Bar */}
          <View className="mt-2">
            <SeekableProgressBar
              progress={videoProgress}
              duration={videoDuration}
              onSeek={handleSeek}
            />
          </View>
        </SafeAreaView>
      </>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View

        className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />

        {renderContent()}
      </View>
    </GestureHandlerRootView>
  );
}