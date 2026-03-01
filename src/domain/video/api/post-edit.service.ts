// domain/post/api/post-edit.service.ts
import { Platform } from 'react-native';
import { axiosClient } from '@/shared/config/axios.config';


interface UpdatePostData {
    postId: string;
    description: string;
    hashtags: string[];
    links: string;
    taggedPeople: string[];
    newMedia?: {
        uri: string;
        name: string;
        type: string;
    }[];
    // existingMediaIds?: string[];
}

/**
 * Update post
 * PUT /post/update/:postId
 */
export const updatePost = async (
    data: UpdatePostData,
    onProgress?: (progress: number) => void
) => {
    try {
        const formData = new FormData();

        // Add text fields
        formData.append('description', data.description);
        formData.append("hashtags", JSON.stringify(data.hashtags));
        formData.append("taggedPeople", JSON.stringify(data.taggedPeople));
        // formData.append('channelId', data.channelId);
        // Add arrays
        // data.hashtags.forEach(tag => {
        //     formData.append(`hashtags`, tag);
        // });
        formData.append('links', data.links || '');
        console.log("Sending channelId:", data.links);

        // data.links.forEach((link, index) => {
        //     formData.append(`links`, link[0]);
        // });

        // data.taggedPeople.forEach(person => {
        //     formData.append(`taggedPeople`, person);
        // });
        console.log("Sending channelId:", data.links);

        // Add existing media IDs (media to keep)
        // if (data.existingMediaIds && data.existingMediaIds.length > 0) {
        //     data.existingMediaIds.forEach((id, index) => {
        //         formData.append(`existingMediaIds[${index}]`, id);
        //     });
        // }

        // Add new media files
        // Add new media files
        if (data.newMedia && data.newMedia.length > 0) {
            data.newMedia.forEach((file) => {
                formData.append("media", {
                    uri:
                        Platform.OS === "android"
                            ? file.uri
                            : file.uri.replace("file://", ""),
                    type: file.type ?? "image/jpeg",
                    name: file.name ?? `upload_${Date.now()}.jpg`,
                } as any);
            });
        }
        for (const pair of (formData as any).entries()) {
            console.log("FORMDATA:", pair[0], pair[1]);
        }
        // Make request with plain axios
        const response = await axiosClient.put(
            `/post/update/${data.postId}`,
            formData,
            {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress?.(percentCompleted);
                    }
                },
                timeout: 60000,
            }
        );

        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to update post');
        }

        return response.data;
    } catch (error: any) {
        console.error('Post update error:', error);

        if (error.response) {
            const message = error.response.data?.message || 'Server error during update';
            throw new Error(message);
        }

        if (error.request) {
            throw new Error('No response from server. Check your internet connection.');
        }

        throw new Error(error.message || 'Failed to update post');
    }
};

/**
 * Get post by ID
 * GET /post/:postId
 */
export const getPostById = async (postId: string): Promise<any> => {
    try {
        const response = await axiosClient.get(`/post/${postId}`);

        if (response.data.status !== 'success') {
            throw new Error('Failed to fetch post');
        }

        return response.data.data;
    } catch (error: any) {
        console.error('Error fetching post:', error);
        throw new Error(error.message || 'Failed to fetch post');
    }
};