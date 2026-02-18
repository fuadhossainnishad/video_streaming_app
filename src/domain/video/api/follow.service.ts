// domain/follow/api/follow.service.ts

import axiosClient from '@/shared/config/axios.config';
import { GET_ALL_FOLLOWING_CHANNEL } from '@/shared/constants/api.constants';
import { mockFollowingResponse } from '@/shared/mock/follow.mock';
import { FollowingResponse } from '@/shared/types/follow.types';
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
