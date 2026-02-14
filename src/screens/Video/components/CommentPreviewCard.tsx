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
    <View className="py-3 border-b border-gray-700/50">
      <View className="flex-row items-start gap-3">
        <Image
          source={{ uri: comment.avatarUrl }}
          className="w-9 h-9 rounded-xl"
        />
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-white font-medium text-sm">
              {comment.username}
            </Text>
            <View className="flex-row items-center gap-1">
              <Time width={12} height={12} />
              <Text className="text-gray-400 text-xs">
                {getTimeAgo(comment.timeAgo)}
              </Text>
            </View>
          </View>
          <Text className="text-gray-300 text-sm leading-5">
            {truncateText(comment.comment)}
          </Text>
          {comment.replyCount > 0 && (
            <Text className="text-[#9BD71B] text-xs mt-1">
              {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}