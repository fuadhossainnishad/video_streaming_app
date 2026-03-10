// presentation/shorts/ShortsViewScreen.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StatusBar, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ShareIcon from '../../../assets/icons/share.svg';
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
import { useSave } from '@/shared/hooks/useSave';
import { useReaction } from '@/shared/hooks/useReaction';
import Share, { ShareOptions } from 'react-native-share';
import * as FileSystem from 'expo-file-system/legacy';

type Props = NativeStackNavigationProp<ShortsParamalist, 'ShortsView'>;

export default function ShortsViewScreen() {
  const navigation = useNavigation<Props>();
  const route = useRoute<any>();
  const { shortId } = route.params;

  const videoRef = useRef<Video>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shortData, setShortData] = useState<ShortData | null>(null);

  const {
    userReaction,
    likesCount,
    dislikesCount,
    loading: reactionLoading,
    toggleReaction,
  } = useReaction(
    shortData?.id!,
    'Short',
    shortData?.likes!,
    shortData?.dislikes!,

  );

  // SAVE
  const {
    isSaved,
    loading: saveLoading,
    toggleSave,
  } = useSave(shortData?.id!, 'Short');

  const fetchShort = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching short with ID:', shortId);
      const result = await getShortById(shortId);
      console.log('Fetched short data:', result);

      setShortData(result);
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

  const handleShare = async () => {
    if (!shortData) return;

    const message = `Check out this short on ${shortData.channelName}!\n\n${shortData.title}`;

    try {
      let shareUrl = shortData.videoUrl;

      // Download thumbnail locally to show as preview
      if (shortData.ownerAvatar) {
        const fileUri = `${FileSystem.cacheDirectory}${shortData.id}_thumbnail.jpg`;
        const { uri } = await FileSystem.downloadAsync(shortData.ownerAvatar, fileUri);
        shareUrl = uri; // local file path for sharing
      }

      const shareOptions: ShareOptions = {
        title: shortData.title,
        message: Platform.OS === 'android' ? `${message}\n\nWatch here: ${shortData.videoUrl}` : message,
        url: shareUrl,
        failOnCancel: false,
      };

      const result = await Share.open(shareOptions);

      if (result.success) {
        console.log('Short shared successfully!', result);
      } else {
        console.log('Share dismissed', result);
      }
    } catch (error: any) {
      console.error('Error sharing short:', error.message);
      Alert.alert('Share failed', 'Could not share the short. Please try again later.');
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

            <TouchableOpacity
              onPress={() => navigation.navigate('SearchShort')}
              className="h-14 w-14 items-center justify-center rounded-2xl bg-black/40">
              <Ionicons name="search-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Top Right Actions */}
        <SafeAreaView edges={['top']} className="absolute right-4 top-0">
          <View className="mt-20 gap-2">
            <TouchableOpacity
              className="flex-row items-center justify-end rounded-lg bg-black/50 px-4 py-2"
              onPress={handleShare}
            >
              <ShareIcon height={24} width={24} />
              <Text className="ml-1.5 text-base font-medium text-white">Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={saveLoading}
              onPress={toggleSave}
              className="flex-row items-center justify-end rounded-lg bg-black/50 px-4 py-2"
            >
              <Saved
                height={24}
                width={24}
                fill={isSaved ? "#9BD71B" : "white"}
              />
              <Text className="ml-1.5 text-base font-medium text-white">
                {saveLoading ? "Saving..." : isSaved ? "Saved" : "Save"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Report", {
                  contentId: shortData.id,
                  contentType: "short",
                })
              } className="flex-row items-center justify-end rounded-lg bg-black/50 px-4 py-2">
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
              Icon={userReaction === 'like' ? Like : LikeInActive}
              count={likesCount.toString()}
              isActive={userReaction === 'like'}
              onPress={() => toggleReaction('like')}
              disabled={reactionLoading}
            />

            <ActionButton
              Icon={userReaction === 'dislike' ? Dislike : DislikeInActive}
              count={dislikesCount.toString()}
              isActive={userReaction === 'dislike'}
              onPress={() => toggleReaction('dislike')}
              disabled={reactionLoading}
            />
            <ActionButton Icon="chatbubble-outline" count={(shortData.comments!).toString()} />
          </View>

          <BottomInfo
            username={shortData.ownerName!}
            avatar={shortData.ownerAvatar!}
            title={shortData.title}
            description={shortData.description}
            views={shortData.views}
            timeAgo={formatTimeAgo(shortData.createdAt)}
            hashtags={shortData.hashtags || []}
            channelId={shortData.channelId!}
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
