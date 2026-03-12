import { axiosClient } from '@/shared/config/axios.config';

/**
 * Increase video view count
 */
export const increaseShortView = async (shortId: string): Promise<void> => {
  try {
    await axiosClient.post(`/shorts/${shortId}/view`);
  } catch (error) {
    console.error("Failed to update shorts view:", error);
  }
};