export interface ChannelOwner {
  _id: string;
  username: string;
}

export interface Channel {
  _id: string;
  channelName: string;
  channelIcon: string;
  description: string;
  totalfollowers: number;
  totalViews: number;
  owner: ChannelOwner;
}

export interface Subscription {
  followId: string;
  followedAt: string;
  notificationsEnabled: boolean;
  channel: Channel;
}

export interface FollowingResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    subscriptions: Subscription[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalSubscriptions: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
