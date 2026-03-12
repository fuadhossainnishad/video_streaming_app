// presentation/videos/components/CommentItem.tsx
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Time from '../../../../assets/icons/time.svg';
import Like from '../../../../assets/icons/like2.svg';
import LikeInactive from '../../../../assets/icons/like3.svg';
import Dislike from '../../../../assets/icons/dislike3.svg';
import DislikeInactive from '../../../../assets/icons/dislike2.svg';
import Comment from '../../../../assets/icons/comment3.svg';
import { CommentUI } from '@/shared/types/comments.type';
import { useCommentReaction } from '@/shared/hooks/useCommentReaction';
import { getTimeAgo } from '@/shared/utils/comments.utils';

interface CommentItemProps {
  comment: CommentUI;
  onReply?: (comment: CommentUI) => void;
  showReplyButton?: boolean;
  initialReaction?: 'like' | 'dislike' | null;
  initialLikes?: number;
  initialDislikes?: number;
}


export default function CommentItem({
  comment,
  onReply,
  showReplyButton = true,
  initialReaction,
  initialLikes,
  initialDislikes,
}: CommentItemProps) {
  const {
    userReaction,
    likesCount,
    dislikesCount,
    loading,
    checking,
    toggleReaction,
  } = useCommentReaction(
    comment.id,
    initialLikes ?? comment.likes ?? 0,      // ← server stats override
    initialDislikes ?? comment.dislikes ?? 0, // ← server stats override
    initialReaction
  );
console.log("userReaction:",userReaction)
console.log("likesCount:",likesCount)
console.log("likesCount:",likesCount)
console.log("checking:",checking)

  return (
    <View className="border-b border-gray-800 py-4">

      {/* User row */}
      <View className="mb-2 flex-row items-center gap-3">
        <Image source={{ uri: comment.avatarUrl }} className="h-10 w-10 rounded-xl" />
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-medium text-white">{comment.username}</Text>
            {comment.isPinned && (
              <View className="rounded bg-[#9BD71B]/20 px-2 py-0.5">
                <Text className="text-xs font-medium text-[#9BD71B]">Pinned</Text>
              </View>
            )}
          </View>
          <View className="mt-0.5 flex-row items-center gap-1">
            <Time width={14} height={14} />
            <Text className="text-xs text-gray-400">{getTimeAgo(comment.timeAgo)}</Text>
            {comment.isEdited && (
              <Text className="text-xs text-gray-500">• edited</Text>
            )}
          </View>
        </View>
      </View>

      {/* Text */}
      <Text className="mb-3 text-sm leading-5 text-gray-200">{comment.comment}</Text>

      {/* Actions */}
      <View className="mb-2 flex-row items-center gap-4">
        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={() => toggleReaction('like')}
          disabled={loading || checking}
          style={{ opacity: loading || checking ? 0.5 : 1 }}
        >
          {userReaction === 'like'
            ? <Like width={20} height={20} />
            : <LikeInactive width={20} height={20} />
          }
          <Text className={`text-xs ${userReaction === 'like' ? 'text-[#9BD71B]' : 'text-gray-400'}`}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={() => toggleReaction('dislike')}
          disabled={loading || checking}
          style={{ opacity: loading || checking ? 0.5 : 1 }}
        >
          {userReaction === 'dislike'
            ? <Dislike width={20} height={20} />
            : <DislikeInactive width={20} height={20} />
          }
          <Text className={`text-xs ${userReaction === 'dislike' ? 'text-[#9BD71B]' : 'text-gray-400'}`}>
            {dislikesCount}
          </Text>
        </TouchableOpacity>

        {showReplyButton && onReply && (
          <TouchableOpacity onPress={() => onReply(comment)}>
            <Comment width={20} height={20} />
          </TouchableOpacity>
        )}
      </View>

      {/* Reply count */}
      {showReplyButton && (comment.replyCount ?? 0) > 0 && onReply && (
        <TouchableOpacity
          className="self-end"
          onPress={() => onReply(comment)}
        >
          <Text className="rounded-xl border border-[#9BD71B]/20 p-2 px-3 text-sm text-[#9BD71B]">
            {comment.replyCount} {comment.replyCount === 1 ? 'Reply' : 'Replies'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}