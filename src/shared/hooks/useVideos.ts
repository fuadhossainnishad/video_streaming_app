// src/hooks/useVideos.ts
import { useState, useEffect, useCallback } from 'react';

interface UseVideosReturn {
    videos: Video[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    fetchVideos: () => Promise<void>;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
}

export const useVideos = (initialPage: number = 1, limit: number = 10): UseVideosReturn => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);

    const fetchVideos = useCallback(async (page: number = 1, append: boolean = false) => {
        try {
            if (!append) {
                setLoading(true);
            }
            setError(null);

            const response = await videoService.getVideos(page, limit);

            if (response.status === 'success') {
                if (append) {
                    setVideos((prev) => [...prev, ...response.data.videos]);
                } else {
                    setVideos(response.data.videos);
                }
                setPagination(response.data.pagination);
                setCurrentPage(page);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch videos');
            console.error('Error fetching videos:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [limit]);

    const loadMore = useCallback(async () => {
        if (pagination?.hasMore && !loading) {
            await fetchVideos(currentPage + 1, true);
        }
    }, [pagination, loading, currentPage, fetchVideos]);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        await fetchVideos(1, false);
    }, [fetchVideos]);

    useEffect(() => {
        fetchVideos(initialPage);
    }, []);

    return {
        videos,
        pagination,
        loading,
        error,
        refreshing,
        fetchVideos: () => fetchVideos(1, false),
        loadMore,
        refresh,
    };
};

// Hook for searching videos
export const useSearchVideos = (query: string) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const searchVideos = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setVideos([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await videoService.searchVideos(searchQuery);

            if (response.status === 'success') {
                setVideos(response.data.videos);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to search videos');
            console.error('Error searching videos:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (query) {
                searchVideos(query);
            }
        }, 500); // Debounce search by 500ms

        return () => clearTimeout(debounceTimer);
    }, [query, searchVideos]);

    return { videos, loading, error };
};