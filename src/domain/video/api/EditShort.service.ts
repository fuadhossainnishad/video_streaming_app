import { axiosClient } from '@/shared/config/axios.config';
import {
  EditShortFormData,
  EditShortResponse,
  GetShortResponse,
} from '@/shared/types/EditShort.type';

export const getShortById = async (shortId: string): Promise<GetShortResponse> => {
  const response = await axiosClient.get<GetShortResponse>(`/shorts/${shortId}`);
  return response.data;
};

export const editShort = async (
  formData: EditShortFormData,
  shortId: string
): Promise<EditShortResponse> => {
  try {
    // No file upload needed — JSON body is sufficient
    const response = await axiosClient.patch<EditShortResponse>(
      `/shorts/${shortId}`,
      {
        title: formData.title,
        description: formData.description,
        hashtags: JSON.stringify(formData.hashtags),
        category: formData.category,
        visibility: formData.visibility,
      }
    );

    console.log('editShort response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error editing short:', error);
    throw {
      message: error.response?.data?.message || 'Failed to update short',
      statusCode: error.response?.status || 500,
    };
  }
};

export const deleteShort = async (shortId: string): Promise<void> => {
  const response = await axiosClient.delete(`/shorts/${shortId}`);
  if (response.data.status !== 'success') {
    throw new Error(response.data.message || 'Failed to delete short');
  }
};