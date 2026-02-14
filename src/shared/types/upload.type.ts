// shared/types/upload.types.ts

export interface VideoUploadFormData {
  title: string;
  description: string;
  hashtags: string[];
  links: string[];
  category: string;
  language: string;
  visibility: 'public' | 'private' | 'unlisted';
  video: File | null;
  thumbnail: File | null;
  taggedPeople?: string[];
}

export interface VideoUploadResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    videoId: string;
    transcodeJobId: string;
    video: {
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
      _id: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface FilePickerResult {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export const VIDEO_CATEGORIES = [
  'Education',
  'Entertainment',
  'Gaming',
  'Music',
  'News',
  'Sports',
  'Technology',
  'Vlog',
  'Tutorial',
  'Comedy',
  'Documentary',
  'Other',
] as const;

export const VIDEO_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
] as const;

export type VideoCategory = typeof VIDEO_CATEGORIES[number];
export type VideoLanguage = typeof VIDEO_LANGUAGES[number]['code'];