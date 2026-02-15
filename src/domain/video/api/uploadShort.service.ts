// domain/video/api/upload.service.ts
import { axiosClient } from '@/shared/config/axios.config';
import { ShortUploadFormData, ShortUploadResponse } from '@/shared/types/uploadShort.type';

/**
 * Upload a new video with FormData
 * Server uses auth token to determine user and channel
 * @param formData - Video upload form data
 * @returns Promise with upload response
 */
export const uploadShort = async (formData: ShortUploadFormData): Promise<ShortUploadResponse> => {
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

    // Append hashtags array
    formData.hashtags.forEach((hashtag, index) => {
      data.append(`hashtags[${index}]`, hashtag);
    });

    // Append links array
    // formData.links.forEach((link, index) => {
    //   data.append(`links[${index}]`, link);
    // });

    // Append tagged people if exists
    if (formData.taggedPeople && formData.taggedPeople.length > 0) {
      formData.taggedPeople.forEach((personId, index) => {
        data.append(`taggedPeople[${index}]`, personId);
      });
    }
    console.log("shortdata:", formData)
    // Auth token is automatically added by axios interceptor
    const response = await axiosClient.post<ShortUploadResponse>('/shorts/create', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Authorization: `Bearer ${token}`,
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
      message: error.response?.data?.message || 'Failed to upload short',
      statusCode: error.response?.status || 500,
    };
  }
};
