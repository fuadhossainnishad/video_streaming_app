import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, TouchableOpacity, Text, StatusBar,
  ActivityIndicator, Alert, Platform, Animated,
} from 'react-native';
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
import { increaseShortView } from '@/domain/video/api/shortView.service';
import ShortCommentsModal from '../Video/components/ShortCommentsModal';

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

  const [showComments, setShowComments] = useState(false);


  // ─── UI visibility ────────────────────────────────────────────────────
  const [overlayVisible, setOverlayVisible] = useState(true); // visible on first load
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const viewRecorded = useRef(false);

  // ─── Hooks ────────────────────────────────────────────────────────────
  const {
    userReaction,
    likesCount,
    dislikesCount,
    loading: reactionLoading,
    checking: reactionChecking,
    toggleReaction,
  } = useReaction(
    shortData?.id ?? '',
    'Short',
    shortData?.likes ?? 0,
    shortData?.dislikes ?? 0,
  );

  const handleCloseComments = useCallback(() => {
    setShowComments(false);
  }, []);

  const {
    isSaved,
    loading: saveLoading,
    toggleSave,
  } = useSave(shortData?.id ?? '', 'Short');


  // ─── Auto-hide overlay ────────────────────────────────────────────────
  const hideOverlay = useCallback(() => {
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setOverlayVisible(false));
  }, [overlayOpacity]);

  const showOverlay = useCallback(() => {
    // Cancel any pending hide
    if (hideTimer.current) clearTimeout(hideTimer.current);

    // Show immediately
    setOverlayVisible(true);
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Auto-hide after 3s
    hideTimer.current = setTimeout(hideOverlay, 3000);
  }, [overlayOpacity, hideOverlay]);

  // Auto-hide 3s after short loads
  useEffect(() => {
    if (!shortData) return;
    showOverlay();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [shortData, showOverlay]);

  // ─── Fetch short ──────────────────────────────────────────────────────
  const fetchShort = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getShortById(shortId);

      if (!viewRecorded.current) {
        await increaseShortView(shortId);
        viewRecorded.current = true;
      }

      setShortData(result);
    } catch (err: any) {
      console.error('Error fetching short:', err);
      setError(err.message || 'Failed to load short');
    } finally {
      setLoading(false);
    }
  }, [shortId]);

  useEffect(() => {
    if (shortId) fetchShort();
    else { setError('No short ID provided'); setLoading(false); }
  }, [shortId, fetchShort]);

  // ─── Share ────────────────────────────────────────────────────────────
  const handleShare = async () => {
    if (!shortData) return;
    const message = `Check out this short on ${shortData.channelName}!\n\n${shortData.title}`;
    try {
      let shareUrl = shortData.videoUrl;
      if (shortData.ownerAvatar) {
        const fileUri = `${FileSystem.cacheDirectory}${shortData.id}_thumbnail.jpg`;
        const { uri } = await FileSystem.downloadAsync(shortData.ownerAvatar, fileUri);
        shareUrl = uri;
      }
      const shareOptions: ShareOptions = {
        title: shortData.title,
        message: Platform.OS === 'android'
          ? `${message}\n\nWatch here: ${shortData.videoUrl}`
          : message,
        url: shareUrl,
        failOnCancel: false,
      };
      await Share.open(shareOptions);
    } catch (error: any) {
      Alert.alert('Share failed', 'Could not share the short. Please try again later.', error);
    }
  };

  // ─── Progress ─────────────────────────────────────────────────────────
  const handleProgressUpdate = (progress: number, duration: number) => {
    setVideoProgress(progress);
    setVideoDuration(duration);
  };

  const handleSeek = async (position: number) => {
    if (videoRef.current) await videoRef.current.setPositionAsync(position * 1000);
  };

  const skipBackward = async () => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(Math.max(0, videoProgress - 10) * 1000);
    }
  };

  const skipForward = async () => {
    if (videoRef.current && videoDuration) {
      await videoRef.current.setPositionAsync(Math.min(videoDuration, videoProgress + 10) * 1000);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────
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
          className="rounded-xl bg-[#9BD71B] px-6 py-3"
        >
          <Text className="font-semibold text-black">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
      pointerEvents="box-none"
    >
      <View className="flex-1 bg-black">
        <StatusBar barStyle="light-content" hidden />

        {/* Video — always full screen */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={showOverlay}
          style={{ flex: 1 }}
        >
          <VideoPlayer
            uri={shortData.videoUrl}
            onProgressUpdate={handleProgressUpdate}
            videoRef={videoRef}
            onSkipBackward={skipBackward}
            onSkipForward={skipForward}
            showControls={overlayVisible}

          />
        </TouchableOpacity>

        {overlayVisible && (
          <Animated.View
            // pointerEvents="box-none"
            pointerEvents={overlayVisible ? 'box-none' : 'none'}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              opacity: overlayOpacity,
            }}
          >
            {/* Top Bar */}
            <SafeAreaView
              edges={['top']}
              // pointerEvents="box-none"
              className="absolute left-0 right-0 top-0"
              style={{ zIndex: 200 }}
            >
              <View className="flex-row items-center justify-between px-4">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="h-14 w-14 items-center justify-center rounded-2xl bg-black/40"
                >
                  <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity

                  onPress={() => {
                    console.log('search pressed');
                    navigation.navigate('SearchShort')
                  }}
                  className="h-14 w-14 items-center justify-center rounded-2xl bg-black/40"
                >
                  <Ionicons name="search-outline" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>

            {/* Right Actions */}
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
                  <Saved height={24} width={24} fill={isSaved ? '#9BD71B' : 'white'} />
                  <Text className="ml-1.5 text-base font-medium text-white">
                    {saveLoading ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Report', {
                    contentId: shortData.id,
                    contentType: 'short',
                  })}
                  className="flex-row items-center justify-end rounded-lg bg-black/50 px-4 py-2"
                >
                  <Report height={24} width={24} />
                  <Text className="ml-1.5 text-base font-medium text-white">Report</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>

            {/* Bottom Section */}
            <SafeAreaView
              edges={['bottom']}
              className="absolute bottom-0 left-0 right-0 gap-4 bg-black/10 p-6 py-4"
            >
              <View className="flex-row gap-3">
                <ActionButton
                  Icon={userReaction === 'like' ? Like : LikeInActive}
                  count={likesCount.toString()}
                  isActive={userReaction === 'like'}
                  onPress={() => toggleReaction('like')}
                  disabled={reactionLoading || reactionChecking}
                  checking={reactionChecking}
                />
                <ActionButton
                  Icon={userReaction === 'dislike' ? Dislike : DislikeInActive}
                  count={dislikesCount.toString()}
                  isActive={userReaction === 'dislike'}
                  onPress={() => toggleReaction('dislike')}
                  disabled={reactionLoading || reactionChecking}
                  checking={reactionChecking}
                />
                <ActionButton
                  Icon="chatbubble-outline"
                  count={(shortData.comments ?? 0).toString()}
                  onPress={() => setShowComments(true)}

                />
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
          </Animated.View>
        )}


        {showComments && (
          <ShortCommentsModal
            visible={showComments}
            onClose={handleCloseComments}
            videoId={shortData.id}
            targetType="Short"
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}