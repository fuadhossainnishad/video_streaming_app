import {
  ApiChannel,
  ApiChannelDetails,
  ChannelData,
  ChannelDetailsData,
} from "../types/channel.types";

/**
 * Transform single channel (list item)
 */
export const transformChannelData = (
  apiChannel: ApiChannel
): ChannelData => {
  return {
    id: apiChannel._id,
    name: apiChannel.channelName,
    avatar: apiChannel.channelIcon,
  };
};

/**
 * Transform channel details
 */
export const transformChannelDetailsData = (
  apiChannel: ApiChannelDetails
): ChannelDetailsData => {
  return {
    id: apiChannel._id,
    name: apiChannel.channelName,
    avatar: apiChannel.channelIcon,
    description: apiChannel.description,
    ownerName: apiChannel.owner.username,
    ownerEmail: apiChannel.owner.email,
    links: apiChannel.links,
    followers: apiChannel.totalfollowers,
    totalViews: apiChannel.totalViews,
    totalRevenue: apiChannel.totalRevenue,
    totalWatchTime: apiChannel.totalWatchTime,
    createdAt: apiChannel.createdAt,
  };
};

/**
 * Transform array of channels
 */
export const transformChannelsData = (
  apiChannels: ApiChannel[]
): ChannelData[] => {
  return apiChannels.map(transformChannelData);
};


// shared/utils/channel.utils.ts

/**
 * Format large numbers with K, M suffixes
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format currency with proper decimals
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format hours with proper suffix
 */
export const formatHours = (hours: number): string => {
  return `${hours.toLocaleString('en-US')}hrs`;
};

/**
 * Get month abbreviation
 */
export const getMonthAbbr = (monthIndex: number): string => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[monthIndex] || '';
};