export const GET_ALL_VIDEOS = '/video/all';
export const GET_VIDEO_BY_ID = (id: string) => `/video/${id}`;
export const SEARCH_VIDEOS = '/videos/search';
export const GET_VIDEOS_BY_CATEGORY = '/videos/category';
export const LIKE_VIDEO = (id: string) => `/videos/${id}/like`;
export const DISLIKE_VIDEO = (id: string) => `/videos/${id}/dislike`;
