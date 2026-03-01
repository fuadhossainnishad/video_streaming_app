import { useCallback, useEffect, useState } from "react";
import { getAllVideos } from "@/domain/video/api/video.service";
import { VideoData } from "@/shared/types/video.types";

interface Params {
    page?: number;
    limit?: number;
}

export const useVideos = ({ page = 1, limit = 10 }: Params) => {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            const result = await getAllVideos({ page, limit });

            setVideos(result.videos);
        } catch (err: any) {
            console.error("Fetch videos error:", err);
            setError(err?.message || "Failed to load videos");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const refresh = () => fetchVideos(true);

    return {
        videos,
        loading,
        refreshing,
        error,
        refresh,
    };
};