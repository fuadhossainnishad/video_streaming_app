import { axiosClient } from "@/shared/config/axios.config";
import { EDIT_PROFILE } from "@/shared/constants/api.constants";
import { mockVideoByIdResponse } from "@/shared/mock/video.mock";
import { ApiEditProfileoResponse, ApiProfileoResponse } from "@/shared/types/profile.types";
import { VideoData } from "@/shared/types/video.types";
import { transformVideoData } from "@/shared/utils/video.utils";


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
export const getProfile = async (
): Promise<ApiProfileoResponse> => {
    try {
        console.log("my profile:")
        const { data } = await axiosClient.get<ApiProfileoResponse>('/user/get-user-profile');

        // const data = mockVideoResponse
        console.log("my profile:", data)

        if (data.status !== 'success' || !data.data) {
            throw new Error('Invalid response format');
        }

        return data
    } catch (error: any) {
        console.error('Error fetching videos:', error);
        throw {
            message: error.message || 'Failed to fetch videos',
            statusCode: error.statusCode || 500,
        };
    }
};

export const updateProfile = async (
    formData: FormData
): Promise<ApiEditProfileoResponse> => {
    try {
        console.log('edit profile:', formData)
        const { data } = await axiosClient.patch<ApiEditProfileoResponse>(
            EDIT_PROFILE,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (data.status !== 'success' || !data.data) {
            throw new Error('Failed to update profile');
        }

        return data;
    } catch (error: any) {
        console.error('Error updating profile:', error);
        throw {
            message: error.message || 'Failed to update profile',
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
        // const { data } = await axiosClient.get(GET_VIDEO_BY_ID(videoId));
        console.log("all videos:")
        const data = mockVideoByIdResponse
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

/**
 * Search videos by query
 * @param query - Search query string
 * @param page - Page number
 * @returns Promise with search results
 */
// export const searchVideos = async (
//     query: string,
//     page: number = 1
// ): Promise<GetVideosResult> => {
//     return getAllVideos({ search: query, page });
// };