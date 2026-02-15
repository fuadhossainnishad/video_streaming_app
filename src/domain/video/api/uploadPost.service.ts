// domain/video/api/upload.service.ts
import { axiosClient } from '@/shared/config/axios.config';
import { PostUploadFormData, PostUploadResponse } from '@/shared/types/uploadPost.type';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Upload a new post with multiple images
 * @param formData - Post upload form data
 * @returns Promise with upload response
 */
export const uploadPost = async (
    formData: PostUploadFormData
): Promise<PostUploadResponse> => {
    try {
        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGNlNWZjODI3ZWQ0ZDgyZTQ4ZjU2NSIsImlhdCI6MTc3MTA2MTM4OCwiZXhwIjoxNzcxNjY2MTg4fQ.HD8bXkCiA1AGN90xviEK0FTvGAisxTumYAIIWMoxvmw'
        // AsyncStorage.setItem('token', token)
        const data = new FormData();

        // Append required fields
        data.append('channel', formData.channel);
        data.append('description', formData.description);

        // Append media files (multiple images)
        if (formData.media && Array.isArray(formData.media)) {
            formData.media.forEach((file, index) => {
                data.append('media', {
                    uri: file.uri,
                    name: file.name,
                    type: file.type,
                } as any);
            });
        }

        // Append hashtags array (without # prefix)
        // formData.hashtags.forEach((hashtag, index) => {
        //     const cleanHashtag = hashtag.replace(/^#/, '');
        //     data.append(`hashtags[${index}]`, cleanHashtag);
        // });
        data.append('hashtags', JSON.stringify(formData.hashtags));

        data.append('links', 'dfgfffg');

        // if (formData.links && formData.links.length > 0 && formData.links[0]) {
        //     data.append('links', formData.links.join(' '));
        // }
        // data.append('links', formData.links[0]!);
        // Append links array
        // formData.links.forEach((link, index) => {
        //     data.append(`links[${index}]`, link);
        // });

        // Append tagged people if exists
        // if (formData.taggedPeople && formData.taggedPeople.length > 0) {
        //     formData.taggedPeople.forEach((personId, index) => {
        //         data.append(`taggedPeople[${index}]`, personId);
        //     });
        // }

        data.append('taggedPeople', JSON.stringify(formData.taggedPeople));

        console.log("updload post:", data)
        console.log("token:", await AsyncStorage.getItem('token'))

        // Auth token is automatically added by axios interceptor
        const response = await axiosClient.post<PostUploadResponse>(
            '/post/create',
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Authorization: `Bearer ${token}`,

                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    console.log('Upload progress:', percentCompleted);
                },
            }
        );
        console.log("post response:", response.data)
        return response.data;
    } catch (error: any) {
        console.error('Error uploading post:', error);
        throw {
            message: error.response?.data?.message || 'Failed to upload post',
            statusCode: error.response?.status || 500,
        };
    }
};