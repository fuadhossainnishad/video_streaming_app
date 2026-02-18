export const GET_ALL_VIDEOS = '/video/all';
export const GET_CHANNEL_ALL_VIDEOS = (id: string) => `/video/channel/${id}`;

export const GET_VIDEO_BY_ID = (id: string) => `/video/${id}`;

export const SEARCH_VIDEOS = '/videos/search';
// export const GET_VIDEOS_BY_CATEGORY = '/videos/category';
export const LIKE_VIDEO = (id: string) => `/videos/${id}/like`;
export const DISLIKE_VIDEO = (id: string) => `/videos/${id}/dislike`;


export const GET_ALL_POST = 'post/all'
export const GET_ALL_SHORT = 'shorts/all'
export const GET_SHORT_BY_ID = (id: string) => `/shorts/${id}`;


export const GET_ALL_COMMENTS = (videoId: string) => `/v1/comments/Video/${videoId}`
export const POST_COMMENTS = '/v1/comments'
export const POST_COMMENTS_REACTION = 'v1/comment-reactions/user/${}'
export const GET_COMMENTS_REACTION_STATS = (videoId: string) => 'v1/comment-reactions/stats/${videoId}'

export const GET_ALL_REPLIES = (commentId: string) => `/v1/comments/${commentId}/replies`


export const SIGN_UP = '/user/signup'
export const LOGIN = '/user/login'
export const SOCIAL_LOGIN = '/user/social_login'
export const REFRESH_TOKEN = '/user/refresh_access_token'
export const VERIFY_EMAIL = '/user/verify-email'
export const RESEND_OTP = '/user/resend-otp'
export const REST_PASSWORD = '/user/reset-password'
export const VERIFY_RESET_EMAIL = '/user/verify-reset-otp'
export const FORGOT_PASSWORD = '/user/forgot-password'
export const CHANGE_PASSWORD = '/user/change-password'
export const DELETE_ACCOUNT = '/user/delete-user'


export const GET_ALL_CHANNEL = '/channel/all'
export const GET_MY_CHANNEL = '/channel/my_channel'
export const CREATE_CHANNEL = '/channel/create'
export const EDIT_CHANNEL = '/channel/edit'
export const GET_ALL_FOLLOWING_CHANNEL = '/v1/follows/my-subscriptions'

export const EDIT_PROFILE = '/user/profile'