import { axiosClient } from "@/shared/config/axios.config";

export interface AppSettings {
    aboutUs: string;
    privacyPolicy: string;
    termsAndConditions: string;
}

export const getAppSettings = async (): Promise<AppSettings> => {
    const response = await axiosClient.get('/v1/setting');

    if (response.data?.status !== 'success') {
        throw new Error('Failed to fetch settings');
    }
    console.log("settings data:", response.data.data)
    return response.data.data;
};