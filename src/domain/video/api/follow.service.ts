// domain/follow/api/follow.service.ts

import { axiosClient } from '@/shared/config/axios.config';
import { FOLLOW_CHANNEL, GET_ALL_FOLLOWING_CHANNEL } from '@/shared/constants/api.constants';
import { FollowingResponse, ToggleFollowResponse } from '@/shared/types/follow.types';
import { transformFollowing } from '@/shared/utils/follow.utils';

// import { GET_FOLLOWING_CHANNELS } from '@/shared/constants/api.constants';

export interface GetFollowingResult {
    channels: ReturnType<typeof transformFollowing>;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalSubscriptions: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export const getFollowingChannels = async (
    page: number = 1,
    limit: number = 10
): Promise<GetFollowingResult> => {
    try {
        // Real API (later)
        const { data } = await axiosClient.get<FollowingResponse>(
            GET_ALL_FOLLOWING_CHANNEL,
            { params: { page, limit } }
        );
        console.log('Error toggling follow:', data);
        console.log('Error toggling data.data.subscriptions:', data.data.subscriptions);

        // MOCK (remove later)
        // const data = mockFollowingResponse;

        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch following channels');
        }

        const transformed = transformFollowing(data.data.subscriptions);

        return {
            channels: transformed,
            pagination: data.data.pagination,
        };
    } catch (error: any) {
        console.error('Error fetching following channels:', error);

        throw {
            message: error.message || 'Failed to fetch following channels',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Toggle follow/unfollow a channel
 * POST /follows/toggle/:channelId
 */
export const toggleFollow = async (channelId: string) => {
    try {
        const response = await axiosClient.post<ToggleFollowResponse>(
            FOLLOW_CHANNEL(channelId)
        );

        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to toggle follow');
        }

        return response;
    } catch (error: any) {
        console.error('Error toggling follow:', error);
        throw {
            message: error.message || 'Failed to toggle follow',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Check follow status
 * GET /follows/check/:channelId
 */
export const checkFollowStatus = async (
    channelId: string
) => {
    const response = await axiosClient.get(
        `/v1/follows/check/${channelId}`
    );

    if (response.data.status !== 'success') {
        throw new Error(
            response.data.message || 'Failed to check follow status'
        );
    }

    return response
};