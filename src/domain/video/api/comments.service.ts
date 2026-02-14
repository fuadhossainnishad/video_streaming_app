// domain/video/api/comment.service.ts
import { axiosClient } from '@/shared/config/axios.config';
import { mockCommentsResponse } from '@/shared/mock/comments.mock';
import { ApiCommentsResponse, ApiRepliesResponse, CommentUI } from '@/shared/types/comments.type';
import { transformCommentsData } from '@/shared/utils/comments.utils';

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
export const getCommentReplies = async (
    commentId: string,
    page: number = 1,
    limit: number = 5
): Promise<GetCommentsResult> => {
    try {
        const { data } = await axiosClient.get<ApiRepliesResponse>(
            `/comment/${commentId}/replies`,
            {
                params: { page, limit },
            }
        );

        if (data.status !== 'success' || !data.data.replies) {
            throw new Error('Invalid response format');
        }

        const transformedReplies = transformCommentsData(data.data.replies);

        return {
            comments: transformedReplies,
            pagination: data.data.pagination,
        };
    } catch (error: any) {
        console.error('Error fetching replies:', error);
        throw {
            message: error.message || 'Failed to fetch replies',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Post a new comment
 * @param targetId - Video/Post/Short ID
 * @param content - Comment content
 * @param targetType - Type of content
 * @returns Promise with new comment
 */
export const postComment = async (
    targetId: string,
    content: string,
    targetType: 'Video' | 'Post' | 'Short' = 'Video'
): Promise<CommentUI> => {
    try {
        const { data } = await axiosClient.post(`/${targetType.toLowerCase()}/${targetId}/comment`, {
            content,
        });

        if (!data.data || !data.data.comment) {
            throw new Error('Invalid response format');
        }

        return transformCommentsData([data.data.comment])[0];
    } catch (error: any) {
        console.error('Error posting comment:', error);
        throw {
            message: error.message || 'Failed to post comment',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Post a reply to a comment
 * @param commentId - Parent comment ID
 * @param content - Reply content
 * @returns Promise with new reply
 */
export const postReply = async (
    commentId: string,
    content: string
): Promise<CommentUI> => {
    try {
        const { data } = await axiosClient.post(`/comment/${commentId}/reply`, {
            content,
        });

        if (!data.data || !data.data.reply) {
            throw new Error('Invalid response format');
        }

        return transformCommentsData([data.data.reply])[0];
    } catch (error: any) {
        console.error('Error posting reply:', error);
        throw {
            message: error.message || 'Failed to post reply',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Like a comment
 * @param commentId - Comment ID
 */
export const likeComment = async (commentId: string): Promise<void> => {
    try {
        await axiosClient.post(`/comment/${commentId}/like`);
    } catch (error: any) {
        console.error('Error liking comment:', error);
        throw {
            message: error.message || 'Failed to like comment',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Unlike a comment
 * @param commentId - Comment ID
 */
export const unlikeComment = async (commentId: string): Promise<void> => {
    try {
        await axiosClient.delete(`/comment/${commentId}/like`);
    } catch (error: any) {
        console.error('Error unliking comment:', error);
        throw {
            message: error.message || 'Failed to unlike comment',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Dislike a comment
 * @param commentId - Comment ID
 */
export const dislikeComment = async (commentId: string): Promise<void> => {
    try {
        await axiosClient.post(`/comment/${commentId}/dislike`);
    } catch (error: any) {
        console.error('Error disliking comment:', error);
        throw {
            message: error.message || 'Failed to dislike comment',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Remove dislike from a comment
 * @param commentId - Comment ID
 */
export const undislikeComment = async (commentId: string): Promise<void> => {
    try {
        await axiosClient.delete(`/comment/${commentId}/dislike`);
    } catch (error: any) {
        console.error('Error removing dislike:', error);
        throw {
            message: error.message || 'Failed to remove dislike',
            statusCode: error.statusCode || 500,
        };
    }
};