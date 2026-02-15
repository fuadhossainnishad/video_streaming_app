export const GET_ALL_VIDEOS = '/video/all';
export const GET_VIDEO_BY_ID = (id: string) => `/video/${id}`;
export const SEARCH_VIDEOS = '/videos/search';
export const GET_VIDEOS_BY_CATEGORY = '/videos/category';
export const LIKE_VIDEO = (id: string) => `/videos/${id}/like`;
export const DISLIKE_VIDEO = (id: string) => `/videos/${id}/dislike`;
export const GET_ALL_POST = 'post/all'
export const GET_ALL_SHORT = 'shorts/all'
export const GET_ALL_CHANNEL = '/channel/all'
export const GET_ALL_COMMENTS = (videoId: string) => `/v1/comments/Video/${videoId}`
export const GET_ALL_REPLIES = (commentId: string) => `/v1/comments/${commentId}/replies`
export const POST_COMMENTS = '/v1/comments'
export const POST_COMMENTS_REACTION = 'v1/comment-reactions/user/${}'
export const GET_COMMENTS_REACTION_STATS = (videoId: string) => 'v1/comment-reactions/stats/${videoId}'
