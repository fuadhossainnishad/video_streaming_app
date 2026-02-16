import { axiosClient } from "@/shared/config/axios.config";
import { CREATE_CHANNEL, EDIT_CHANNEL, GET_ALL_CHANNEL, GET_MY_CHANNEL } from "@/shared/constants/api.constants";
import { mockChannelDetailsResponse, mockMychannelResponse, mockTopChannelsResponse } from "@/shared/mock/channel.mock";
import {
    ApiAllChannelsResponse,
    ApiChannelByIdResponse,
    ChannelData,
    ChannelDetailsData,
    ICreateChannelApi,
} from "@/shared/types/channel.types";
import {
    transformChannelDetailsData,
    transformChannelsData,
} from "@/shared/utils/channel.utils";

/**
 * Fetch all channels
 */
export const getAllChannels = async (): Promise<ChannelData[]> => {
    try {
        const { data } = await axiosClient.get<ApiAllChannelsResponse>(GET_ALL_CHANNEL);

        // const data = mockTopChannelsResponse


        if (data.status !== "success" || !data.data) {
            throw new Error("Invalid channel response");
        }

        console.log("Channel data fetched:", data.data);

        return transformChannelsData(data.data);
    } catch (error: any) {
        console.error("Error fetching channels:", error);

        throw {
            message: error.message || "Failed to fetch channels",
            statusCode: error.response?.status || 500,
        };
    }
};

/**
 * Fetch single channel by ID
 */
export const getChannelById = async (
    channelId: string
): Promise<ChannelDetailsData> => {
    try {
        // const { data } =
        //     await axiosInstance.get<ApiChannelByIdResponse>(
        //         `/channel/${channelId}`
        //     );
        const data = mockChannelDetailsResponse;

        if (data.status !== "success" || !data.data) {
            throw new Error("Invalid channel details response");
        }

        // ✅ Match ID properly
        if (data.data._id !== channelId) {
            throw new Error("Channel not found");
        }

        if (!data.data) {
            throw new Error("Channel not found");
        }
        return transformChannelDetailsData(data.data);
    } catch (error: any) {
        console.error("Error fetching channel:", error);

        throw {
            message: error.message || "Failed to fetch channel",
            statusCode: error.response?.status || 500,
        };
    }
};

export const getMyChannel = async (
): Promise<ChannelDetailsData> => {
    try {
        const { data } = await axiosClient.get<ApiChannelByIdResponse>(
            GET_MY_CHANNEL
        );
        // const data = mockMychannelResponse;
        console.log("Channel data fetched:", data.data);

        if (data.status !== "success" || !data.data) {
            throw new Error("Invalid channel details response");
        }

        if (!data.data) {
            throw new Error("Channel not found");
        }
        return transformChannelDetailsData(data.data);
    } catch (error: any) {
        console.error("Error fetching channel:", error);

        throw {
            message: error.message || "Failed to fetch channel",
            statusCode: error.response?.status || 500,
        };
    }
};

/**
 * Create a new channel
 */
export const createChannel = async (
    data: ICreateChannelApi
): Promise<ApiChannelByIdResponse['data']> => {
    try {
        const formData = new FormData();

        formData.append('channelName', data.channelName);
        formData.append('description', data.description);

        // Append channel icon
        if (data.channelIcon) {
            formData.append('channelIcon', data.channelIcon as any);
        }

        // Append links
        formData.append('links', data.link);

        // if (data.links && data.links.length > 0) {
        //     data.links.forEach((link, index) => {
        //         formData.append(`links[${index}]`, link);
        //     });
        // }

        const response = await axiosClient.post<ApiChannelByIdResponse>(
            CREATE_CHANNEL,
            formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("Channel data fetched:", response.data);

        if (response.data.status !== 'success') {
            throw new Error('Failed to create channel');
        }

        return response.data.data;
    } catch (error: any) {
        console.error('Error creating channel:', error);
        throw {
            message: error.message || 'Failed to create channel',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Update existing channel
 */
export const updateChannel = async (
    data: ICreateChannelApi
): Promise<ApiChannelByIdResponse['data']> => {
    try {
        const formData = new FormData();

        if (data.channelName) {
            formData.append('channelName', data.channelName);
        }

        if (data.description) {
            formData.append('description', data.description);
        }

        // Append channel icon if provided
        if (data.channelIcon) {
            formData.append('channelIcon', data.channelIcon as any);
        }

        // Append links if provided
        formData.append('links', data.link);

        // if (data.links && data.links.length > 0) {
        //     data.links.forEach((link, index) => {
        //         formData.append(`links[${index}]`, link);
        //     });
        // }

        const response = await axiosClient.put<ApiChannelByIdResponse>(
            EDIT_CHANNEL,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        console.log("Channel data fetched:", response.data);

        if (response.data.status !== 'success') {
            throw new Error('Failed to update channel');
        }

        return response.data.data;
    } catch (error: any) {
        console.error('Error updating channel:', error);
        throw {
            message: error.message || 'Failed to update channel',
            statusCode: error.statusCode || 500,
        };
    }
};