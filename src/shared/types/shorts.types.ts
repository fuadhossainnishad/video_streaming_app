// shared/types/short.types.ts

// ---------------- API TYPES ----------------

export interface ApiShortOwner {
    _id: string;
    username: string;
    avatar: string;
}

export interface ApiShortChannel {
    _id: string;
    channelName: string;
    channelIcon: string;
    totalfollowers: number;
}

export interface ApiShort {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    hashtags: string[];
    owner: ApiShortOwner;
    channel: ApiShortChannel;
    totalViews: number;
    likesCount: number;
    dislikesCount: number;
    commentsCount: number;
    totalRevenue: number;
    watchTime: number;
    isPublished: boolean;
    visibility: string;
    duration: number;
    category: string;
    language: string;
    transcodeJobId: string;
    transcodeStatus: string;
    createdAt: string;
    updatedAt: string;
    streamingUrl: string | null;
}

export interface ApiShortPagination {
    currentPage: number;
    totalPages: number;
    totalShorts: number;
    hasMore: boolean;
}

export interface ApiShortResponse {
    status: "success" | "error";
    data: {
        shorts: ApiShort[];
        pagination: ApiShortPagination;
    };
}

export interface ApiShortByIdResponse {
    status: "success" | "error";
    data: {
        short: ApiShort;
    };
}


// ---------------- UI TYPES ----------------

export interface ShortData {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    hashtags: string[];
    ownerName: string;
    ownerAvatar: string;
    channelId: string
    channelName: string;
    channelIcon: string;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
    category: string;
    language: string;
    createdAt: string;
}
