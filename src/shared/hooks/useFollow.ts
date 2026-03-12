import { useState, useEffect, useCallback } from 'react';
import { toggleFollow, checkFollowStatus } from '@/domain/video/api/follow.service';

export const useFollow = (
    channelId: string,
    initialFollowers: number
) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [followersCount, setFollowersCount] = useState<number>(initialFollowers ?? 0);
    const [checking, setChecking] = useState<boolean>(false);
    const [toggling, setToggling] = useState<boolean>(false);

    // ─── Sync followers count when video data loads ───────────────────────
    useEffect(() => {
        setFollowersCount(initialFollowers ?? 0);
    }, [channelId, initialFollowers]);

    // ─── Check follow status on load ──────────────────────────────────────
    useEffect(() => {
        if (!channelId || channelId.trim() === '') return;

        let mounted = true;

        const checkStatus = async () => {
            try {
                setChecking(true);

                const response = await checkFollowStatus(channelId);

                console.log('follow check raw:', JSON.stringify(response?.data));

                // Handle both response.data and response.data.data
                const data = response?.data?.data ?? response?.data ?? {};
                const following = data?.isFollowing ?? false;

                if (mounted) setIsFollowing(following);

            } catch {
                if (mounted) setIsFollowing(false);
            } finally {
                if (mounted) setChecking(false);
            }
        };

        checkStatus();

        return () => { mounted = false; };
    }, [channelId]);

    // ─── Toggle follow with optimistic update ─────────────────────────────
    const handleToggle = useCallback(async () => {
        if (toggling || checking || !channelId) return;

        // ── Snapshot for rollback ────────────────────────────────────────
        const prevFollowing = isFollowing;
        const prevCount = followersCount;

        // ── Optimistic update ────────────────────────────────────────────
        const newFollowing = !isFollowing;
        setIsFollowing(newFollowing);
        setFollowersCount(c => newFollowing
            ? c + 1
            : Math.max(0, c - 1)
        );

        // ── API call ─────────────────────────────────────────────────────
        try {
            setToggling(true);
            const response = await toggleFollow(channelId);

            console.log('toggle follow raw:', JSON.stringify(response?.data));

            const data = response?.data?.data ?? response?.data ?? {};
            const serverFollowing = data?.isFollowing ?? newFollowing;

            // Sync with server truth
            setIsFollowing(serverFollowing);

            // If server state differs from optimistic — fix count
            if (serverFollowing !== newFollowing) {
                setFollowersCount(c => serverFollowing
                    ? c + 1
                    : Math.max(0, c - 1)
                );
            }

        } catch (error) {
            // ── Rollback on failure ──────────────────────────────────────
            console.error('Toggle follow failed:', error);
            setIsFollowing(prevFollowing);
            setFollowersCount(prevCount);
        } finally {
            setToggling(false);
        }
    }, [channelId, isFollowing, followersCount, toggling, checking]);

    return {
        isFollowing,
        followersCount,
        checking,
        loading: toggling,
        toggleFollow: handleToggle,
    };
};