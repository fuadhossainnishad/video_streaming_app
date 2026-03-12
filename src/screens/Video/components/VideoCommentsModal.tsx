import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text,
  TextInput, TouchableOpacity, TouchableWithoutFeedback, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Camera from '../../../../assets/icons/camera2.svg';
import CommentItem from './CommentItem';
import { CommentUI } from '@/shared/types/comments.type';
import VideoReplyModal from './VideoReplyModal';
import { getCommentStats, getCommentUserReaction, getVideoComments, postComment } from '@/domain/video/api/videoComments.service';


interface CommentFetchedState {
  reaction: 'like' | 'dislike' | null;
  likesCount: number;
  dislikesCount: number;
}

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  videoId: string;
  targetType?: 'Video' | 'Short' | 'Post';
}

export default function VideoCommentsModal({
  visible,
  onClose,
  videoId,
  targetType = 'Video',
}: CommentsModalProps) {
  const [comments, setComments] = useState<CommentUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedComment, setSelectedComment] = useState<CommentUI | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [commentStates, setCommentStates] = useState<Map<string, CommentFetchedState>>(new Map());
  // ─── Fetch comments + reactions + stats ───────────────────────────────
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getVideoComments(videoId, 1, 20);
      setComments(result.comments);

      const settled = await Promise.allSettled(
        result.comments.map(async (c) => {
          const [reaction, stats] = await Promise.all([
            getCommentUserReaction(c.id),
            getCommentStats(c.id),
          ]);
          return {
            id: c.id,
            reaction,
            likesCount: stats.likesCount,
            dislikesCount: stats.dislikesCount,
          };
        })
      );

      const map = new Map<string, CommentFetchedState>();
      settled.forEach(entry => {
        if (entry.status === 'fulfilled') {
          const { id, reaction, likesCount, dislikesCount } = entry.value;
          map.set(id, { reaction, likesCount, dislikesCount });
        }
      });

      setCommentStates(map);

    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    if (visible) fetchComments();
  }, [visible, fetchComments]);

  // ─── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return;
    try {
      setSubmitting(true);
      const created = await postComment(videoId, newComment.trim(), targetType);

      setComments(prev => [created, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Reply ────────────────────────────────────────────────────────────
  const handleOpenReplies = useCallback((comment: CommentUI) => {
    setSelectedComment(comment);
    setShowReplyModal(true);
  }, []);

  const handleCloseReply = useCallback(() => {
    setShowReplyModal(false);
    setSelectedComment(null);
    fetchComments();
  }, [fetchComments]);

  return (
    <
      >
      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
        >
          <SafeAreaView edges={['bottom', 'top']} className="flex-1">
            <View className="flex-1 bg-black/50">
              <TouchableOpacity activeOpacity={1} onPress={onClose} className="flex-1" />


              <View className="h-4/5 rounded-t-3xl bg-[#1C1C1E]">



                {/* Header */}
                <View className="flex-row items-center justify-between border-b border-gray-800 p-4">
                  <Text className="text-lg font-bold text-white">
                    Comments {comments.length}
                  </Text>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={28} color="white" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  keyboardDismissMode="on-drag"
                  keyboardShouldPersistTaps="handled"
                  className="flex-1 px-4">
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
                    comments.map(comment => {
                      // ── Extract state per comment ── ✅ this was missing
                      const state = commentStates.get(comment.id);
                      return (
                        <CommentItem
                          key={comment.id}
                          comment={comment}
                          onReply={handleOpenReplies}
                          initialReaction={state?.reaction}
                          initialLikes={state?.likesCount ?? comment.likes ?? 0}
                          initialDislikes={state?.dislikesCount ?? comment.dislikes ?? 0}
                        />
                      );
                    })
                  )}
                </ScrollView>
                {/* Input */}
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
                    <TouchableOpacity onPress={handleSubmit}>
                      <Camera width={32} height={32} />
                    </TouchableOpacity>
                  )}
                </View>

              </View>

            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>

      {selectedComment && (
        <VideoReplyModal
          visible={showReplyModal}
          onClose={handleCloseReply}
          parentComment={selectedComment}
          targetId={videoId}
          targetType={targetType}
        />
      )}
    </>

  );
}