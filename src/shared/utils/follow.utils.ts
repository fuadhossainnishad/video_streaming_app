import { Subscription } from "../types/follow.types";

export interface UIChannel {
  id: string;
  name: string;
  avatar: string;
  followers: string;
  ownerUsername: string;
  description: string
  totalVideos: string
}

export const transformFollowing = (
  subscriptions: Subscription[]
): UIChannel[] => {
  return subscriptions.map((sub) => ({
    id: sub.channel._id,
    name: sub.channel.channelName,
    avatar: sub.channel.channelIcon,
    followers: formatFollowers(sub.channel.totalfollowers),
    ownerUsername: sub.channel.owner?.username ?? 'unknown',
    description: sub.channel.description,
    totalVideos: formatFollowers(sub.channel.totalViews),
  }));
};

const formatFollowers = (count: number): string => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return `${count}`;
};
