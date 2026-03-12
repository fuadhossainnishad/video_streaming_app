// presentation/videos/components/ShortReplyModal.tsx
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import {
    ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, ScrollView,
    Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Time from '../../../../assets/icons/time.svg';
import Like from '../../../../assets/icons/like2.svg';
import Dislike from '../../../../assets/icons/dislike3.svg';
import Camera from '../../../../assets/icons/camera2.svg';
import CommentItem from './CommentItem';
import { CommentUI } from '@/shared/types/comments.type';
import { getTimeAgo } from '@/shared/utils/comments.utils';
import {
    getCommentReplies,
    postReply,
    getCommentUserReaction,
    getCommentStats,
} from '@/domain/video/api/shortComments.service';

interface ReplyFetchedState {
    reaction: 'like' | 'dislike' | null;
    likesCount: number;
    dislikesCount: number;
}

interface ReplyModalProps {
    visible: boolean;
    onClose: () => void;
    parentComment: CommentUI;
    targetId: string;
    targetType?: 'Video' | 'Post' | 'Short';
}

export default function VideoReplyModal({
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
    const [replyStates, setReplyStates] = useState<Map<string, ReplyFetchedState>>(new Map());

    // ─── Fetch replies + reactions + stats ───────────────────────────────
    const fetchReplies = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getCommentReplies(parentComment.id, 1, 20);
            setReplies(result.comments);

            const settled = await Promise.allSettled(
                result.comments.map(async (r) => {
                    const [reaction, stats] = await Promise.all([
                        getCommentUserReaction(r.id),
                        getCommentStats(r.id),
                    ]);
                    return {
                        id: r.id,
                        reaction,
                        likesCount: stats.likesCount,
                        dislikesCount: stats.dislikesCount,
                    };
                })
            );

            const map = new Map<string, ReplyFetchedState>();
            settled.forEach(entry => {
                if (entry.status === 'fulfilled') {
                    const { id, reaction, likesCount, dislikesCount } = entry.value;
                    map.set(id, { reaction, likesCount, dislikesCount });
                }
            });

            setReplyStates(map);

        } catch (error) {
            console.error('Error fetching replies:', error);
        } finally {
            setLoading(false);
        }
    }, [parentComment.id]);

    useEffect(() => {
        if (visible) fetchReplies();
    }, [visible, fetchReplies]);

    // ─── Submit ───────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!newReply.trim() || submitting) return;
        try {
            setSubmitting(true);
            const created = await postReply(
                parentComment.id, targetId, newReply.trim(), targetType
            );
            setReplies(prev => [...prev, created]);
            setNewReply('');
        } catch (error) {
            console.error('Error posting reply:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
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
                                    Replies ({replies.length})
                                </Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={28} color="white" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                keyboardDismissMode="on-drag"
                                keyboardShouldPersistTaps="handled"
                                className="flex-1 px-4">

                                {/* Parent comment — read only display, no reaction interaction */}
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
                                        <View className="flex-row items-center gap-1">
                                            <Like width={18} height={18} />
                                            <Text className="text-xs text-gray-400">{parentComment.likes}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-1">
                                            <Dislike width={18} height={18} />
                                            <Text className="text-xs text-gray-400">{parentComment.dislikes}</Text>
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
                                    replies.map(reply => {
                                        const state = replyStates.get(reply.id);
                                        return (
                                            <CommentItem
                                                key={reply.id}
                                                comment={reply}
                                                showReplyButton={false}
                                                initialReaction={state?.reaction}
                                                initialLikes={state?.likesCount ?? reply.likes ?? 0}
                                                initialDislikes={state?.dislikesCount ?? reply.dislikes ?? 0}
                                            />
                                        );
                                    })
                                )}
                            </ScrollView>

                            {/* Input */}
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
    );
}
