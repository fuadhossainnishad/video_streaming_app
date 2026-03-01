import { axiosClient } from "@/shared/config/axios.config";

export interface CheckSaveResponse {
  isSaved: boolean;
}

/**
 * ✅ Check if content is already saved
 */
export const checkSaveStatus = async (
  contentId: string
): Promise<boolean> => {
  const response = await axiosClient.get<CheckSaveResponse>(
    `/v1/save/check/${contentId}`
  );

  return response.data.isSaved;
};

/**
 * ✅ Save content
 */
export const saveContent = async (
  contentType: string,
  contentId: string
): Promise<boolean> => {
  const response = await axiosClient.post(`/v1/save/save`, {
    contentType,
    contentId,
  });

  const message = response.data?.message;

  if (
    message === "Content saved successfully." ||
    message === "Content already saved."
  ) {
    return true;
  }

  return false;
};


/**
 * ✅ Unsave content
 */
export const unsaveContent = async (
  contentId: string
): Promise<boolean> => {
  const response = await axiosClient.delete(`/v1/save/unsave`, {
    data: {
      contentId,
    },
  });

  const message = response.data?.message;

  if (message === "Content unsaved successfully.") {
    return false;
  }

  if (message === "Content not saved.") {
    return false;
  }

  return false;
};

export interface SavedContentItem {
  type: "Video" | "Short" | "Post";
  content: any;
}

export interface SavedResponse {
  savedContent: SavedContentItem[];
}

export const getSavedContent = async (): Promise<SavedResponse> => {
  const response = await axiosClient.get<SavedResponse>(
    "/v1/save/saved"
  );

  return response.data;
};