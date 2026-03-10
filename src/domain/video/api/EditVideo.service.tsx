import { axiosClient } from '@/shared/config/axios.config';
import {
  EditVideoFormData,
  EditVideoResponse,
  GetVideoResponse,
} from '@/shared/types/EditVideo.type';

export const getVideoById = async (videoId: string): Promise<GetVideoResponse> => {
  const response = await axiosClient.get<GetVideoResponse>(`/video/${videoId}`);
  return response.data;
};

export const editVideo = async (
  formData: EditVideoFormData,
  videoId: string
): Promise<EditVideoResponse> => {
  try {
    const data = new FormData();

    data.append('title', formData.title);
    data.append('description', formData.description);

    if (formData.thumbnail) {
      data.append('thumbnail', {
        uri: formData.thumbnail.uri,
        name: formData.thumbnail.name,
        type: formData.thumbnail.type,
      } as any);
    }

    console.log('editVideo formData:', JSON.stringify({
      title: formData.title,
      description: formData.description,
      thumbnail: formData.thumbnail
        ? { uri: formData.thumbnail.uri, name: formData.thumbnail.name, type: formData.thumbnail.type }
        : null,
    }));

    const response = await axiosClient.patch<EditVideoResponse>(
      `/video/${videoId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log('Upload progress:', percentCompleted);
        },
      }
    );

    console.log('editVideo response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error editing video:', error);
    throw {
      message: error.response?.data?.message || 'Failed to update video',
      statusCode: error.response?.status || 500,
    };
  }
};