import { axiosClient } from "@/shared/config/axios.config";

export interface CreateReportPayload {
  contentId: string;
  contentType: "video" | "short";
  reason: string;
  description: string;
}

export const createReport = async (payload: CreateReportPayload) => {
  const response = await axiosClient.post(
    "/v1/report/create",
    payload
  );

  return response.data;
};