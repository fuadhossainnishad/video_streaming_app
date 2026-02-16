// presentation/shorts/ShortsViewScreen.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Share from '../../../assets/icons/share.svg';
import Saved from '../../../assets/icons/saved.svg';
import Report from '../../../assets/icons/report.svg';
import Like from '../../../assets/icons/like2.svg';
import LikeInActive from '../../../assets/icons/like3.svg';
import Dislike from '../../../assets/icons/dislike3.svg';
import DislikeInActive from '../../../assets/icons/dislike2.svg';
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
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shortData, setShortData] = useState<ShortData | null>(null);

  const fetchShort = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching short with ID:', shortId);
      const result = await getShortById(shortId);
      console.log('Fetched short data:', result);

      setShortData(result);
      setLikeCount(result.likes || 0);
      setDislikeCount(result.dislikes || 0);
    } catch (err: any) {
      console.error('Error fetching short:', err);
      const errorMessage = err.message || 'Failed to load short';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shortId]);

  useEffect(() => {
    if (shortId) {
      fetchShort();
    } else {
      setError('No short ID provided');
      setLoading(false);
    }
  }, [shortId, fetchShort]);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
      if (isDisliked) {
        setDislikeCount((prev) => prev - 1);
        setIsDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setDislikeCount((prev) => prev - 1);
      setIsDisliked(false);
    } else {
      setDislikeCount((prev) => prev + 1);
      setIsDisliked(true);
      if (isLiked) {
        setLikeCount((prev) => prev - 1);
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
      await videoRef.current.setPositionAsync(position * 1000);
    }
  };

  const skipBackward = async () => {
    if (videoRef.current) {
      const newPosition = Math.max(0, videoProgress - 10);
      await videoRef.current.setPositionAsync(newPosition * 1000);
    }
  };

  const skipForward = async () => {
    if (videoRef.current && videoDuration) {
      const newPosition = Math.min(videoDuration, videoProgress + 10);
      await videoRef.current.setPositionAsync(newPosition * 1000);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center bg-black">
          <ActivityIndicator size="large" color="#9BD71B" />
          <Text className="mt-4 text-gray-400">Loading short...</Text>
        </View>
      );
    }

    if (error || !shortData) {
      return (
        <View className="flex-1 items-center justify-center bg-black px-6">
          <Text className="mb-4 text-center text-red-400">{error || 'Short not found'}</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-xl bg-[#9BD71B] px-6 py-3">
            <Text className="font-semibold text-black">Go Back</Text>
          </TouchableOpacity>
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

        {/* Top Controls */}
        <SafeAreaView edges={['top']} className="absolute left-0 right-0 top-0">
          <View className="flex-row items-center justify-between px-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="h-14 w-14 items-center justify-center rounded-2xl bg-black/40">
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity className="h-14 w-14 items-center justify-center rounded-2xl bg-black/40">
              <Ionicons name="search-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Top Right Actions */}
        <SafeAreaView edges={['top']} className="absolute right-4 top-0">
          <View className="mt-20 gap-2">
            <TouchableOpacity className="flex-row items-center justify-end rounded-lg bg-black/50 px-4 py-2">
              <Share height={24} width={24} />
              <Text className="ml-1.5 text-base font-medium text-white">Share</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-end rounded-lg bg-black/50 px-4 py-2">
              <Saved height={24} width={24} />
              <Text className="ml-1.5 text-base font-medium text-white">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Report')}
              className="flex-row items-center justify-end rounded-lg bg-black/50 px-4 py-2">
              <Report height={24} width={24} />
              <Text className="ml-1.5 text-base font-medium text-white">Report</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Bottom Info Section */}
        <SafeAreaView
          edges={['bottom']}
          className="absolute bottom-0 left-0 right-16 w-full gap-4 bg-black/10 p-6 py-4">
          <View className="flex-row gap-3">
            <ActionButton
              Icon={isLiked ? Like : LikeInActive}
              count={likeCount.toString()}
              isActive={isLiked}
              onPress={handleLike}
            />
            <ActionButton
              Icon={isDisliked ? Dislike : DislikeInActive}
              count={dislikeCount.toString()}
              isActive={isDisliked}
              onPress={handleDislike}
            />
            <ActionButton Icon="chatbubble-outline" count={(shortData.comments || 0).toString()} />
          </View>

          <BottomInfo
            username={shortData.ownerName!}
            avatar={shortData.ownerAvatar!}
            title={shortData.title}
            description={shortData.description}
            views={shortData.views}
            timeAgo={formatTimeAgo(shortData.createdAt)}
            hashtags={shortData.hashtags || []}
          />

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
      <View className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />
        {renderContent()}
      </View>
    </GestureHandlerRootView>
  );
}
