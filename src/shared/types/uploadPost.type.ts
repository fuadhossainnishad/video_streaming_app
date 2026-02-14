// presentation/Add/types/uploadPost.type.ts

export interface PostUploadFormData {
  channel: string;
  description: string;
  hashtags: string[];
  links: string[];
  media: FilePickerResult[] | null;
  taggedPeople?: string[];
}

export interface FilePickerResult {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export interface PostUploadResponse {
  status: 'success' | 'error';
  data: {
    description: string;
    media: {
      url: string;
      _id: string;
    }[];
    hashtags: string[];
    taggedPeople: string[];
    links: string;
    owner: string;
    channel: string;
    likesCount: number;
    dislikesCount: number;
    commentsCount: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}