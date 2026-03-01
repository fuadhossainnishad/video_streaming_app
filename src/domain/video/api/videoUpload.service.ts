// domain/video/api/video-upload.service.ts
import appConfig from '@/shared/config/app.config';
import axios from 'axios';
import { Platform } from 'react-native';

const API_BASE_URL = appConfig.base_url

interface VideoUploadData {
    title: string;
    description: string;
    videoFile: {
        uri: string;
        name: string;
        type: string;
    };
    thumbnailFile: {
        uri: string;
        name: string;
        type: string;
    };
    hashtags: string[];
    links: string[];
    category: string;
    language: string;
    visibility: string;
}

/**
 * Upload video with proper FormData handling
 */
export const uploadVideo = async (
    data: VideoUploadData,
    onProgress?: (progress: number) => void
) => {
    try {
        const formData = new FormData();

        // Add text fields
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('language', data.language);
        formData.append('visibility', data.visibility);

        // Add hashtags array
        data.hashtags.forEach((tag, index) => {
            formData.append(`hashtags[${index}]`, tag);
        });

        // Add links array
        data.links.forEach((link, index) => {
            formData.append(`links[${index}]`, link);
        });

        // Add video file - CRITICAL: Proper file handling for React Native
        const videoFile: any = {
            uri: Platform.OS === 'android'
                ? data.videoFile.uri
                : data.videoFile.uri.replace('file://', ''),
            type: data.videoFile.type || 'video/mp4',
            name: data.videoFile.name || 'video.mp4',
        };
        formData.append('video', videoFile);

        // Add thumbnail file
        const thumbnailFile: any = {
            uri: Platform.OS === 'android'
                ? data.thumbnailFile.uri
                : data.thumbnailFile.uri.replace('file://', ''),
            type: data.thumbnailFile.type || 'image/jpeg',
            name: data.thumbnailFile.name || 'thumbnail.jpg',
        };
        formData.append('thumbnail', thumbnailFile);

        // Get auth token from AsyncStorage
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const tokensJson = await AsyncStorage.getItem('@auth_tokens');
        const tokens = tokensJson ? JSON.parse(tokensJson) : null;

        if (!tokens?.accessToken) {
            throw new Error('Not authenticated');
        }

        // Make request with axios (NOT axiosClient to avoid interceptors)
        const response = await axios.post(`${API_BASE_URL}/video/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${tokens.accessToken}`,
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress?.(percentCompleted);
                }
            },
            timeout: 300000, // 5 minutes timeout for large videos
        });

        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Upload failed');
        }

        return response.data;
    } catch (error: any) {
        console.error('Video upload error:', error);

        // Better error messages
        if (error.code === 'ECONNABORTED') {
            throw new Error('Upload timeout. Please try again with a smaller file.');
        }

        if (error.response) {
            // Server responded with error
            const message = error.response.data?.message || 'Server error during upload';
            throw new Error(message);
        }

        if (error.request) {
            // Request made but no response
            throw new Error('No response from server. Check your internet connection.');
        }

        // Other errors
        throw new Error(error.message || 'Failed to upload video');
    }
};