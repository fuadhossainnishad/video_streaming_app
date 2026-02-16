import { axiosClient } from "@/shared/config/axios.config";
import { GET_ALL_VIDEOS, GET_CHANNEL_ALL_VIDEOS, GET_VIDEO_BY_ID } from "@/shared/constants/api.constants";
import { VideoData } from "@/shared/types/video.types";
import { transformVideoData, transformVideosData } from "@/shared/utils/video.utils";


export interface GetVideosParams {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
}
export interface GetChannelVideosParams extends GetVideosParams {
    channelId: string
}

export interface GetVideosResult {
    videos: VideoData[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalVideos: number;
        hasMore: boolean;
    };
}

/**
 * Fetch all videos with optional filters
 * @param params - Query parameters for filtering videos
 * @returns Promise with videos and pagination data
 */
export const getAllVideos = async (
    params: GetVideosParams = {}
): Promise<GetVideosResult> => {
    try {
        console.log("all videos:")
        const { data } = await axiosClient.get(GET_ALL_VIDEOS, {
            params,
        });

        // const data = mockVideoResponse
        console.log("all videos:", data)

        if (data.status !== 'success' || !data.data.videos) {
            throw new Error('Invalid response format');
        }

        const transformedVideos = transformVideosData(data.data.videos);

        return {
            videos: transformedVideos,
            pagination: data.data.pagination,
        };
    } catch (error: any) {
        console.error('Error fetching videos:', error);
        throw {
            message: error.message || 'Failed to fetch videos',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Fetch a single video by ID
 * @param videoId - Video ID
 * @returns Promise with single video data
 */
export const getVideoById = async (videoId: string): Promise<VideoData> => {
    try {
        const { data } = await axiosClient.get(GET_VIDEO_BY_ID(videoId));
        console.log("all videos:")
        // const data = mockVideoByIdResponse
        console.log("all videos:", data)
        if (!data.data || !data.data.video) {
            throw new Error('Video not found');
        }

        return transformVideoData(data.data.video);
    } catch (error: any) {
        console.error('Error fetching video:', error);
        throw {
            message: error.message || 'Failed to fetch video',
            statusCode: error.statusCode || 500,
        };
    }
};

export const getChannelAllVideos = async (
    channelId: string,
    params: GetVideosParams = {}
): Promise<GetVideosResult> => {
    try {
        console.log("all videos:")
        const { data } = await axiosClient.get(GET_CHANNEL_ALL_VIDEOS(channelId), {
            params,
        });

        // const data = mockVideoResponse
        console.log("all videos:", data)

        if (data.status !== 'success' || !data.data.videos) {
            throw new Error('Invalid response format');
        }

        const transformedVideos = transformVideosData(data.data.videos);

        return {
            videos: transformedVideos,
            pagination: data.data.pagination,
        };
    } catch (error: any) {
        console.error('Error fetching videos:', error);
        throw {
            message: error.message || 'Failed to fetch videos',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Search videos by query
 * @param query - Search query string
 * @param page - Page number
 * @returns Promise with search results
 */
export const searchVideos = async (
    query: string,
    page: number = 1
): Promise<GetVideosResult> => {
    return getAllVideos({ search: query, page });
};