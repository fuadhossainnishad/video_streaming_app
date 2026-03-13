// presentation/videos/VideoPlayerScreen.tsx - COMPLETE FILE WITH COMMENT PREVIEW
import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import SeekableProgressBar from './components/SeekableProgressBar';
import ArrowIcon from '../../../../assets/icons/arrow2.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import Like from '../../../../assets/icons/like2.svg';
import LikeInactive from '../../../../assets/icons/like3.svg';
import DislikeInactive from '../../../../assets/icons/dislike2.svg';
import Dislike from '../../../../assets/icons/dislike3.svg';
import ShareIcon from '../../../../assets/icons/share.svg';
import Edit from '../../../../assets/icons/edit2.svg';
import Arrow from '../../../../assets/icons/arrow4.svg';
import Views from '../../../../assets/icons/view.svg';
import Upload from '../../../../assets/icons/time.svg';
import Settings from '../../../../assets/icons/settings.svg';
import Caption from '../../../../assets/icons/caption.svg';
import Audio from '../../../../assets/icons/audio.svg';
import Full from '../../../../assets/icons/full.svg';
import VideoRender from '@/components/VideoRender';
import { VideoData } from '@/shared/types/video.types';
import { getVideoById } from '@/domain/video/api/video.service';
import { useCommentPreview } from '@/shared/hooks/useCommentPreview';
import { useReaction } from '@/shared/hooks/useReaction';
import ActionButton from '@/screens/Shorts/components/ActionButton';
import CommentPreviewCard from '@/screens/Video/components/CommentPreviewCard';
import DescriptionModal from '@/screens/Video/components/DescriptionModal';
import SettingsModal from '@/screens/Video/components/SettingsModal';
import CommentsModal from '@/screens/Video/components/CommentsModal';
import { HubParamalist } from '@/navigation/creator/HubStack';
import VideoPlayer from '@/screens/Video/components/VideoPlayer';
import Share, { ShareOptions } from 'react-native-share';
import * as FileSystem from 'expo-file-system/legacy';



