// shared/hooks/useCommentReaction.ts
import { toggleCommentReaction } from '@/domain/video/api/shortComments.service';
import { useState, useCallback, useEffect, useRef } from 'react';

export const useCommentReaction = (
    commentId: string,
    initialLikes: number,
    initialDislikes: number,
    initialReaction?: 'like' | 'dislike' | null,
) => {
    const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
    const [likesCount, setLikesCount] = useState(initialLikes ?? 0);
    const [dislikesCount, setDislikesCount] = useState(initialDislikes ?? 0);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    // Track whether initial data from parent has been applied
    const initialApplied = useRef(false);
    // Track whether user has interacted — block any prop sync after this
    const userInteracted = useRef(false);

    // ─── Apply initial data exactly once when parent resolves ────────────
    useEffect(() => {
        // Skip if already applied or user already interacted
        if (initialApplied.current) return;
        if (userInteracted.current) return;
        // Skip if parent hasn't resolved yet (still undefined)
        if (initialReaction === undefined) return;
        if (initialLikes === undefined || initialDislikes === undefined) return;

        initialApplied.current = true;
        setUserReaction(initialReaction);   // null | 'like' | 'dislike'
        setLikesCount(initialLikes);
        setDislikesCount(initialDislikes);
        setChecking(false);
    }, [initialReaction, initialLikes, initialDislikes]);

    // ─── Toggle with optimistic update ───────────────────────────────────
    const toggleReaction = useCallback(async (type: 'like' | 'dislike') => {
        if (loading || checking || !commentId) return;

        // Mark user has interacted — block any further prop sync
        userInteracted.current = true;

        const prevReaction = userReaction;
        const prevLikes = likesCount;
        const prevDislikes = dislikesCount;
        const isSame = userReaction === type;
        const isOpposite = userReaction !== null && userReaction !== type;

        // ── Optimistic update ────────────────────────────────────────────
        if (isSame) {
            // Tap same reaction → remove it
            setUserReaction(null);
            if (type === 'like') setLikesCount(c => Math.max(0, c - 1));
            if (type === 'dislike') setDislikesCount(c => Math.max(0, c - 1));
        } else {
            // Tap new reaction → add it, remove opposite if exists
            setUserReaction(type);
            if (type === 'like') {
                setLikesCount(c => c + 1);
                if (isOpposite) setDislikesCount(c => Math.max(0, c - 1));
            }
            if (type === 'dislike') {
                setDislikesCount(c => c + 1);
                if (isOpposite) setLikesCount(c => Math.max(0, c - 1));
            }
        }

        // ── API call ─────────────────────────────────────────────────────
        try {
            setLoading(true);
            if (isOpposite) {
                // Must remove current reaction before adding new one
                await toggleCommentReaction(commentId, prevReaction!);
                await toggleCommentReaction(commentId, type);
            } else {
                // Same = remove | null = add
                await toggleCommentReaction(commentId, type);
            }
        } catch {
            // ── Rollback only on API failure ──────────────────────────────
            setUserReaction(prevReaction);
            setLikesCount(prevLikes);
            setDislikesCount(prevDislikes);
        } finally {
            setLoading(false);
        }
    }, [commentId, userReaction, likesCount, dislikesCount, loading, checking]);

    return {
        userReaction,
        likesCount,
        dislikesCount,
        loading,
        checking,
        toggleReaction,
    };
};
