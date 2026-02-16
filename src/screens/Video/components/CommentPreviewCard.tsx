// presentation/videos/components/CommentPreviewCard.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import Time from '../../../../assets/icons/time.svg';
import { CommentUI } from '@/shared/types/comments.type';
import { getTimeAgo } from '@/shared/utils/comments.utils';

interface CommentPreviewCardProps {
  comment: CommentUI;
}

export default function CommentPreviewCard({ comment }: CommentPreviewCardProps) {
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <View className="border-b border-gray-700/50 py-3">
      <View className="flex-row items-start gap-3">
        <Image source={{ uri: comment.avatarUrl }} className="h-9 w-9 rounded-xl" />
        <View className="flex-1">
          <View className="mb-1 flex-row items-center gap-2">
            <Text className="text-sm font-medium text-white">{comment.username}</Text>
            <View className="flex-row items-center gap-1">
              <Time width={12} height={12} />
              <Text className="text-xs text-gray-400">{getTimeAgo(comment.timeAgo)}</Text>
            </View>
          </View>
          <Text className="text-sm leading-5 text-gray-300">{truncateText(comment.comment)}</Text>
          {comment.replyCount > 0 && (
            <Text className="mt-1  text-xs text-[#9BD71B]">
              {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
