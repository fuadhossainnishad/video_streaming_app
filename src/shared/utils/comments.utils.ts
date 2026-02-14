// shared/utils/comment.utils.ts

import { ApiComment, CommentUI } from "../types/comments.type";

/**
 * Calculate time ago from ISO date string
 */
export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);
  const diffMonths = Math.floor(diffMs / 2592000000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  const diffYears = Math.floor(diffMs / 31536000000);
  return `${diffYears}y ago`;
};

/**
 * Transform API comment to UI format
 */
export const transformCommentData = (apiComment: ApiComment): CommentUI => {
  return {
    id: apiComment._id,
    username: apiComment.user.username,
    avatarUrl: apiComment.user.avatar,
    comment: apiComment.content,
    timeAgo: apiComment.createdAt,
    likes: apiComment.likesCount,
    dislikes: apiComment.dislikesCount,
    replyCount: apiComment.repliesCount,
    isPinned: apiComment.isPinned,
    isEdited: apiComment.isEdited,
    replies: [],
  };
};

/**
 * Transform array of API comments to UI format
 */
export const transformCommentsData = (apiComments: ApiComment[]): CommentUI[] => {
  return apiComments.map(transformCommentData);
};