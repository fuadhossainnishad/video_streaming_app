import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, TouchableOpacity, Text, StatusBar,
  ActivityIndicator, Alert, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ShareIcon from '../../../../assets/icons/share.svg';
import Like from '../../../../assets/icons/like2.svg';
import LikeInActive from '../../../../assets/icons/like3.svg';
import Dislike from '../../../../assets/icons/dislike3.svg';
import DislikeInActive from '../../../../assets/icons/dislike2.svg';
import Edit from '../../../../assets/icons/edit2.svg'
import SeekableProgressBar from './components/SeekableProgressBar';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Share, { ShareOptions } from 'react-native-share';
import * as FileSystem from 'expo-file-system/legacy';
import { HubParamalist } from '../../../navigation/creator/HubStack';
import { useReaction } from '../../../shared/hooks/useReaction';
import ActionButton from '@/screens/Shorts/components/ActionButton';
import { formatTimeAgo } from '@/shared/utils/formatters';
import { ShortData } from '@/shared/types/shorts.types';
import ShortCommentsModal from '@/screens/Video/components/ShortCommentsModal';
import { getShortById } from '@/domain/video/api/shorts.service';
import VideoPlayer from '@/screens/Shorts/components/VideoPlayer';
import BottomInfo from './components/BottomInfo';
import DescriptionModal from './components/DescriptionModal';

type Props = NativeStackNavigationProp<HubParamalist, 'ShortsView'>;
type ShortsViewRouteProp = RouteProp<HubParamalist, 'ShortsView'>;

export default function CreatorShortsViewScreen() {
  const navigation = useNavigation<Props>();

  const route = useRoute<ShortsViewRouteProp>();
  const { shortId } = route.params;

  const videoRef = useRef<Video>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shortData, setShortData] = useState<ShortData>();

  const [showComments, setShowComments] = useState(false);


  // ─── UI visibility ────────────────────────────────────────────────────
  const [overlayVisible, setOverlayVisible] = useState(true); // visible on first load
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [descriptionSheetOpen, setDescriptionSheetOpen] = useState(false);

  // const viewRecorded = useRef(false);

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
  const fetchShort = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result = await getShortById(shortId!)
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
    if (shortId) fetchShort();
    else { setError('No short ID provided'); setLoading(false); }
  }, [shortId, fetchShort]);


  const handleRefresh = useCallback(() => {
    fetchShort(true);
  }, [fetchShort]);

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
                    console.log("Edit pressed")
                    navigation.navigate('EditShort', { shortId })
                  }}
                  className="w-14 h-14 rounded-2xl bg-black/40 justify-center items-center"            >
                  <Edit height={36} width={36} />
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
                onSheetOpen={() => {
                  if (hideTimer.current) clearTimeout(hideTimer.current); // stop auto-hide
                  setDescriptionSheetOpen(true);
                }}
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
        {descriptionSheetOpen && (
          <DescriptionModal
            visible={descriptionSheetOpen}
            onClose={() => {
              setDescriptionSheetOpen(false);
              showOverlay(); // resume overlay after closing
            }}
            description={shortData.description}
            views={shortData.views}
            likes={likesCount}
            dislikes={dislikesCount}
            comments={shortData.comments ?? 0}
            timeAgo={formatTimeAgo(shortData.createdAt)}
            hashtags={shortData.hashtags || []}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}