import { useState, useCallback, useEffect } from 'react';
import { toggleReaction, getUserReaction } from '@/domain/video/api/reaction.service';

export const useReaction = (
    targetId: string,
    targetType: string,
    initialLikes: number = 0,
    initialDislikes: number = 0
) => {
    const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [dislikesCount, setDislikesCount] = useState(initialDislikes);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);

    // ─── Sync counts when video changes ──────────────────────────────────
    useEffect(() => {
        setLikesCount(initialLikes ?? 0);
        setDislikesCount(initialDislikes ?? 0);
    }, [targetId, initialLikes, initialDislikes]);

    // ─── Fetch existing reaction on load ─────────────────────────────────
    useEffect(() => {
        if (!targetId || targetId.trim() === '') return;
        const fetchUserReaction = async () => {
            try {
                setChecking(true);
                setUserReaction(null);
                console.log('fetching reaction for:', targetId); // ← add this

                const response = await getUserReaction(targetId, targetType);
                console.log('reaction check response:', JSON.stringify(response?.data));
                const { isLiked, isDisliked } = response?.data ?? {};
                console.log('parsed:', { isLiked, isDisliked });
                if (isLiked) setUserReaction('like');
                else if (isDisliked) setUserReaction('dislike');
                else setUserReaction(null);

            } catch (error) {
                console.error('fetchUserReaction error:', error);
                setUserReaction(null);
            } finally {
                setChecking(false);
            }
        };

        fetchUserReaction();
    }, [targetId, targetType]);

    // ─── Toggle with optimistic update ───────────────────────────────────
    const handleToggleReaction = useCallback(
        async (type: 'like' | 'dislike') => {
            if (!targetId || loading) return;

            // ── Snapshot for rollback ────────────────────────────────────
            const prevReaction = userReaction;
            const prevLikes = likesCount;
            const prevDislikes = dislikesCount;

            // ── Optimistic update ────────────────────────────────────────
            const isSame = userReaction === type;

            if (isSame) {
                // Same reaction → remove it
                setUserReaction(null);
                if (type === 'like') setLikesCount(c => c - 1);
                if (type === 'dislike') setDislikesCount(c => c - 1);
            } else {
                // Different reaction → switch
                setUserReaction(type);
                if (type === 'like') {
                    setLikesCount(c => c + 1);
                    if (prevReaction === 'dislike') setDislikesCount(c => c - 1);
                }
                if (type === 'dislike') {
                    setDislikesCount(c => c + 1);
                    if (prevReaction === 'like') setLikesCount(c => c - 1);
                }
            }

            // ── API call ─────────────────────────────────────────────────
            try {
                setLoading(true);
                const response = await toggleReaction(targetId, type, targetType);
                const {
                    reaction,
                    likesCount: serverLikes,
                    dislikesCount: serverDislikes,
                } = response.data;

                // Sync with server truth
                if (reaction?.reactionType) {
                    setUserReaction(reaction.reactionType);
                } else {
                    setUserReaction(null);
                }

                if (typeof serverLikes === 'number') setLikesCount(serverLikes);
                if (typeof serverDislikes === 'number') setDislikesCount(serverDislikes);

            } catch (error) {
                // ── Rollback ─────────────────────────────────────────────
                console.error('Toggle reaction failed', error);
                setUserReaction(prevReaction);
                setLikesCount(prevLikes);
                setDislikesCount(prevDislikes);
            } finally {
                setLoading(false);
            }
        },
        [targetId, targetType, userReaction, likesCount, dislikesCount, loading]
    );

    return {
        userReaction,
        likesCount,
        dislikesCount,
        loading,
        checking,
        toggleReaction: handleToggleReaction,
    };
};