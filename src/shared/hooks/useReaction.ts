import { useState, useCallback, useEffect } from 'react';
import { toggleReaction } from '@/domain/video/api/reaction.service';

export const useReaction = (
    targetId: string,
    targetType: string,
    initialLikes: number = 0,
    initialDislikes: number = 0
) => {
    const [userReaction, setUserReaction] =
        useState<'like' | 'dislike' | null>(null);

    const [likesCount, setLikesCount] = useState(initialLikes);
    const [dislikesCount, setDislikesCount] = useState(initialDislikes);
    const [loading, setLoading] = useState(false);

    // Sync when video changes
    useEffect(() => {
        setLikesCount(initialLikes ?? 0);
        setDislikesCount(initialDislikes ?? 0);
        setUserReaction(null); // reset when video changes
    }, [targetId, initialLikes, initialDislikes]);

    const handleToggleReaction = useCallback(
        async (type: 'like' | 'dislike') => {
            if (!targetId) return;

            try {
                setLoading(true);

                const response = await toggleReaction(targetId, type, targetType);

                const { reaction, likesCount, dislikesCount } = response.data;

                // ✅ SAFE handling
                setUserReaction(reaction ? reaction.reactionType : null);

                // ✅ If backend returns counts → update
                if (typeof likesCount === "number") {
                    setLikesCount(likesCount);
                }

                if (typeof dislikesCount === "number") {
                    setDislikesCount(dislikesCount);
                }

            } catch (error) {
                console.error("Toggle reaction failed", error);
            } finally {
                setLoading(false);
            }
        },
        [targetId, targetType]
    );

    return {
        userReaction,
        likesCount,
        dislikesCount,
        loading,
        toggleReaction: handleToggleReaction,
    };
};