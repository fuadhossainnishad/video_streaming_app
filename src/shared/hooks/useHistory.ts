import { useCallback } from "react";
import { createHistory } from "@/domain/video/api/history.service";

export const useHistory = () => {

    const trackVideo = useCallback(async (videoId?: string) => {
        if (!videoId) return;

        await createHistory({
            videoId,
            shortId: null,
        });
    }, []);

    const trackShort = useCallback(async (shortId?: string) => {
        if (!shortId) return;

        await createHistory({
            videoId: null,
            shortId,
        });
    }, []);

    return {
        trackVideo,
        trackShort,
    };
};