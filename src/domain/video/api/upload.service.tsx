// domain/video/api/upload.service.ts
import { axiosClient } from '@/shared/config/axios.config';
import { VideoUploadFormData, VideoUploadResponse } from '@/shared/types/upload.type';

/**
 * Upload a new video with FormData
 * Server uses auth token to determine user and channel
 * @param formData - Video upload form data
 * @returns Promise with upload response
 */
export const uploadVideo = async (formData: VideoUploadFormData): Promise<VideoUploadResponse> => {
  // const token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGNlNWZjODI3ZWQ0ZDgyZTQ4ZjU2NSIsImlhdCI6MTc3MTA2MTM4OCwiZXhwIjoxNzcxNjY2MTg4fQ.HD8bXkCiA1AGN90xviEK0FTvGAisxTumYAIIWMoxvmw';
  try {
    const data = new FormData();

    // Append required fields
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('language', formData.language);
    data.append('visibility', formData.visibility);
    data.append('channelId', formData.channelId);
    // Append video file
    if (formData.video) {
      data.append('video', formData.video as any);
    }

    // Append thumbnail file
    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail as any);
    }

    // Append hashtags array
    formData.hashtags.forEach((hashtag, index) => {
      data.append(`hashtags[${index}]`, hashtag);
    });

    // Append links array
    formData.links.forEach((link, index) => {
      data.append(`links[${index}]`, link);
    });

    // Append tagged people if exists
    if (formData.taggedPeople && formData.taggedPeople.length > 0) {
      formData.taggedPeople.forEach((personId, index) => {
        data.append(`taggedPeople[${index}]`, personId);
      });
    }

    // Auth token is automatically added by axios interceptor
    const response = await axiosClient.post<VideoUploadResponse>('/video/create', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Track upload progress
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        console.log('Upload progress:', percentCompleted);
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error uploading video:', error);
    throw {
      message: error.response?.data?.message || 'Failed to upload video',
      statusCode: error.response?.status || 500,
    };
  }
};
