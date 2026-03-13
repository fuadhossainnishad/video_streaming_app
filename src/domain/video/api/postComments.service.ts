// domain/video/api/comment.service.ts
import { axiosClient } from '@/shared/config/axios.config';
import { GET_ALL_POST_COMMENTS, GET_ALL_REPLIES, POST_COMMENTS } from '@/shared/constants/api.constants';
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

export interface CommentReactionStats {
  likesCount: number;
  dislikesCount: number;
}

/**
 * Fetch comments for a video
 */
export const getVideoComments = async (
  videoId: string,
  page: number = 1,
  limit: number = 10
): Promise<GetCommentsResult> => {
  try {
    const { data } = await axiosClient.get<ApiCommentsResponse>(
      GET_ALL_POST_COMMENTS(videoId),
      {
        params: { page, limit },
      }
    );

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
 */
export const getCommentReplies = async (
  commentId: string,
  page: number = 1,
  limit: number = 5
): Promise<GetCommentsResult> => {
  try {
    const { data } = await axiosClient.get<ApiRepliesResponse>(
      GET_ALL_REPLIES(commentId),
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
 */
export const postComment = async (
  targetId: string,
  content: string,
  targetType: 'Video' | 'Post' | 'Short' = 'Post'
): Promise<CommentUI> => {
  try {
    const { data } = await axiosClient.post(POST_COMMENTS, {
      content,
      targetId,
      targetType,
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
 */
export const postReply = async (
  parentCommentId: string,
  targetId: string,
  content: string,
  targetType: 'Video' | 'Post' | 'Short' = 'Post'
): Promise<CommentUI> => {
  try {
    const { data } = await axiosClient.post(POST_COMMENTS, {
      content,
      targetType,
      targetId,
      parentCommentId,
    });

    if (!data.data || !data.data.comment) {
      throw new Error('Invalid response format');
    }

    return transformCommentsData([data.data.comment])[0];
  } catch (error: any) {
    console.error('Error posting reply:', error);
    throw {
      message: error.message || 'Failed to post reply',
      statusCode: error.statusCode || 500,
    };
  }
};

/**
 * Get reaction stats for a comment
 */
export const getCommentReactionStats = async (
  commentId: string
): Promise<CommentReactionStats> => {
  try {
    const { data } = await axiosClient.get(`v1/comment-reactions/stats/${commentId}`);
    console.log('reaction stats:', data)

    if (data.status !== 'success' || !data.data) {
      throw new Error('Invalid response format');
    }

    return {
      likesCount: data.data.likesCount,
      dislikesCount: data.data.dislikesCount,
    };
  } catch (error: any) {
    console.error('Error fetching comment reaction stats:', error);
    // Return default values instead of throwing
    return { likesCount: 0, dislikesCount: 0 };
  }
};


export const getCommentUserReaction = async (
  commentId: string
): Promise<'like' | 'dislike' | null> => {
  const response = await axiosClient.get(`v1/comment-reactions/user/${commentId}`);
  const reaction = response?.data?.data?.reaction;
  return reaction?.reactionType ?? null;
};

export const getCommentStats = async (
  commentId: string
): Promise<{ likesCount: number; dislikesCount: number }> => {
  const response = await axiosClient.get(`v1/comment-reactions/stats/${commentId}`);
  const data = response?.data?.data ?? {};
  return {
    likesCount: data.likesCount ?? 0,
    dislikesCount: data.dislikesCount ?? 0,
  };
};

export const toggleCommentReaction = async (
  commentId: string,
  reactionType: 'like' | 'dislike'
): Promise<void> => {
  await axiosClient.post('v1/comment-reactions/toggle', {
    commentId,
    reactionType,
  });
};
/**
 * Get reaction stats for multiple comments (batch)
 */
export const getBatchCommentReactionStats = async (
  commentIds: string[]
): Promise<Map<string, CommentReactionStats>> => {
  try {
    const statsPromises = commentIds.map((id) =>
      getCommentReactionStats(id).catch(() => ({ likesCount: 0, dislikesCount: 0 }))
    );

    const statsArray = await Promise.all(statsPromises);

    const statsMap = new Map<string, CommentReactionStats>();
    commentIds.forEach((id, index) => {
      statsMap.set(id, statsArray[index]);
    });

    return statsMap;
  } catch (error: any) {
    console.error('Error fetching batch reaction stats:', error);
    return new Map();
  }
};



/**
 * Like a comment
 */
// export const likeComment = async (commentId: string): Promise<void> => {
//   try {
//     await axiosClient.post(`v1/comment-reactions/toggle`, {
//       "commentId": commentId,
//       "reactionType": "like"
//     });
//   } catch (error: any) {
//     console.error('Error liking comment:', error);
//     throw {
//       message: error.message || 'Failed to like comment',
//       statusCode: error.statusCode || 500,
//     };
//   }
// };

/**
 * Unlike a comment
 */
// export const unlikeComment = async (commentId: string): Promise<void> => {
//   try {
//     await axiosClient.post(`v1/comment-reactions/toggle`, {
//       "commentId": commentId,
//       "reactionType": "like"
//     });
//   } catch (error: any) {
//     console.error('Error unliking comment:', error);
//     throw {
//       message: error.message || 'Failed to unlike comment',
//       statusCode: error.statusCode || 500,
//     };
//   }
// };

/**
 * Dislike a comment
 */
// export const dislikeComment = async (commentId: string): Promise<void> => {
//   try {
//     await axiosClient.post(`v1/comment-reactions/toggle`, {
//       "commentId": commentId,
//       "reactionType": "dislike"
//     });
//   } catch (error: any) {
//     console.error('Error disliking comment:', error);
//     throw {
//       message: error.message || 'Failed to dislike comment',
//       statusCode: error.statusCode || 500,
//     };
//   }
// };

/**
 * Remove dislike from a comment
 */
// export const undislikeComment = async (commentId: string): Promise<void> => {
//   try {
//     await axiosClient.post(`v1/comment-reactions/toggle`, {
//       "commentId": commentId,
//       "reactionType": "dislike"
//     });
//   } catch (error: any) {
//     console.error('Error removing dislike:', error);
//     throw {
//       message: error.message || 'Failed to remove dislike',
//       statusCode: error.statusCode || 500,
//     };
//   }
// };

