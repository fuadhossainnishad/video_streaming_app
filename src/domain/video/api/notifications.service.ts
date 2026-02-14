// domain/video/api/comment.service.ts
import { axiosClient } from '@/shared/config/axios.config';
import { mockCommentsResponse } from '@/shared/mock/comments.mock';
import { mockNotificationsResponse } from '@/shared/mock/notifications.mock';
import { ApiCommentsResponse, ApiRepliesResponse, CommentUI } from '@/shared/types/comments.type';
import { transformCommentsData } from '@/shared/utils/comments.utils';
import { getNotificationCommentText } from '../../../shared/utils/notification.utils';

export interface GetCommentsResult {
    comments: CommentUI[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

/**
 * Fetch comments for a video
 * @param videoId - Video ID
 * @param page - Page number
 * @param limit - Comments per page
 * @returns Promise with comments data
 */
export const getVideoComments = async (
    videoId: string,
    page: number = 1,
    limit: number = 10
): Promise<GetCommentsResult> => {
    try {
        // const { data } = await axiosClient.get<ApiCommentsResponse>(
        //     `/video/${videoId}/comments`,
        //     {
        //         params: { page, limit },
        //     }
        // );

        const data = mockCommentsResponse

        if (data.status !== 'success' || !data.data.comments) {
            throw new Error('Invalid response format');
        }

        const transformedComments = transformCommentsData(data.data.comments);

        return {
            comments: transformedComments,
            pagination: data.data.pagination,
        };
    } catch (error: any) {
        console.error('Error fetching comments:', error);
        throw {
            message: error.message || 'Failed to fetch comments',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Fetch replies for a comment
 * @param commentId - Comment ID
 * @param page - Page number
 * @param limit - Replies per page
 * @returns Promise with replies data
 */
export const getNotifications = async () => {
    try {
        // const { data } = await axiosClient.get<ApiRepliesResponse>(
        //     `/comment/${commentId}/replies`,
        //     {
        //         params: { page, limit },
        //     }
        // );
        const data = mockNotificationsResponse
        if (data.status !== 'success' || !data.data.notifications) {
            throw new Error('Invalid response format');
        }

        const transformedReplies = trans(data.data.replies);

        return {
            notifications: transformedReplies,
        };
    } catch (error: any) {
        console.error('Error fetching replies:', error);
        throw {
            message: error.message || 'Failed to fetch replies',
            statusCode: error.statusCode || 500,
        };
    }
};

