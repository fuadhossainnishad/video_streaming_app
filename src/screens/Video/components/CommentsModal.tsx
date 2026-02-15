// presentation/videos/components/CommentsModal.tsx
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
import Camera from '../../../../assets/icons/camera2.svg';

import ReplyModal from './ReplyModal';
import { CommentUI } from '@/shared/types/comments.type';
import {
  dislikeComment,
  getVideoComments,
  likeComment,
  postComment,
  undislikeComment,
  unlikeComment,
  getBatchCommentReactionStats,
  CommentReactionStats,
} from '@/domain/video/api/comments.service';
import { getTimeAgo } from '@/shared/utils/comments.utils';

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  videoId: string;
}

export default function CommentsModal({ visible, onClose, videoId }: CommentsModalProps) {
  const [comments, setComments] = useState<CommentUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [dislikedComments, setDislikedComments] = useState<Set<string>>(new Set());
  const [selectedComment, setSelectedComment] = useState<CommentUI | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  
  // NEW: Reaction stats from server
  const [reactionStats, setReactionStats] = useState<Map<string, CommentReactionStats>>(new Map());
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getVideoComments(videoId, 1, 20);
      setComments(result.comments);
      
      // Fetch reaction stats for all comments
      if (result.comments.length > 0) {
        fetchReactionStats(result.comments.map(c => c.id));
      }
    } catch (error: any) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  // NEW: Fetch reaction stats
  const fetchReactionStats = useCallback(async (commentIds: string[]) => {
    try {
      setStatsLoading(true);
      const stats = await getBatchCommentReactionStats(commentIds);
      setReactionStats(stats);
    } catch (error) {
      console.error('Error fetching reaction stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      fetchComments();
    }
  }, [visible, fetchComments]);

  // NEW: Get display counts (server stats or optimistic local updates)
  const getDisplayCounts = useCallback((commentId: string) => {
    const serverStats = reactionStats.get(commentId);
    const comment = comments.find(c => c.id === commentId);
    
    // Use server stats if available, otherwise fall back to comment data
    const baseLikes = serverStats?.likesCount ?? comment?.likes ?? 0;
    const baseDislikes = serverStats?.dislikesCount ?? comment?.dislikes ?? 0;
    
    // Apply optimistic updates
    let likes = baseLikes;
    let dislikes = baseDislikes;
    
    if (likedComments.has(commentId)) {
      likes = baseLikes + 1;
      if (dislikedComments.has(commentId)) {
        dislikes = baseDislikes - 1;
      }
    } else if (dislikedComments.has(commentId)) {
      dislikes = baseDislikes + 1;
    }
    
    return { likes, dislikes };
  }, [comments, reactionStats, likedComments, dislikedComments]);

  const handleLikeComment = async (commentId: string) => {
    const newLiked = new Set(likedComments);
    const newDisliked = new Set(dislikedComments);

    try {
      if (newLiked.has(commentId)) {
        // Unlike
        newLiked.delete(commentId);
        await unlikeComment(commentId);
      } else {
        // Like
        newLiked.add(commentId);
        newDisliked.delete(commentId);
        await likeComment(commentId);

        // Remove dislike if exists
        if (dislikedComments.has(commentId)) {
          await undislikeComment(commentId);
        }
      }

      setLikedComments(newLiked);
      setDislikedComments(newDisliked);
      
      // Refresh stats from server
      fetchReactionStats([commentId]);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDislikeComment = async (commentId: string) => {
    const newDisliked = new Set(dislikedComments);
    const newLiked = new Set(likedComments);

    try {
      if (newDisliked.has(commentId)) {
        // Remove dislike
        newDisliked.delete(commentId);
        await undislikeComment(commentId);
      } else {
        // Dislike
        newDisliked.add(commentId);
        newLiked.delete(commentId);
        await dislikeComment(commentId);

        // Remove like if exists
        if (likedComments.has(commentId)) {
          await unlikeComment(commentId);
        }
      }

      setDislikedComments(newDisliked);
      setLikedComments(newLiked);
      
      // Refresh stats from server
      fetchReactionStats([commentId]);
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

  const handleOpenReplies = (comment: CommentUI) => {
    setSelectedComment(comment);
    setShowReplyModal(true);
  };

  const handleCloseReplyModal = () => {
    setShowReplyModal(false);
    setSelectedComment(null);
    // Refresh comments to get updated reply counts
    fetchComments();
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const newCommentData = await postComment(videoId, newComment.trim());

      // Add new comment to the list
      setComments((prev) => [newCommentData, ...prev]);
      setNewComment('');
      
      // Fetch stats for new comment
      fetchReactionStats([newCommentData.id]);
    } catch (error: any) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <SafeAreaView edges={['bottom', 'top']} className="flex-1">
          <View className="flex-1 bg-black/50">
            <TouchableOpacity activeOpacity={1} onPress={onClose} className="flex-1" />
            <View className="h-4/5 rounded-t-3xl bg-[#1C1C1E]">
              {/* Header */}
              <View className="flex-row items-center justify-between border-b border-gray-800 p-4">
                <Text className="text-lg font-bold text-white">Comments {comments.length}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>
              </View>

              {/* Comments List */}
              <ScrollView className="flex-1 px-4">
                {loading ? (
                  <View className="items-center py-12">
                    <ActivityIndicator size="large" color="#9BD71B" />
                    <Text className="mt-4 text-gray-400">Loading comments...</Text>
                  </View>
                ) : comments.length === 0 ? (
                  <View className="items-center py-12">
                    <Text className="text-sm text-gray-500">
                      No comments yet. Be the first to comment!
                    </Text>
                  </View>
                ) : (
                  comments.map((comment) => {
                    const isLiked = likedComments.has(comment.id);
                    const isDisliked = dislikedComments.has(comment.id);
                    const { likes, dislikes } = getDisplayCounts(comment.id);

                    return (
                      <View key={comment.id} className="border-b border-gray-800 py-4">
                        <View className="mb-2 flex-row items-center gap-3">
                          <Image
                            source={{ uri: comment.avatarUrl }}
                            className="h-10 w-10 rounded-xl"
                          />
                          <View className="flex-1">
                            <View className="flex-row items-center gap-2">
                              <Text className="text-sm font-medium text-white">
                                {comment.username}
                              </Text>
                              {comment.isPinned && (
                                <View className="rounded bg-[#9BD71B]/20 px-2 py-0.5">
                                  <Text className="text-xs font-medium text-[#9BD71B]">Pinned</Text>
                                </View>
                              )}
                            </View>
                            <View className="mt-0.5 flex-row items-center gap-1">
                              <Time width={14} height={14} />
                              <Text className="text-xs text-gray-400">
                                {getTimeAgo(comment.timeAgo)}
                              </Text>
                              {comment.isEdited && (
                                <Text className="text-xs text-gray-500">• edited</Text>
                              )}
                            </View>
                          </View>
                        </View>

                        <Text className="mb-3 text-sm leading-5 text-gray-200">
                          {comment.comment}
                        </Text>

                        <View className="mb-2 flex-row items-center gap-4">
                          <TouchableOpacity
                            className="flex-row items-center"
                            onPress={() => handleLikeComment(comment.id)}>
                            <Like width={20} height={20} style={{ opacity: isLiked ? 1 : 0.6 }} />
                            <Text className="ml-1 text-xs text-gray-400">{likes}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="flex-row items-center"
                            onPress={() => handleDislikeComment(comment.id)}>
                            <Dislike
                              width={20}
                              height={20}
                              style={{ opacity: isDisliked ? 1 : 0.6 }}
                            />
                            <Text className="ml-1 text-xs text-gray-400">{dislikes}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => handleOpenReplies(comment)}>
                            <Comment width={20} height={20} />
                          </TouchableOpacity>
                        </View>

                        {comment.replyCount > 0 && (
                          <TouchableOpacity
                            className="self-end"
                            onPress={() => handleOpenReplies(comment)}>
                            <Text className="text-sm font-normal text-[#9BD71B]">
                              {comment.replyCount} {comment.replyCount === 1 ? 'Reply' : 'Replies'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })
                )}
              </ScrollView>

              {/* Comment Input */}
              <View className="flex-row items-center border-t border-gray-800 p-4">
                <TextInput
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholder="Add a comment..."
                  placeholderTextColor="#9CA3AF"
                  className="mr-2 flex-1 rounded-full bg-[#2C2C2E] px-4 py-2 text-white"
                  multiline
                  maxLength={500}
                  editable={!submitting}
                />
                {submitting ? (
                  <ActivityIndicator size="small" color="#9BD71B" />
                ) : (
                  <TouchableOpacity onPress={handleSubmitComment}>
                    <Camera width={32} height={32} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Reply Modal */}
      {selectedComment && (
        <ReplyModal
          visible={showReplyModal}
          onClose={handleCloseReplyModal}
          parentComment={selectedComment}
          targetId={videoId}
          targetType="Video"
        />
      )}
    </>
  );
}