type Props = NativeStackNavigationProp<HubParamalist, 'VideoPlayer'>;

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function CreatorVideoPlayerScreen2() {
  const navigation = useNavigation<Props>();
  const route = useRoute<any>();
  const { videoId } = route.params;
  const videoRef = useRef<Video>(null);

  // Video player state
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  // const [isLiked, setIsLiked] = useState(false);
  // const [isDisliked, setIsDisliked] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const [showSettings, setShowSettings] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  // Video data state
  const [videos, setVideos] = useState<VideoData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelId = videos?.channelId;
  const channelFollowers = videos?.channelFollower!;


  const {
    userReaction,
    likesCount,
    dislikesCount,
    loading: reactionLoading,
    toggleReaction,
  } = useReaction(
    videos?.id ?? "",
    'Video',
    videos?.likes ?? 0,
    videos?.dislikes ?? 0
  );



  // Comment preview hook
  const {
    comments: commentPreviews,
    totalComments,
    loading: commentsLoading,
    refreshComments,
  } = useCommentPreview({
    videoId: videos?.id!,
    previewCount: 2,
  });

  // const {
  //   isFollowing,
  //   followersCount,
  //   loading: followLoading,
  //   toggleFollow,
  // } = useFollow(
  //   videos?.channelId!,
  //   videos?.channelFollower!
  // );

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getVideoById(videoId);
      console.log("getVideoById:", result)
      setVideos(result);
      // setLikesCount(result.likes ?? 0);
      // setDislikesCount(result.dislikes ?? 0);
    } catch (err: any) {
      console.error('Error fetching video:', err);
      setError(err.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleProgressUpdate = useCallback((progress: number, duration: number) => {
    setVideoProgress(progress);
    setVideoDuration(duration);
  }, []);

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

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setIsFullscreen(false);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
      setIsFullscreen(true);
    }
  };

  const handleReplay = async () => {
    if (videoRef.current) {
      await videoRef.current.replayAsync();
    }
  };

  const handlePlaybackRateChange = async (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(rate, true);
    }
  };

  // const handleShare = async () => {
  //   if (!videos) return;

  //   const message = `Check out this video on ${videos.channelName}!\n\n${videos.title}\n${videos.videoUrl}`;

  //   try {
  //     const result = await Share.share(
  //       {
  //         message,
  //         url: Platform.OS === 'ios' ? videos.videoUrl : undefined, // Android uses message only
  //         title: videos.title,
  //       },
  //       {
  //         // Optional: iOS only options
  //         dialogTitle: `Share ${videos.title}`,
  //         excludedActivityTypes: ['com.apple.UIKit.activity.AssignToContact'],
  //       }
  //     );

  //     // Optional: handle user feedback
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         console.log('Shared with activity type:', result.activityType);
  //       } else {
  //         console.log('Video shared successfully!');
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       console.log('Share dismissed');
  //     }
  //   } catch (error: any) {
  //     console.error('Error sharing video:', error.message);
  //     Alert.alert('Share failed', 'Could not share the video. Please try again.');
  //   }
  // };

  // const handleLike = () => {
  //   if (isLiked) {
  //     setIsLiked(false);
  //   } else {
  //     setIsLiked(true);
  //     if (isDisliked) {
  //       setIsDisliked(false);
  //     }
  //   }
  // };

  // const handleDislike = () => {
  //   if (isDisliked) {
  //     setIsDisliked(false);
  //   } else {
  //     setIsDisliked(true);
  //     if (isLiked) {
  //       setIsLiked(false);
  //     }
  //   }
  // };





  const handleShare = async () => {
    if (!videos) return;

    const message = `Check out this video on ${videos.channelName}!\n\n${videos.title}`;

    try {
      let shareUrl = videos.videoUrl;

      // Download thumbnail locally to show as preview
      if (videos.thumbnailUrl) {
        const fileUri = `${FileSystem.cacheDirectory}${videos.id}_thumbnail.jpg`;
        const { uri } = await FileSystem.downloadAsync(videos.thumbnailUrl, fileUri);
        shareUrl = uri; // local file path for sharing
      }

      const shareOptions: ShareOptions = {
        title: videos.title,
        message: Platform.OS === 'android' ? `${message}\n\nWatch here: ${videos.videoUrl}` : message,
        url: shareUrl,
        failOnCancel: false,
      };

      const result = await Share.open(shareOptions);

      if (result.success) {
        console.log('Video shared successfully!', result);
      } else {
        console.log('Share dismissed', result);
      }
    } catch (error: any) {
      console.error('Error sharing video:', error.message);
      Alert.alert('Share failed', 'Could not share the video. Please try again later.');
    }
  };

  const handleCloseComments = useCallback(() => {
    setShowComments(false);
    refreshComments(); // Refresh preview when modal closes
  }, [refreshComments]);

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#9BD71B" />
          <Text className="mt-4 text-gray-400">Loading video...</Text>
        </View>
      );
    }

    if (error || !videos) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="mb-4 text-center text-red-400">{error || 'Video not found'}</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-xl bg-[#9BD71B] px-6 py-3">
            <Text className="font-semibold text-black">Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isFullscreen) {
      return (
        <View style={{ flex: 1 }}>
          <View className="flex-1 bg-black">
            <StatusBar hidden />
            <VideoPlayer
              uri={videos.videoUrl!}
              videoRef={videoRef}
              onProgressUpdate={handleProgressUpdate}
              onSkipBackward={skipBackward}
              onSkipForward={skipForward}
              playbackRate={playbackRate}
              onToggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
              volume={volume}
              isMuted={isMuted}
            />
          </View>
          <View className="bg-white/10">
            <SeekableProgressBar
              progress={videoProgress}
              duration={videoDuration}
              onSeek={handleSeek}
            />
            <View className="flex-row items-center justify-between p-4 px-12">
              <Text className="rounded-xl bg-[#0000001A] p-3 text-xs font-medium text-white">
                {formatTime(videoProgress)} / {formatTime(videoDuration)}
              </Text>
              <View className="flex-row items-center gap-2">
                <TouchableOpacity onPress={handleReplay}>
                  <Ionicons name="refresh-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowSettings(true)}>
                  <Settings height={32} width={32} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowSettings(true)}>
                  <Caption height={32} width={32} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
                  <Audio height={32} width={32} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFullscreen}>
                  <Full height={32} width={32} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        style={{ flex: 1 }}
        className="flex-1 bg-[#17191A] p-4">
        <StatusBar barStyle="light-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="mb-4 w-full flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()} className="items-center">
              <ArrowIcon height={50} width={50} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('EditVideo', { videoId })} className="items-center">
              <Edit height={40} width={40} />
            </TouchableOpacity>

          </View>

          {/* Video Player */}
          <View className="w-full overflow-hidden rounded-lg bg-black">
            <VideoPlayer
              uri={videos.videoUrl!}
              videoRef={videoRef}
              onProgressUpdate={handleProgressUpdate}
              onSkipBackward={skipBackward}
              onSkipForward={skipForward}
              playbackRate={playbackRate}
              onToggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
              volume={volume}
              isMuted={isMuted}
            />
            <View className="bg-white/10">
              <SeekableProgressBar
                progress={videoProgress}
                duration={videoDuration}
                onSeek={handleSeek}
              />
              <View className="flex-row items-center justify-between p-4">
                <Text className="rounded-xl bg-[#0000001A] p-3 text-xs font-medium text-white">
                  {formatTime(videoProgress)} / {formatTime(videoDuration)}
                </Text>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity onPress={handleReplay}>
                    <Ionicons name="refresh-outline" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowSettings(true)}>
                    <Settings height={32} width={32} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowSettings(true)}>
                    <Caption height={32} width={32} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
                    <Audio height={32} width={32} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleFullscreen}>
                    <Full height={32} width={32} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Video Info */}
          <View className="py-3">
            <View className="flex-row justify-between gap-4">
              <Text className="mb-2 flex-1 text-lg font-bold text-white">{videos.title}</Text>
              <TouchableOpacity onPress={() => setShowDescription(true)} className="ml-auto">
                <Arrow height={32} width={32} />
              </TouchableOpacity>
            </View>
            <View className="mb-3 flex-row items-center">
              <View className="mr-3 flex-row items-center">
                <Views height={22} width={22} />
                <Text className="ml-1 text-sm text-gray-400">{videos.views}</Text>
              </View>
              <View className="mr-3 flex-row items-center">
                <Upload height={20} width={20} />
                <Text className="ml-1 text-sm text-gray-400">{videos.timeAgo}</Text>
              </View>
              {videos.hashtags && videos.hashtags[0] && (
                <Text className="text-sm font-medium text-blue-400">{videos.hashtags[0]}</Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 0 }}>
            <View className="flex-row justify-center w-full">
              <View className="flex-row gap-1">
                <ActionButton
                  Icon={userReaction === 'like' ? Like : LikeInactive}
                  count={likesCount?.toString()!}
                  isActive={userReaction === 'like'}
                  onPress={() => toggleReaction('like')}
                  disabled={reactionLoading}

                />
                <ActionButton
                  Icon={userReaction === 'dislike' ? Dislike : DislikeInactive}
                  count={dislikesCount?.toString()!}
                  isActive={userReaction === 'dislike'}
                  onPress={() => toggleReaction('dislike')}
                  disabled={reactionLoading}

                />
              </View>
              <TouchableOpacity
                className="flex-row items-center justify-end rounded-lg bg-white/5 px-2 py-2"
                onPress={handleShare}
              >
                <ShareIcon height={24} width={24} />
                <Text className="ml-1.5 text-base font-medium text-white">Share</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>

          {/* Comments Preview Section */}
          <TouchableOpacity
            onPress={() => setShowComments(true)}
            className="my-4 rounded-xl bg-white/10 px-4 py-3"
            activeOpacity={0.8}>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-semibold text-white">
                Comments {totalComments > 0 ? totalComments : videos.comments || 0}
              </Text>
              <Text className="text-sm font-semibold text-[#9BD71B]">See all</Text>
            </View>

            {commentsLoading ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#9BD71B" />
              </View>
            ) : commentPreviews.length > 0 ? (
              commentPreviews.map((comment) => (
                <CommentPreviewCard key={comment.id} comment={comment} />
              ))
            ) : (
              <View className="py-3">
                <Text className="text-center text-sm text-gray-400">
                  No comments yet. Be the first to comment!
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Related Videos */}
          <View className="py-4">
            <Text className="mb-3 text-lg font-semibold text-white">
              More videos you&apos;ll love
            </Text>
            <VideoRender
              onPress={() => navigation.navigate('VideoPlayer', { videoId: videos.id })}
            />
          </View>
        </ScrollView>

        {/* Modals */}
        {showDescription && (
          <DescriptionModal
            visible={showDescription}
            onClose={() => setShowDescription(false)}
            title={videos.title}
            description={videos.description!}
            likes={videos.likes!}
            views={Number(videos.views.replace(/[^0-9]/g, ''))}
            uploadDate={videos.timeAgo}
          />
        )}

        {showSettings && (
          <SettingsModal
            visible={showSettings}
            onClose={() => setShowSettings(false)}
            playbackRate={playbackRate}
            onPlaybackRateChange={handlePlaybackRateChange}
          />
        )}

        {showComments && (
          <CommentsModal visible={showComments} onClose={handleCloseComments} videoId={videos.id} />
        )}
      </SafeAreaView>
    );
  };

  return <>{renderContent()}</>;
}
