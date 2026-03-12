import React, { useRef, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  Dimensions, NativeSyntheticEvent, NativeScrollEvent, ScrollView,
} from 'react-native';
import MoreIcon from '../../assets/icons/threeDot.svg';
import LikeIcon from '../../assets/icons/like.svg';
import LikeActiveIcon from '../../assets/icons/like2.svg';
import DislikeIcon from '../../assets/icons/dislike2.svg';
import DislikeActiveIcon from '../../assets/icons/dislike3.svg';
import CommentIcon from '../../assets/icons/comment.svg';
import { useReaction } from '@/shared/hooks/useReaction';

interface PostCardProps {
  postId: string;         // ← needed for reaction
  initialLikes: number;
  initialDislikes: number;
  userName: string;
  userAvatar: string;
  postImages: string[];
  comments: number;
  caption: string;
  date: string;
  onComment?: () => void;
  onMenu?: () => void;
}

export default function PostCard({
  postId,
  initialLikes,
  initialDislikes,
  userName,
  userAvatar,
  postImages,
  comments,
  caption,
  date,
  onComment,
  onMenu,
}: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;

  // ─── Reaction ───────────────────────────────────────────────────────
  const {
    userReaction,
    likesCount,
    dislikesCount,
    loading: reactionLoading,
    checking: reactionChecking,
    toggleReaction,
  } = useReaction(
    postId,
    'Post',
    initialLikes,
    initialDislikes,
  );

  // ─── Image carousel ──────────────────────────────────────────────────
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setCurrentImageIndex(Math.round(offsetX / screenWidth));
  };

  return (
    <View className="mb-4 w-full overflow-hidden border-b-2 border-white/20">

      {/* Header */}
      <View className="flex-row items-center gap-2 py-3">
        <Image source={{ uri: userAvatar }} className="h-10 w-10 rounded-xl" />
        <Text className="ml-3 flex-1 font-medium text-white">{userName}</Text>
        <TouchableOpacity
          onPress={onMenu}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreIcon width={42} height={42} />
        </TouchableOpacity>
      </View>

      {/* Image Carousel */}
      {postImages.length > 0 && (
        <View>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {postImages.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={{ width: screenWidth, height: 320 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Pagination dots */}
          {postImages.length > 1 && (
            <View className="flex-row justify-center gap-1 py-2">
              {postImages.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center gap-6 py-2">

        {/* Like */}
        <TouchableOpacity
          onPress={() => toggleReaction('like')}
          disabled={reactionLoading || reactionChecking}
          className={`flex-row items-center gap-2 ${
            reactionLoading || reactionChecking ? 'opacity-50' : ''
          }`}
        >
          {userReaction === 'like'
            ? <LikeActiveIcon width={18} height={18} />
            : <LikeIcon width={18} height={18} />
          }
          <Text className={`text-sm font-semibold ${
            userReaction === 'like' ? 'text-[#9BD71B]' : 'text-white'
          }`}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        {/* Dislike */}
        <TouchableOpacity
          onPress={() => toggleReaction('dislike')}
          disabled={reactionLoading || reactionChecking}
          className={`flex-row items-center gap-2 ${
            reactionLoading || reactionChecking ? 'opacity-50' : ''
          }`}
        >
          {userReaction === 'dislike'
            ? <DislikeActiveIcon width={18} height={18} />
            : <DislikeIcon width={18} height={18} />
          }
          <Text className={`text-sm font-semibold ${
            userReaction === 'dislike' ? 'text-[#9BD71B]' : 'text-white'
          }`}>
            {dislikesCount}
          </Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity
          onPress={onComment}
          className="flex-row items-center gap-2"
        >
          <CommentIcon width={18} height={18} />
          <Text className="text-sm text-white">{comments}</Text>
        </TouchableOpacity>

      </View>

      {/* Caption */}
      <View className="py-2">
        <Text className="text-sm font-normal leading-5 text-white">
          {isExpanded ? caption : caption.slice(0, 100)}
          {!isExpanded && caption.length > 100 && (
            <Text
              className="text-sm text-white/60"
              onPress={() => setIsExpanded(true)}
            >
              {' '}...See more
            </Text>
          )}
        </Text>
      </View>

      {/* Date */}
      <Text className="pb-3 text-xs text-white/50">{date}</Text>

    </View>
  );
}