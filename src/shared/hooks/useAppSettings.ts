import { AppSettings, getAppSettings } from '@/domain/video/api/settings.service';
import { useEffect, useState } from 'react';

export const useAppSettings = () => {
    const [data, setData] = useState<AppSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchSettings = async () => {
            try {
                const result = await getAppSettings();
                if (mounted) setData(result);
            } catch (err: any) {
                if (mounted) setError(err?.message || 'Something went wrong');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchSettings();

        return () => {
            mounted = false;
        };
    }, []);

    return { data, loading, error };
};