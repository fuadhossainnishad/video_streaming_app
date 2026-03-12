import { axiosClient } from "@/shared/config/axios.config";
import { VIDEO_REACT, VIDEO_REACT_STATS } from "@/shared/constants/api.constants";


export interface ToggleReactionResponse {
    status: 'success' | 'error';
    message: string;
    data: {
        reaction: {
            reactionType: 'like' | 'dislike' | null;
        };
        likesCount: number;
        dislikesCount: number;
    };
}

/**
 * Toggle reaction (like/dislike)
 * POST /reactions/toggle
 */
export const toggleReaction = async (
    targetId: string,
    reactionType: 'like' | 'dislike',
    targetType: string
): Promise<ToggleReactionResponse> => {
    try {
        const response = await axiosClient.post<ToggleReactionResponse>(
            VIDEO_REACT,
            {
                targetType,
                targetId,
                reactionType,
            }
        );
        console.log("response react video:", response.data)
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to toggle reaction');
        }

        return response.data;
    } catch (error: any) {
        console.error('Error toggling reaction:', error);
        throw {
            message: error.message || 'Failed to toggle reaction',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Get user reaction status
 * GET /reactions/status/:targetId
 */
export interface ReactionStatsResponse {
    status: string;
    data: {
        likesCount: number;
        dislikesCount: number;
    };
}

export const getReactionStats = async (
    videoId: string
): Promise<{ likesCount: number; dislikesCount: number }> => {
    const response = await axiosClient.get<ReactionStatsResponse>(
        VIDEO_REACT_STATS(videoId)
    );

    if (response.data.status !== "success") {
        throw new Error("Failed to fetch reaction stats");
    }

    return response.data.data;
};

export const getUserReaction = async (
    targetId: string,
    targetType: string
) => {
    const response = await axiosClient.get(
        `/v1/reactions/me/${targetType}/${targetId}`
    );
    return response.data;
};