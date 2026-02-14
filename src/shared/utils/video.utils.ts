// shared/utils/video.utils.ts

import { ApiVideo, VideoData } from "../types/video.types";

/**
 * Format view count to readable string
 * @param views - Number of views
 * @returns Formatted string (e.g., "1.2K", "2.5M")
 */
export const formatViews = (views: number): string => {
    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M views`;
    }
    if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
};

/**
 * Format duration from seconds to MM:SS or HH:MM:SS
 * @param seconds - Duration in seconds
 * @returns Formatted time string
 */
export const formatDuration = (seconds: number): string => {
    if (!seconds || seconds === 0) return '0:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculate time ago from ISO date string
 * @param dateString - ISO date string
 * @returns Human-readable time ago string
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
    const diffYears = Math.floor(diffMs / 31536000000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
    return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
};

/**
 * Transform API video data to app video data format
 * @param apiVideo - Video data from API
 * @returns Transformed video data for app components
 */
export const transformVideoData = (apiVideo: ApiVideo): VideoData => {
    return {
        id: apiVideo._id,
        thumbnailUrl: apiVideo.thumbnail,
        title: apiVideo.title,
        description: apiVideo.description,
        channelName: apiVideo.channel.channelName,
        channelFollower: apiVideo.channel.totalfollowers,
        channelId: apiVideo.channel._id,
        channelAvatarUrl: apiVideo.channel.channelIcon,
        views: formatViews(apiVideo.totalViews),
        timeAgo: getTimeAgo(apiVideo.createdAt),
        duration: formatDuration(apiVideo.duration),
        videoUrl: apiVideo.videoUrl,
        likes: apiVideo.likesCount,
        dislikes: apiVideo.dislikesCount,
        comments: apiVideo.commentsCount,
        hashtags: apiVideo.hashtags,
    };
};

/**
 * Transform array of API videos to app video data
 * @param apiVideos - Array of videos from API
 * @returns Array of transformed video data
 */
export const transformVideosData = (apiVideos: ApiVideo[]): VideoData[] => {
    return apiVideos.map(transformVideoData);
};