import { axiosClient } from '@/shared/config/axios.config';

interface MediaFile {
  uri: string;
  name: string;
  type: string;
}

interface UpdatePostData {
  postId: string;
  description: string;
  hashtags: string[];
  links: string;
  taggedPeople: string[];
  allMedia: MediaFile[]; // all images — both existing (downloaded) and new
}

export const updatePost = async (
  data: UpdatePostData,
  onProgress?: (progress: number) => void
) => {
  try {
    const formData = new FormData();

    formData.append('description', data.description);
    formData.append('hashtags', JSON.stringify(data.hashtags));
    formData.append('taggedPeople', JSON.stringify(data.taggedPeople));
    formData.append('links', data.links || '');

    // Send ALL images — server replaces everything, so we include both old and new
    data.allMedia.forEach((file) => {
      formData.append('media', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    });

    console.log('updatePost allMedia:', data.allMedia.map(f => ({
      name: f.name,
      uri: f.uri.substring(0, 60),
    })));

    const response = await axiosClient.put(
      `/post/update/${data.postId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) onProgress?.(Math.round((e.loaded * 100) / e.total));
        },
        timeout: 120000,
      }
    );

    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to update post');
    }

    return response.data;
  } catch (error: any) {
    console.error('Post update error:', error);
    if (error.response) throw new Error(error.response.data?.message || 'Server error');
    if (error.request) throw new Error('No response from server.');
    throw new Error(error.message || 'Failed to update post');
  }
};

export const getPostById = async (postId: string): Promise<any> => {
  try {
    const response = await axiosClient.get(`/post/${postId}`);
    if (response.data.status !== 'success') throw new Error('Failed to fetch post');
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch post');
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  const response = await axiosClient.delete(`/post/${postId}`);
  if (response.data.status !== 'success') {
    throw new Error(response.data.message || 'Failed to delete post');
  }
};