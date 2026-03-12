// API Types

export interface ApiChannel {
    _id: string;
    channelName: string;
    channelIcon: string;
}

export interface ApiChannelOwner {
    _id: string;
    username: string;
    email: string;
}

export interface ApiChannelDetails extends ApiChannel {
    description: string;
    owner: ApiChannelOwner;
    links: string;
    totalfollowers: number;
    totalViews: number;
    totalRevenue: number;
    totalWatchTime: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiAllChannelsResponse {
    status: "success" | "error";
    data: ApiChannel[];
}

export interface ApiChannelByIdResponse {
    status: "success" | "error";
    data: ApiChannelDetails;
}

export interface ChannelStats {
    channelName: string;
    email: string;
    totalFollowers: number;
    totalViews: number;
    totalRevenue: number;
    totalWatchTime: number; // in hours
    channelIcon: string;
    description: string;
}
export interface MonthlyData {
    month: string;
    value: number;
}
export interface ChannelData {
    id: string;
    name: string;
    avatar: string;
}

export interface DiscoveryChannelData {
    id: string;
    name: string;
    avatar: string;
    totalfollowers: number;
}


export interface ICreateChannelApi {
    channelName: string
    description: string
    channelIcon: File
    link: string
}

export interface ChannelDetailsData extends ChannelData {
    description: string;
    ownerName: string;
    ownerEmail: string;
    links: string;
    followers: number;
    totalViews: number;
    totalRevenue: number;
    totalWatchTime: number;
    createdAt: string;
}
