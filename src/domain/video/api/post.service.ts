// domain/video/api/post.service.ts
import { axiosClient } from '@/shared/config/axios.config';
import { GET_ALL_POST, GET_POST_BY_CHANNEL } from '@/shared/constants/api.constants';
import { ApiChannelPostResponse, ApiPostResponse, PostUI } from '@/shared/types/post.types';
import { transformPostsData } from '@/shared/utils/post.utils';

export interface GetPostsResult {
  posts: PostUI[];
  count: number;
}

/**
 * Fetch saved posts
 * @param page - Page number
 * @param limit - Posts per page
 * @returns Promise with posts data
 */
export const getSavedPosts = async (
  page: number = 1,
  limit: number = 10
): Promise<GetPostsResult> => {
  try {
    const { data } = await axiosClient.get(GET_ALL_POST, {
      // params: { page, limit },
    });

    // const data = mockPostResponse

    if (data.status !== 'success' || !data.data) {
      throw new Error('Invalid response format');
    }
    console.log('post response from post:', data)
    const transformedPosts = transformPostsData(data.data);

    return {
      posts: transformedPosts,
      count: data.count,
    };
  } catch (error: any) {
    console.error('Error fetching saved posts:', error);
    throw {
      message: error.message || 'Failed to fetch posts',
      statusCode: error.statusCode || 500,
    };
  }
};

/**
 * Fetch all posts
 * @param page - Page number
 * @param limit - Posts per page
 * @returns Promise with posts data
 */
export const getAllPosts = async (
  page: number = 1,
  limit: number = 10
): Promise<GetPostsResult> => {
  try {
    const { data } = await axiosClient.get<ApiPostResponse>('/post/all', {
      params: { page, limit },
    });

    if (data.status !== 'success' || !data.data) {
      throw new Error('Invalid response format');
    }

    const transformedPosts = transformPostsData(data.data);

    return {
      posts: transformedPosts,
      count: data.count,
    };
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    throw {
      message: error.message || 'Failed to fetch posts',
      statusCode: error.statusCode || 500,
    };
  }
};


export const getAllPostsByChannel = async (
  page: number = 1,
  limit: number = 10
): Promise<GetPostsResult> => {
  try {
    const { data } = await axiosClient.get<ApiChannelPostResponse>(GET_POST_BY_CHANNEL);

    if (data.status !== 'success' || !data.data) {
      throw new Error('Invalid response format');
    }
    console.log("fetched post:", data.data.posts)

    const transformedPosts = transformPostsData(data.data.posts);

    return {
      posts: transformedPosts,
      count: data.count,
    };
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    throw {
      message: error.message || 'Failed to fetch posts',
      statusCode: error.statusCode || 500,
    };
  }
};

/**
 * Like a post
 * @param postId - Post ID
 * @returns Promise
 */
export const likePost = async (postId: string): Promise<void> => {
  try {
    await axiosClient.post(`/post/${postId}/like`);
  } catch (error: any) {
    console.error('Error liking post:', error);
    throw {
      message: error.message || 'Failed to like post',
      statusCode: error.statusCode || 500,
    };
  }
};

/**
 * Unlike a post
 * @param postId - Post ID
 * @returns Promise
 */
export const unlikePost = async (postId: string): Promise<void> => {
  try {
    await axiosClient.delete(`/post/${postId}/like`);
  } catch (error: any) {
    console.error('Error unliking post:', error);
    throw {
      message: error.message || 'Failed to unlike post',
      statusCode: error.statusCode || 500,
    };
  }
};

/**
 * Save a post
 * @param postId - Post ID
 * @returns Promise
 */
export const savePost = async (postId: string): Promise<void> => {
  try {
    await axiosClient.post(`/post/${postId}/save`);
  } catch (error: any) {
    console.error('Error saving post:', error);
    throw {
      message: error.message || 'Failed to save post',
      statusCode: error.statusCode || 500,
    };
  }
};