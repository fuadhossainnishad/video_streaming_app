// shared/types/video.types.ts

// API Response Types
export interface ApiVideoOwner {
  _id: string;
  username: string;
  avatar: string;
}

export interface ApiVideoChannel {
  _id: string;
  description: string
  channelName: string;
  channelIcon: string;
  totalfollowers: number;
}

export interface ApiVideo {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  hashtags: string[];
  links: string[];
  owner: ApiVideoOwner;
  channel: ApiVideoChannel;
  totalViews: number;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  totalRevenue: number;
  watchTime: number;
  isPublished: boolean;
  visibility: string;
  duration: number;
  category: string;
  language: string;
  transcodeJobId?: string;
  transcodeStatus: 'SUBMITTED' | 'PROGRESSING' | 'COMPLETE' | 'ERROR';
  createdAt: string;
  updatedAt: string;
  streamingUrl: string;
}

export interface ApiPagination {
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  hasMore: boolean;
}

export interface ApiVideoResponse {
  status: 'success' | 'error';
  data: {
    videos: ApiVideo[];
    pagination: ApiPagination;
  };
}

export interface ApiVideoByIdResponse {
  status: 'success' | 'error';
  data: {
    video: ApiVideo
  };
}

// App Video Data Types (for components)
export interface VideoData {
  id: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
  channelName: string;
  channelFollower: number;
  channelId: string;
  channelAvatarUrl: string;
  views: string;
  timeAgo: string;
  duration: string;
  currentTime?: string;
  videoUrl?: string;
  likes?: number;
  dislikes?: number;
  comments?: number;
  hashtags?: string[];
}