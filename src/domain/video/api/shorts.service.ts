// domain/short/api/short.service.ts

import { axiosClient } from "@/shared/config/axios.config";
import { GET_ALL_SHORT, GET_SHORT_BY_CHANNEL, GET_SHORT_BY_ID } from "@/shared/constants/api.constants";
import { ApiShortPagination, ApiShortResponse, ShortData } from "@/shared/types/shorts.types";
import { transformShort, transformShorts } from "@/shared/utils/shorts.utils";

// import { GET_SHORTS } from "@/shared/constants/api.constants";

export interface GetShortsResult {
    shorts: ReturnType<typeof transformShorts>;
    pagination: ApiShortPagination
}

export const getShorts = async (
    page: number = 1,
    limit: number = 10
): Promise<GetShortsResult> => {
    try {
        const { data } = await axiosClient.get<ApiShortResponse>(
            GET_ALL_SHORT,
            // { params: { page, limit } }
        );

        // MOCK RESPONSE (remove when API ready)
        // const data = mockShortsResponse

        if (data.status !== "success") {
            throw new Error("Failed to fetch shorts");
        }
        console.log('shorts data:', data.data)
        const transformed = transformShorts(data.data.shorts);

        return {
            shorts: transformed,
            pagination: data.data.pagination,
        };
    } catch (error: any) {
        console.error("Error fetching shorts:", error);
        throw {
            message: error.message || "Failed to fetch shorts",
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Fetch a single short by ID from API
 * GET /shorts/:id
 */
export const getShortById = async (shortId: string): Promise<ShortData> => {
    try {
        const { data } = await axiosClient.get(GET_SHORT_BY_ID(shortId));
        console.log("getShortById:", data)
        if (data.status !== 'success' || !data.data) {
            throw new Error('Short not found');
        }
        console.log("getShortById:", transformShort(data.data.short))

        // Transform single short
        return transformShort(data.data.short);
    } catch (error: any) {
        console.error('Error fetching short:', error);
        throw {
            message: error.message || 'Failed to fetch short',
            statusCode: error.statusCode || 500,
        };
    }
};

export interface GetShortParams {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
}

export const getShortByChannel = async (
    channelId: string,
    params: GetShortParams = {}
): Promise<GetShortsResult> => {
    try {
        const { data } = await axiosClient.get(GET_SHORT_BY_CHANNEL(channelId), {
            params,
        });
        if (data.status !== "success") {
            throw new Error("Failed to fetch shorts");
        }
        console.log('shorts data of channel:', data.data)
        const transformed = transformShorts(data.data.shorts);

        return {
            shorts: transformed,
            pagination: data.data.pagination,
        };
    } catch (error: any) {
        console.error('Error fetching short:', error);
        throw {
            message: error.message || 'Failed to fetch short',
            statusCode: error.statusCode || 500,
        };
    }
};