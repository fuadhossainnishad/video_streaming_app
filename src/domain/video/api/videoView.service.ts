import { axiosClient } from '@/shared/config/axios.config';

/**
 * Increase video view count
 */
export const increaseVideoView = async (videoId: string): Promise<void> => {
  try {
    await axiosClient.post(`/video/${videoId}/view`);
  } catch (error) {
    console.error("Failed to update video view:", error);
  }
};