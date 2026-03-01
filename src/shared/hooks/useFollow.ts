import { useState, useEffect, useCallback } from 'react';
import {
    toggleFollow,
    checkFollowStatus,
} from '@/domain/video/api/follow.service';

export const useFollow = (
    channelId: string,
    initialFollowers: number
) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [followersCount, setFollowersCount] = useState<number>(initialFollowers);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [toggling, setToggling] = useState<boolean>(false);

    /**
     * 1️⃣ Initial follow check
     */
    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                const status = await checkFollowStatus(channelId);

                if (!mounted) return;

                setIsFollowing(status);
            } catch {
                if (!mounted) return;
                setIsFollowing(false);
            } finally {
                if (mounted) {
                    setInitialLoading(false);
                }
            }
        };

        init();

        return () => {
            mounted = false;
        };
    }, [channelId]);

    /**
     * 2️⃣ Toggle follow
     */
    const handleToggle = useCallback(async () => {
        if (toggling || initialLoading) return;

        try {
            setToggling(true);

            const response = await toggleFollow(channelId);

            const newState = response.data.isFollowing;

            setIsFollowing((prevState) => {
                // Update followers count based on state change
                if (prevState !== newState) {
                    setFollowersCount((prevCount) => {
                        const updated =
                            newState ? prevCount + 1 : prevCount - 1;

                        return updated < 0 ? 0 : updated;
                    });
                }

                return newState;
            });

        } catch (error) {
            console.log('Toggle follow failed:', error);
        } finally {
            setToggling(false);
        }
    }, [channelId, toggling, initialLoading]);

    return {
        isFollowing,
        followersCount,
        loading: initialLoading || toggling,
        toggleFollow: handleToggle,
    };
};