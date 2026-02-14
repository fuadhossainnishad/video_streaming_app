// shared/types/comment.types.ts

export interface ApiCommentUser {
  _id: string;
  username: string;
  avatar: string;
}

export interface ApiCommentChannel {
  _id: string;
}

export interface ApiComment {
  _id: string;
  content: string;
  user: ApiCommentUser;
  channel: ApiCommentChannel;
  targetType: 'Video' | 'Post' | 'Short';
  targetId: string;
  parentComment: string | null;
  isReply: boolean;
  likesCount: number;
  dislikesCount: number;
  repliesCount: number;
  isEdited: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCommentPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiCommentsResponse {
  status: 'success' | 'error';
  data: {
    comments: ApiComment[];
    pagination: ApiCommentPagination;
  };
}

export interface ApiRepliesResponse {
  status: 'success' | 'error';
  data: {
    replies: ApiComment[];
    pagination: ApiCommentPagination;
  };
}

// UI Types
export interface CommentUI {
  id: string;
  username: string;
  avatarUrl: string;
  comment: string;
  timeAgo: string;
  likes: number;
  dislikes: number;
  replyCount: number;
  isPinned: boolean;
  isEdited: boolean;
  replies?: CommentUI[];
}