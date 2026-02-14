import { axiosClient } from "@/shared/config/axios.config";
import { mockChannelDetailsResponse, mockMychannelResponse, mockTopChannelsResponse } from "@/shared/mock/channel.mock";
import {
    ApiChannelByIdResponse,
    ChannelData,
    ChannelDetailsData,
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
        // const { data } =
        //     await axiosInstance.get<ApiAllChannelsResponse>("/channel");

        const data = mockTopChannelsResponse


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
            `/channel/my_channel`
        );
        // const data = mockMychannelResponse;

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