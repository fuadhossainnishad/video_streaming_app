// shared/utils/post.utils.ts
import { ApiPost, PostUI } from '../types/post.types';

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

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;

  // Return formatted date for older posts
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Transform API post data to UI format
 */
export const transformPostData = (apiPost: ApiPost): PostUI => {
  return {
    id: apiPost._id,
    caption: apiPost.description,
    postImages: apiPost.media.map(m => m.url),
    userName: apiPost.owner.username!,
    userAvatar: apiPost?.owner.avatar!,
    channelName: apiPost.channel.channelName! || 'https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/698ce5fc827ed4d82e48f565/879c3907-01cc-4c8d-acb5-1016ea50d2d5.jpg',
    // channelIcon: apiPost.channel.channelIcon,
    likes: apiPost.likesCount,
    dislikes: apiPost.dislikesCount,
    comments: apiPost.commentsCount,
    date: getTimeAgo(apiPost.createdAt),
    hashtags: apiPost.hashtags,
  };
};

/**
 * Transform array of API posts
 */
export const transformPostsData = (apiPosts: ApiPost[]): PostUI[] => {
  return apiPosts.map(transformPostData);
};