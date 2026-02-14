// src/services/api/types.ts
export interface Owner {
  _id: string;
  username: string;
  avatar: string;
}

export interface Channel {
  _id: string;
  channelName: string;
  channelIcon: string;
  totalfollowers: number;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  hashtags: string[];
  links: string[];
  owner: Owner;
  channel: Channel;
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
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  hasMore: boolean;
}

export interface VideosResponse {
  status: string;
  data: {
    videos: Video[];
    pagination: Pagination;
  };
}

export interface ApiError {
  status: string;
  message: string;
  error?: any;
}