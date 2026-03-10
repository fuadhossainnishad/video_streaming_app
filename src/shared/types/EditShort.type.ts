export interface EditShortFormData {
  title: string;
  description: string;
  hashtags: string[];
  category: string;
  visibility: string;
}

export interface ShortDetail {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  streamingUrl: string;
  hashtags: string[];
  owner: string;
  channel: string;
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
  transcodeJobId: string;
  transcodeStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditShortResponse {
  status: 'success' | 'error';
  message: string;
  data: { short: ShortDetail };
}

export interface GetShortResponse {
  status: 'success' | 'error';
  message: string;
  data: { short: ShortDetail };
}