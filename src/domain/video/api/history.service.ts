import { axiosClient } from "@/shared/config/axios.config";

interface HistoryPayload {
    videoId: string | null;
    shortId: string | null;
}

export const createHistory = async (payload: HistoryPayload) => {
    try {
        const { data } = await axiosClient.post(
            "/v1/history/history",
            payload
        );

        if (data?.status !== "success") {
            throw new Error(data?.message || "History failed");
        }
        console.log("hostry:", data)
        return data;
    } catch (error: any) {
        console.error("History API Error:", error);
        // 🔥 Don't break UI if history fails
        return null;
    }
};

export const getHistory = async () => {
    try {
        const { data } = await axiosClient.get("/v1/history/history");

        if (data?.status !== "success") {
            throw new Error("Failed to fetch history");
        }

        const historyItems = data?.data || [];

        const videos = historyItems
            .map((item: any) => {
                if (item.video) return item.video;
                // if (item.short) return item.short;
                return null;
            })
            .filter(Boolean);

        return videos;
    } catch (error) {
        console.error("History fetch error:", error);
        return [];
    }
};