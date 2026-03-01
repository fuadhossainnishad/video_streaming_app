// shared/utils/short.utils.ts

import { ApiShort, ShortData } from "../types/shorts.types";


/**
 * Transform single short
 */
export const transformShort = (apiShort: ApiShort): ShortData => {
    return {
        id: apiShort._id,
        title: apiShort.title,
        description: apiShort.description,
        videoUrl: apiShort.streamingUrl || apiShort.videoUrl,
        hashtags: apiShort.hashtags,
        ownerName: apiShort.owner.username,
        ownerAvatar: apiShort.owner.avatar,
        channelId: apiShort.channel._id,
        channelName: apiShort.channel.channelName,
        channelIcon: apiShort.channel.channelIcon,
        views: apiShort.totalViews,
        likes: apiShort.likesCount,
        dislikes: apiShort.dislikesCount,
        comments: apiShort.commentsCount,
        category: apiShort.category,
        language: apiShort.language,
        createdAt: apiShort.createdAt,
    };
};


/**
 * Transform array of shorts
 * Also filter only published + completed
 */
export const transformShorts = (apiShorts: ApiShort[]): ShortData[] => {
    return apiShorts.map(transformShort);
};
// .filter(
//     short =>
//         short.visibility === "public" &&
//         short.transcodeStatus === "COMPLETE"
// )

export const transformSaveShort = (short: ApiShort): ShortData => {
    return {
        id: short._id,
        title: short.title,
        description: short.description,
        videoUrl: short.videoUrl,
        hashtags: short.hashtags,
        ownerName: short.owner.username,
        ownerAvatar: short.owner.avatar,
        channelId: short.channel._id,
        channelName: short.channel.channelName,
        channelIcon: short.channel.channelIcon,
        views: short.totalViews,
        likes: short.likesCount,
        dislikes: short.dislikesCount,
        comments: short.commentsCount,
        category: short.category,
        language: short.language,
        createdAt: short.createdAt,
    };
};