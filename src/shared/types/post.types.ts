// shared/types/post.types.ts

export interface ApiPostMedia {
  url: string;
  _id: string;
}

export interface ApiPostOwner {
  _id: string;
  username: string;
  avatar: string;
}

export interface ApiPostChannel {
  _id: string;
  channelName: string;
  channelIcon: string;
}

export interface ApiPost {
  _id: string;
  description: string;
  media: ApiPostMedia[];
  hashtags: string[];
  taggedPeople: string[];
  links: string;
  owner: ApiPostOwner;
  channel: ApiPostChannel;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPostResponse {
  status: 'success' | 'error';
  count: number;
  data: ApiPost[];
}
export interface ShortPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  limit: boolean;
}
export interface ApiChannelPostResponse {
  status: 'success' | 'error';
  count: number;
  data: {
    posts: ApiPost[],
    pagination: ShortPagination
  };
}

export interface PostUI {
  id: string;
  caption: string;
  postImages: string[];
  userName: string;
  userAvatar: string;
  channelName: string;
  channelIcon: string;
  likes: number;
  dislikes: number;
  comments: number;
  date: string;
  hashtags: string[];
}