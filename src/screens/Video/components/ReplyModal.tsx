// presentation/videos/components/ReplyModal.tsx
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Time from '../../../../assets/icons/time.svg';
import Like from '../../../../assets/icons/like2.svg';
import Dislike from '../../../../assets/icons/dislike3.svg';
import Comment from '../../../../assets/icons/comment3.svg';
import Camera from '../../../../assets/icons/share.svg';
import { CommentUI } from '@/shared/types/comments.type';
import {
  dislikeComment,
  getCommentReplies,
  likeComment,
  postReply,
  undislikeComment,
  unlikeComment,
  getBatchCommentReactionStats,
  CommentReactionStats,
} from '@/domain/video/api/comments.service';
import { getTimeAgo } from '@/shared/utils/comments.utils';

interface ReplyModalProps {
  visible: boolean;
  onClose: () => void;
  parentComment: CommentUI;
  targetId: string;
  targetType?: 'Video' | 'Post' | 'Short';
}

export default function ReplyModal({
  visible,
  onClose,
  parentComment,
  targetId,
  targetType = 'Video',
}: ReplyModalProps) {
  const [replies, setReplies] = useState<CommentUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());
  const [dislikedReplies, setDislikedReplies] = useState<Set<string>>(new Set());

  // NEW: Reaction stats
  const [reactionStats, setReactionStats] = useState<Map<string, CommentReactionStats>>(new Map());

  // Fetch replies
  const fetchReplies = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getCommentReplies(parentComment.id, 1, 20);
      setReplies(result.comments);

      // Fetch reaction stats for all replies
      if (result.comments.length > 0) {
        fetchReactionStats(result.comments.map((r) => r.id));
      }
    } catch (error: any) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoading(false);
    }
  }, [parentComment.id]);

  // NEW: Fetch reaction stats
  const fetchReactionStats = useCallback(async (replyIds: string[]) => {
    try {
      const stats = await getBatchCommentReactionStats(replyIds);
      setReactionStats(stats);
    } catch (error) {
      console.error('Error fetching reaction stats:', error);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      fetchReplies();
    }
  }, [visible, fetchReplies]);

  // NEW: Get display counts
  const getDisplayCounts = useCallback(
    (replyId: string) => {
      const serverStats = reactionStats.get(replyId);
      const reply = replies.find((r) => r.id === replyId);

      const baseLikes = serverStats?.likesCount ?? reply?.likes ?? 0;
      const baseDislikes = serverStats?.dislikesCount ?? reply?.dislikes ?? 0;

      let likes = baseLikes;
      let dislikes = baseDislikes;

      if (likedReplies.has(replyId)) {
        likes = baseLikes + 1;
        if (dislikedReplies.has(replyId)) {
          dislikes = baseDislikes - 1;
        }
      } else if (dislikedReplies.has(replyId)) {
        dislikes = baseDislikes + 1;
      }

      return { likes, dislikes };
    },
    [replies, reactionStats, likedReplies, dislikedReplies]
  );

  const handleLikeReply = async (replyId: string) => {
    const newLiked = new Set(likedReplies);
    const newDisliked = new Set(dislikedReplies);

    try {
      if (newLiked.has(replyId)) {
        newLiked.delete(replyId);
        await unlikeComment(replyId);
      } else {
        newLiked.add(replyId);
        newDisliked.delete(replyId);
        await likeComment(replyId);

        if (dislikedReplies.has(replyId)) {
          await undislikeComment(replyId);
        }
      }

      setLikedReplies(newLiked);
      setDislikedReplies(newDisliked);

      // Refresh stats
      fetchReactionStats([replyId]);
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  const handleDislikeReply = async (replyId: string) => {
    const newDisliked = new Set(dislikedReplies);
    const newLiked = new Set(likedReplies);

    try {
      if (newDisliked.has(replyId)) {
        newDisliked.delete(replyId);
        await undislikeComment(replyId);
      } else {
        newDisliked.add(replyId);
        newLiked.delete(replyId);
        await dislikeComment(replyId);

        if (likedReplies.has(replyId)) {
          await unlikeComment(replyId);
        }
      }

      setDislikedReplies(newDisliked);
      setLikedReplies(newLiked);

      // Refresh stats
      fetchReactionStats([replyId]);
    } catch (error) {
      console.error('Error disliking reply:', error);
    }
  };

  const handleSubmitReply = async () => {
    if (!newReply.trim() || submitting) return;

    try {
      setSubmitting(true);
      const newReplyData = await postReply(parentComment.id, targetId, newReply.trim(), targetType);

      setReplies((prev) => [...prev, newReplyData]);
      setNewReply('');

      // Fetch stats for new reply
      fetchReactionStats([newReplyData.id]);
    } catch (error: any) {
      console.error('Error posting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView edges={['bottom', 'top']} className="flex-1">
        <View className="flex-1 bg-black/50">
          <TouchableOpacity activeOpacity={1} onPress={onClose} className="flex-1" />
          <View className="h-4/5 rounded-t-3xl bg-[#1C1C1E]">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-gray-800 p-4">
              <Text className="text-lg font-bold text-white">Replies ({replies.length})</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4">
              {/* Parent Comment */}
              <View className="-mx-4 mb-2 border-b border-gray-800 bg-white/5 px-4 py-4">
                <View className="mb-2 flex-row items-center gap-3">
                  <Image
                    source={{ uri: parentComment.avatarUrl }}
                    className="h-10 w-10 rounded-xl"
                  />
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-white">
                      {parentComment.username}
                    </Text>
                    <View className="mt-0.5 flex-row items-center gap-1">
                      <Time width={14} height={14} />
                      <Text className="text-xs text-gray-400">
                        {getTimeAgo(parentComment.timeAgo)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="mb-2 text-sm leading-5 text-gray-200">
                  {parentComment.comment}
                </Text>
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center">
                    <Like width={18} height={18} />
                    <Text className="ml-1 text-xs text-gray-400">{parentComment.likes}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Dislike width={18} height={18} />
                    <Text className="ml-1 text-xs text-gray-400">{parentComment.dislikes}</Text>
                  </View>
                </View>
              </View>

              {/* Replies */}
              {loading ? (
                <View className="items-center py-12">
                  <ActivityIndicator size="large" color="#9BD71B" />
                  <Text className="mt-4 text-gray-400">Loading replies...</Text>
                </View>
              ) : replies.length === 0 ? (
                <View className="items-center py-12">
                  <Text className="text-sm text-gray-500">
                    No replies yet. Be the first to reply!
                  </Text>
                </View>
              ) : (
                replies.map((reply) => {
                  const isLiked = likedReplies.has(reply.id);
                  const isDisliked = dislikedReplies.has(reply.id);
                  const { likes, dislikes } = getDisplayCounts(reply.id);

                  return (
                    <View key={reply.id} className="border-b border-gray-800/50 py-4">
                      <View className="mb-2 flex-row items-center gap-3">
                        <Image source={{ uri: reply.avatarUrl }} className="h-9 w-9 rounded-xl" />
                        <View className="flex-1">
                          <Text className="text-sm font-normal text-white">{reply.username}</Text>
                          <View className="mt-0.5 flex-row items-center gap-1">
                            <Time width={14} height={14} />
                            <Text className="text-xs text-gray-400">
                              {getTimeAgo(reply.timeAgo)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Text className="mb-2 text-sm leading-5 text-gray-200">{reply.comment}</Text>
                      <View className="flex-row items-center gap-4">
                        <TouchableOpacity
                          className="flex-row items-center"
                          onPress={() => handleLikeReply(reply.id)}>
                          <Like width={18} height={18} style={{ opacity: isLiked ? 1 : 0.6 }} />
                          <Text className="ml-1 text-xs text-gray-400">{likes}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          className="flex-row items-center"
                          onPress={() => handleDislikeReply(reply.id)}>
                          <Dislike
                            width={18}
                            height={18}
                            style={{ opacity: isDisliked ? 1 : 0.6 }}
                          />
                          <Text className="ml-1 text-xs text-gray-400">{dislikes}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                          <Comment width={18} height={18} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            {/* Reply Input */}
            <View className="flex-row items-center border-t border-gray-800 p-4">
              <TextInput
                value={newReply}
                onChangeText={setNewReply}
                placeholder="Add a reply..."
                placeholderTextColor="#9CA3AF"
                className="mr-2 flex-1 rounded-full bg-[#2C2C2E] px-4 py-2 text-white"
                multiline
                maxLength={500}
                editable={!submitting}
              />
              {submitting ? (
                <ActivityIndicator size="small" color="#9BD71B" />
              ) : (
                <TouchableOpacity onPress={handleSubmitReply}>
                  <Camera width={32} height={32} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
