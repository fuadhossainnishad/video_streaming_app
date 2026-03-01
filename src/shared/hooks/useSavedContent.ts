import { useCallback, useEffect, useState } from "react";
import { axiosClient } from "@/shared/config/axios.config";
import { transformVideoData } from "../utils/video.utils";
import { ApiShort, ShortData } from "../types/shorts.types";
import { transformSaveShort } from "../utils/shorts.utils";
import { ApiVideo, VideoData } from "../types/video.types";

interface SavedApiItem {
    type: string;
    content: ApiVideo | ApiShort;
}

export const useSavedContent = () => {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [shorts, setShorts] = useState<ShortData[]>([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSaved = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            const { data } = await axiosClient.get("/v1/save/saved");

            const savedItems: SavedApiItem[] = data?.savedContent ?? [];

            const videoItems = savedItems
                .filter((item) => item.type === "Video" && item.content)
                .map((item) => transformVideoData(item.content as ApiVideo));

            const shortItems = savedItems
                .filter((item) => item.type === "Short" && item.content)
                .map((item) => transformSaveShort(item.content as ApiShort));

            setVideos(videoItems);
            setShorts(shortItems);
        } catch (err: any) {
            console.error("Saved fetch failed:", err);
            setError(err?.response?.data?.message || "Failed to load saved content");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchSaved();
    }, [fetchSaved]);

    return {
        videos,
        shorts,
        loading,
        refreshing,
        error,
        refresh: () => fetchSaved(true),
    };
};