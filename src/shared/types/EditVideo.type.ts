import { FilePickerResult } from "./upload.type";

export interface EditVideoFormData {
  title: string;
  description: string;
  thumbnail: FilePickerResult | null;
  existingThumbnailUrl: string;
}

export interface VideoDetail {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  hashtags: string[];
  links: string[];
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
  transcodeStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditVideoResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    video: VideoDetail;
  };
}

export interface GetVideoResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    video: VideoDetail;
  };
}