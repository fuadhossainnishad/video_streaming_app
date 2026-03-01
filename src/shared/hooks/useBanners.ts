import { useEffect, useState } from 'react';
import { Banner } from '@/shared/types/banner.types';
import { getAllBanners } from '@/domain/video/api/banner.service';

export const useBanners = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchBanners = async () => {
            try {
                const result = await getAllBanners();
                if (mounted) setBanners(result);
            } catch (err: any) {
                if (mounted) setError(err.message);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchBanners();

        return () => {
            mounted = false;
        };
    }, []);

    return { banners, loading, error };
};