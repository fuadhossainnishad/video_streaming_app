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
import { dislikeComment, getVideoComments, likeComment, postComment, undislikeComment, unlikeComment } from '@/domain/video/api/comments.service';
import { getTimeAgo } from '@/shared/utils/comments.utils';

interface CommentsModalProps {
    visible: boolean;
    onClose: () => void;
    videoId: string;
}

export default function CommentsModal({
    visible,
    onClose,
    videoId,
}: CommentsModalProps) {
    const [comments, setComments] = useState<CommentUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const [dislikedComments, setDislikedComments] = useState<Set<string>>(new Set());
    const [selectedComment, setSelectedComment] = useState<CommentUI | null>(null);
    const [showReplyModal, setShowReplyModal] = useState(false);

    // Fetch comments
    const fetchComments = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getVideoComments(videoId, 1, 20);
            setComments(result.comments);
        } catch (error: any) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    }, [videoId]);

    useEffect(() => {
        if (visible) {
            fetchComments();
        }
    }, [visible, fetchComments]);

    const handleLikeComment = async (commentId: string) => {
        const newLiked = new Set(likedComments);
        const newDisliked = new Set(dislikedComments);

        try {
            if (newLiked.has(commentId)) {
                // Unlike
                newLiked.delete(commentId);
                await unlikeComment(commentId);

                // Update local state
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...c, likes: c.likes - 1 } : c
                    )
                );
            } else {
                // Like
                newLiked.add(commentId);
                newDisliked.delete(commentId);
                await likeComment(commentId);

                // Update local state
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId
                            ? {
                                ...c,
                                likes: c.likes + 1,
                                dislikes: dislikedComments.has(commentId)
                                    ? c.dislikes - 1
                                    : c.dislikes,
                            }
                            : c
                    )
                );

                // Remove dislike if exists
                if (dislikedComments.has(commentId)) {
                    await undislikeComment(commentId);
                }
            }

            setLikedComments(newLiked);
            setDislikedComments(newDisliked);
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

                // Update local state
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...c, dislikes: c.dislikes - 1 } : c
                    )
                );
            } else {
                // Dislike
                newDisliked.add(commentId);
                newLiked.delete(commentId);
                await dislikeComment(commentId);

                // Update local state
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId
                            ? {
                                ...c,
                                dislikes: c.dislikes + 1,
                                likes: likedComments.has(commentId) ? c.likes - 1 : c.likes,
                            }
                            : c
                    )
                );

                // Remove like if exists
                if (likedComments.has(commentId)) {
                    await unlikeComment(commentId);
                }
            }

            setDislikedComments(newDisliked);
            setLikedComments(newLiked);
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
            setComments(prev => [newCommentData, ...prev]);
            setNewComment('');
        } catch (error: any) {
            console.error('Error posting comment:', error);
            // Show error to user
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Modal visible={visible} transparent animationType="slide">
                <SafeAreaView edges={['bottom', 'top']} className="flex-1">
                    <View className="flex-1 bg-black/50">
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={onClose}
                            className="flex-1"
                        />
                        <View className="bg-[#1C1C1E] rounded-t-3xl h-4/5">
                            {/* Header */}
                            <View className="p-4 border-b border-gray-800 flex-row justify-between items-center">
                                <Text className="text-white font-bold text-lg">
                                    Comments {comments.length}
                                </Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={28} color="white" />
                                </TouchableOpacity>
                            </View>

                            {/* Comments List */}
                            <ScrollView className="flex-1 px-4">
                                {loading ? (
                                    <View className="py-12 items-center">
                                        <ActivityIndicator size="large" color="#9BD71B" />
                                        <Text className="text-gray-400 mt-4">Loading comments...</Text>
                                    </View>
                                ) : comments.length === 0 ? (
                                    <View className="py-12 items-center">
                                        <Text className="text-gray-500 text-sm">
                                            No comments yet. Be the first to comment!
                                        </Text>
                                    </View>
                                ) : (
                                    comments.map(comment => {
                                        const isLiked = likedComments.has(comment.id);
                                        const isDisliked = dislikedComments.has(comment.id);

                                        return (
                                            <View
                                                key={comment.id}
                                                className="py-4 border-b border-gray-800"
                                            >
                                                <View className="flex-row items-center gap-3 mb-2">
                                                    <Image
                                                        source={{ uri: comment.avatarUrl }}
                                                        className="w-10 h-10 rounded-xl"
                                                    />
                                                    <View className="flex-1">
                                                        <View className="flex-row items-center gap-2">
                                                            <Text className="text-white font-medium text-sm">
                                                                {comment.username}
                                                            </Text>
                                                            {comment.isPinned && (
                                                                <View className="bg-[#9BD71B]/20 px-2 py-0.5 rounded">
                                                                    <Text className="text-[#9BD71B] text-xs font-medium">
                                                                        Pinned
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                        <View className="flex-row items-center gap-1 mt-0.5">
                                                            <Time width={14} height={14} />
                                                            <Text className="text-gray-400 text-xs">
                                                                {getTimeAgo(comment.timeAgo)}
                                                            </Text>
                                                            {comment.isEdited && (
                                                                <Text className="text-gray-500 text-xs">
                                                                    • edited
                                                                </Text>
                                                            )}
                                                        </View>
                                                    </View>
                                                </View>

                                                <Text className="text-gray-200 text-sm leading-5 mb-3">
                                                    {comment.comment}
                                                </Text>

                                                <View className="flex-row gap-4 items-center mb-2">
                                                    <TouchableOpacity
                                                        className="flex-row items-center"
                                                        onPress={() => handleLikeComment(comment.id)}
                                                    >
                                                        <Like
                                                            width={20}
                                                            height={20}
                                                            style={{ opacity: isLiked ? 1 : 0.6 }}
                                                        />
                                                        <Text className="text-gray-400 text-xs ml-1">
                                                            {comment.likes}
                                                        </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        className="flex-row items-center"
                                                        onPress={() => handleDislikeComment(comment.id)}
                                                    >
                                                        <Dislike
                                                            width={20}
                                                            height={20}
                                                            style={{ opacity: isDisliked ? 1 : 0.6 }}
                                                        />
                                                        <Text className="text-gray-400 text-xs ml-1">
                                                            {comment.dislikes}
                                                        </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        onPress={() => handleOpenReplies(comment)}
                                                    >
                                                        <Comment width={20} height={20} />
                                                    </TouchableOpacity>
                                                </View>

                                                {comment.replyCount > 0 && (
                                                    <TouchableOpacity
                                                        className="self-end"
                                                        onPress={() => handleOpenReplies(comment)}
                                                    >
                                                        <Text className="text-[#9BD71B] font-normal text-sm">
                                                            {comment.replyCount}{' '}
                                                            {comment.replyCount === 1 ? 'Reply' : 'Replies'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        );
                                    })
                                )}
                            </ScrollView>

                            {/* Comment Input */}
                            <View className="p-4 border-t border-gray-800 flex-row items-center">
                                <TextInput
                                    value={newComment}
                                    onChangeText={setNewComment}
                                    placeholder="Add a comment..."
                                    placeholderTextColor="#9CA3AF"
                                    className="flex-1 bg-[#2C2C2E] rounded-full px-4 py-2 text-white mr-2"
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
                />
            )}
        </>
    );
}