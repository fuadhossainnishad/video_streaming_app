import { axiosClient } from '@/shared/config/axios.config';
import { ApiPost } from '@/shared/types/post.types';
import { ApiShort } from '@/shared/types/shorts.types';
import { ApiVideo } from '@/shared/types/video.types';
import { transformPostsData } from '@/shared/utils/post.utils';
import { transformShorts } from '@/shared/utils/shorts.utils';
import { transformVideosData } from '@/shared/utils/video.utils';

type SearchResponse = {
    videos: ApiVideo[];
    posts: ApiPost[];
    shorts: ApiShort[];
    total: {
        videos: number;
        posts: number;
        shorts: number;
    };
    page: number;
    limit: number;
};

export const searchVideos = async (
    query: string,
    page = 1,
    limit = 10
) => {
    const response = await axiosClient.get<SearchResponse>('/v1/search/search', {
        params: { query, page, limit },
    });
    const transformedVideos = transformVideosData(response.data.videos);

    return transformedVideos;
};

export const searchShorts = async (
    query: string,
    page = 1,
    limit = 10
) => {
    const response = await axiosClient.get<SearchResponse>('/search/search', {
        params: { query, page, limit },
    });
    const transformedShorts = transformShorts(response.data.shorts);

    return transformedShorts;
};

export const searchPost = async (
    query: string,
    page = 1,
    limit = 10
) => {
    const response = await axiosClient.get<SearchResponse>('/search/search', {
        params: { query, page, limit },
    });
    const transformedPost = transformPostsData(response.data.posts);

    return transformedPost;
};