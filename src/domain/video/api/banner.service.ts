import {axiosClient} from '@/shared/config/axios.config';
import { Banner } from '@/shared/types/banner.types';

interface BannerResponse {
    status: string;
    results: number;
    data: Banner[];
}

export const getAllBanners = async (): Promise<Banner[]> => {
    const response = await axiosClient.get<BannerResponse>('/v1/banners');

    if (response.data?.status !== 'success') {
        throw new Error('Failed to fetch banners');
    }
    console.log("getAllBanners:", response.data.data)
    // Only return active banners
    return response.data.data.filter(b => b.isActive);
};