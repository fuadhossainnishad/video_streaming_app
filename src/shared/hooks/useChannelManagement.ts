// shared/hooks/useChannelManagement.ts
import { useState, useCallback } from 'react';
import { getMyChannel, createChannel, updateChannel } from '@/domain/video/api/channel.service';
import {
    ChannelDetailsData,
} from '@/shared/types/channel.types';
import { transformChannelDetailsData } from '../utils/channel.utils';

interface FilePickerResult {
    uri: string;
    name: string;
    type: string;
    size: number;
}

export const useChannelManagement = () => {
    const [channel, setChannel] = useState<ChannelDetailsData | null>(null);
    const [hasChannel, setHasChannel] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user has a channel
    const checkChannel = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const channelData = await getMyChannel();

            if (channelData) {
                setChannel(channelData);
                setHasChannel(true);
            } else {
                setChannel(null);
                setHasChannel(false);
            }

            return channelData;
        } catch (err: any) {
            setError(err.message || 'Failed to check channel');
            setHasChannel(false);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new channel
    const createNewChannel = useCallback(
        async (data: {
            channelName: string;
            description: string;
            channelIcon: FilePickerResult | null | string;
            links: string;
        }) => {
            try {
                setLoading(true);
                setError(null);

                const channelData = await createChannel({
                    channelName: data.channelName,
                    description: data.description,
                    channelIcon: data.channelIcon as any,
                    link: data.links,
                });

                setChannel(transformChannelDetailsData(channelData));
                setHasChannel(true);

                return { success: true, data: channelData };
            } catch (err: any) {
                const errorMessage = err.message || 'Failed to create channel';
                setError(errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Update existing channel
    const updateExistingChannel = useCallback(
        async (data: {
            channelName?: string;
            description?: string;
            channelIcon?: FilePickerResult | null | string;
            links?: string;
        }) => {
            try {
                setLoading(true);
                setError(null);

                const channelData = await updateChannel({
                    channelName: data.channelName!,
                    description: data.description!,
                    channelIcon: data.channelIcon as any,
                    link: data.links!,
                });

                setChannel(transformChannelDetailsData(channelData));

                return { success: true, data: channelData };
            } catch (err: any) {
                const errorMessage = err.message || 'Failed to update channel';
                setError(errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        channel,
        hasChannel,
        loading,
        error,
        checkChannel,
        createNewChannel,
        updateExistingChannel,
        clearError: () => setError(null),
    };
};