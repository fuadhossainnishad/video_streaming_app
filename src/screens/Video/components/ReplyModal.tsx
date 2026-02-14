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
import Camera from '../../../../assets/icons/camera2.svg';
import { CommentUI } from '@/shared/types/comments.type';
import { dislikeComment, getCommentReplies, likeComment, postReply, undislikeComment, unlikeComment } from '@/domain/video/api/comments.service';
import { getTimeAgo } from '@/shared/utils/comments.utils';


interface ReplyModalProps {
    visible: boolean;
    onClose: () => void;
    parentComment: CommentUI
}

export default function ReplyModal({
    visible,
    onClose,
    parentComment,
}: ReplyModalProps) {
    const [replies, setReplies] = useState<CommentUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newReply, setNewReply] = useState('');
    const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());
    const [dislikedReplies, setDislikedReplies] = useState<Set<string>>(new Set());

    // Fetch replies
    const fetchReplies = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getCommentReplies(parentComment.id, 1, 20);
            setReplies(result.comments);
        } catch (error: any) {
            console.error('Error fetching replies:', error);
        } finally {
            setLoading(false);
        }
    }, [parentComment.id]);

    useEffect(() => {
        if (visible) {
            fetchReplies();
        }
    }, [visible, fetchReplies]);

    const handleLikeReply = async (replyId: string) => {
        const newLiked = new Set(likedReplies);
        const newDisliked = new Set(dislikedReplies);

        try {
            if (newLiked.has(replyId)) {
                newLiked.delete(replyId);
                await unlikeComment(replyId);

                setReplies(prev =>
                    prev.map(r => (r.id === replyId ? { ...r, likes: r.likes - 1 } : r))
                );
            } else {
                newLiked.add(replyId);
                newDisliked.delete(replyId);
                await likeComment(replyId);

                setReplies(prev =>
                    prev.map(r =>
                        r.id === replyId
                            ? {
                                ...r,
                                likes: r.likes + 1,
                                dislikes: dislikedReplies.has(replyId)
                                    ? r.dislikes - 1
                                    : r.dislikes,
                            }
                            : r
                    )
                );

                if (dislikedReplies.has(replyId)) {
                    await undislikeComment(replyId);
                }
            }

            setLikedReplies(newLiked);
            setDislikedReplies(newDisliked);
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

                setReplies(prev =>
                    prev.map(r =>
                        r.id === replyId ? { ...r, dislikes: r.dislikes - 1 } : r
                    )
                );
            } else {
                newDisliked.add(replyId);
                newLiked.delete(replyId);
                await dislikeComment(replyId);

                setReplies(prev =>
                    prev.map(r =>
                        r.id === replyId
                            ? {
                                ...r,
                                dislikes: r.dislikes + 1,
                                likes: likedReplies.has(replyId) ? r.likes - 1 : r.likes,
                            }
                            : r
                    )
                );

                if (likedReplies.has(replyId)) {
                    await unlikeComment(replyId);
                }
            }

            setDislikedReplies(newDisliked);
            setLikedReplies(newLiked);
        } catch (error) {
            console.error('Error disliking reply:', error);
        }
    };

    const handleSubmitReply = async () => {
        if (!newReply.trim() || submitting) return;

        try {
            setSubmitting(true);
            const newReplyData = await postReply(parentComment.id, newReply.trim());

            setReplies(prev => [...prev, newReplyData]);
            setNewReply('');
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
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={onClose}
                        className="flex-1"
                    />
                    <View className="bg-[#1C1C1E] rounded-t-3xl h-4/5">
                        {/* Header */}
                        <View className="p-4 border-b border-gray-800 flex-row justify-between items-center">
                            <Text className="text-white font-bold text-lg">
                                Replies ({replies.length})
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={28} color="white" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="flex-1 px-4">
                            {/* Parent Comment */}
                            <View className="py-4 border-b border-gray-800 bg-white/5 -mx-4 px-4 mb-2">
                                <View className="flex-row items-center gap-3 mb-2">
                                    <Image
                                        source={{ uri: parentComment.avatarUrl }}
                                        className="w-10 h-10 rounded-xl"
                                    />
                                    <View className="flex-1">
                                        <Text className="text-white font-semibold text-sm">
                                            {parentComment.username}
                                        </Text>
                                        <View className="flex-row items-center gap-1 mt-0.5">
                                            <Time width={14} height={14} />
                                            <Text className="text-gray-400 text-xs">
                                                {getTimeAgo(parentComment.timeAgo)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text className="text-gray-200 text-sm leading-5 mb-2">
                                    {parentComment.comment}
                                </Text>
                                <View className="flex-row gap-4 items-center">
                                    <View className="flex-row items-center">
                                        <Like width={18} height={18} />
                                        <Text className="text-gray-400 text-xs ml-1">
                                            {parentComment.likes}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Dislike width={18} height={18} />
                                        <Text className="text-gray-400 text-xs ml-1">
                                            {parentComment.dislikes}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Replies */}
                            {loading ? (
                                <View className="py-12 items-center">
                                    <ActivityIndicator size="large" color="#9BD71B" />
                                    <Text className="text-gray-400 mt-4">Loading replies...</Text>
                                </View>
                            ) : replies.length === 0 ? (
                                <View className="py-12 items-center">
                                    <Text className="text-gray-500 text-sm">
                                        No replies yet. Be the first to reply!
                                    </Text>
                                </View>
                            ) : (
                                replies.map(reply => {
                                    const isLiked = likedReplies.has(reply.id);
                                    const isDisliked = dislikedReplies.has(reply.id);

                                    return (
                                        <View
                                            key={reply.id}
                                            className="py-4 border-b border-gray-800/50"
                                        >
                                            <View className="flex-row items-center gap-3 mb-2">
                                                <Image
                                                    source={{ uri: reply.avatarUrl }}
                                                    className="w-9 h-9 rounded-xl"
                                                />
                                                <View className="flex-1">
                                                    <Text className="text-white font-normal text-sm">
                                                        {reply.username}
                                                    </Text>
                                                    <View className="flex-row items-center gap-1 mt-0.5">
                                                        <Time width={14} height={14} />
                                                        <Text className="text-gray-400 text-xs">
                                                            {getTimeAgo(reply.timeAgo)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <Text className="text-gray-200 text-sm leading-5 mb-2">
                                                {reply.comment}
                                            </Text>
                                            <View className="flex-row gap-4 items-center">
                                                <TouchableOpacity
                                                    className="flex-row items-center"
                                                    onPress={() => handleLikeReply(reply.id)}
                                                >
                                                    <Like
                                                        width={18}
                                                        height={18}
                                                        style={{ opacity: isLiked ? 1 : 0.6 }}
                                                    />
                                                    <Text className="text-gray-400 text-xs ml-1">
                                                        {reply.likes}
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    className="flex-row items-center"
                                                    onPress={() => handleDislikeReply(reply.id)}
                                                >
                                                    <Dislike
                                                        width={18}
                                                        height={18}
                                                        style={{ opacity: isDisliked ? 1 : 0.6 }}
                                                    />
                                                    <Text className="text-gray-400 text-xs ml-1">
                                                        {reply.dislikes}
                                                    </Text>
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
                        <View className="p-4 border-t border-gray-800 flex-row items-center">
                            <TextInput
                                value={newReply}
                                onChangeText={setNewReply}
                                placeholder="Add a reply..."
                                placeholderTextColor="#9CA3AF"
                                className="flex-1 bg-[#2C2C2E] rounded-full px-4 py-2 text-white mr-2"
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