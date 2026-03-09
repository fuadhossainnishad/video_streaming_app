// presentation/Add/hooks/useVideoUpload.ts
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Asset } from 'expo-asset';

import { uploadVideo } from '@/domain/video/api/upload.service';
import { FilePickerResult, VideoUploadFormData } from '../types/upload.type';
import { useAuth } from './useauth';

// EMULATOR FALLBACK - Replace these with your actual asset paths
const FALLBACK_THUMBNAIL = require('../../../assets/poster/hero.png');
const FALLBACK_VIDEO = require('../../../assets/videos/sampleVideo.mp4');

export const useVideoUpload = () => {
    const { channel, mychannel } = useAuth();

    const [formData, setFormData] = useState<VideoUploadFormData>({
        title: '',
        description: '',
        hashtags: [],
        links: [],
        category: 'Education',
        language: 'en',
        visibility: 'public',
        video: null,
        thumbnail: null,
        taggedPeople: [],
        channelId: ''
    });

    const [videoFile, setVideoFile] = useState<FilePickerResult | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<FilePickerResult | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});


    const resolveChannelId = useCallback(async (): Promise<string | null> => {
        if (channel?.id) return channel.id;

        const response = await mychannel();
        if (!response.success || !response.data?.id) return null;

        return response.data.id;
    }, [channel?.id, mychannel]);

    // Load fallback asset as file
    const loadFallbackAsset = async (
        assetModule: any,
        fileName: string,
        mimeType: string
    ): Promise<FilePickerResult> => {
        try {
            const asset = Asset.fromModule(assetModule);
            await asset.downloadAsync();

            return {
                uri: asset.localUri || asset.uri,
                name: fileName,
                type: mimeType,
                size: 0, // Size unknown for bundled assets
            };
        } catch (error) {
            console.error('Error loading fallback asset:', error);
            throw error;
        }
    };

    // Pick thumbnail image
    const pickThumbnail = useCallback(async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission denied, using fallback thumbnail');
                // Use fallback thumbnail
                const fallback = await loadFallbackAsset(
                    FALLBACK_THUMBNAIL,
                    'thumbnail.jpg',
                    'image/jpeg'
                );
                setThumbnailFile(fallback);
                setFormData(prev => ({ ...prev, thumbnail: fallback as any }));
                setErrors(prev => ({ ...prev, thumbnail: '' }));
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const file: FilePickerResult = {
                    uri: asset.uri,
                    name: asset.fileName || 'thumbnail.jpg',
                    type: 'image/jpeg',
                    size: asset.fileSize || 0,
                };

                setThumbnailFile(file);
                setFormData(prev => ({ ...prev, thumbnail: file as any }));
                setErrors(prev => ({ ...prev, thumbnail: '' }));
            } else {
                // User cancelled, use fallback
                console.log('User cancelled, using fallback thumbnail');
                const fallback = await loadFallbackAsset(
                    FALLBACK_THUMBNAIL,
                    'thumbnail.jpg',
                    'image/jpeg'
                );
                setThumbnailFile(fallback);
                setFormData(prev => ({ ...prev, thumbnail: fallback as any }));
                setErrors(prev => ({ ...prev, thumbnail: '' }));
            }
        } catch (error) {
            console.error('Error picking thumbnail:', error);
            // Use fallback on error
            const fallback = await loadFallbackAsset(
                FALLBACK_THUMBNAIL,
                'thumbnail.jpg',
                'image/jpeg'
            );
            setThumbnailFile(fallback);
            setFormData(prev => ({ ...prev, thumbnail: fallback as any }));
            setErrors(prev => ({ ...prev, thumbnail: '' }));
        }
    }, []);

    // Pick video file
    const pickVideo = useCallback(async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'video/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const asset = result.assets[0];
                const file: FilePickerResult = {
                    uri: asset.uri,
                    name: asset.name,
                    type: asset.mimeType || 'video/mp4',
                    size: asset.size || 0,
                };

                setVideoFile(file);
                setFormData(prev => ({ ...prev, video: file as any }));
                setErrors(prev => ({ ...prev, video: '' }));
            } else {
                // User cancelled or picker not available, use fallback
                console.log('Using fallback video');
                const fallback = await loadFallbackAsset(
                    FALLBACK_VIDEO,
                    'sample-video.mp4',
                    'video/mp4'
                );
                setVideoFile(fallback);
                setFormData(prev => ({ ...prev, video: fallback as any }));
                setErrors(prev => ({ ...prev, video: '' }));
            }
        } catch (error) {
            console.error('Error picking video:', error);
            // Use fallback on error (emulator case)
            console.log('Error occurred, using fallback video');
            const fallback = await loadFallbackAsset(
                FALLBACK_VIDEO,
                'sample-video.mp4',
                'video/mp4'
            );
            setVideoFile(fallback);
            setFormData(prev => ({ ...prev, video: fallback as any }));
            setErrors(prev => ({ ...prev, video: '' }));
        }
    }, []);

    // Update form field
    const updateField = useCallback(
        (field: keyof VideoUploadFormData, value: any) => {
            setFormData(prev => ({ ...prev, [field]: value }));
            setErrors(prev => ({ ...prev, [field]: '' }));
        },
        []
    );

    // Add hashtag
    const addHashtag = useCallback((hashtag: string) => {
        const cleanHashtag = hashtag.trim().replace(/^#/, '');
        if (cleanHashtag) {
            setFormData(prev => ({
                ...prev,
                hashtags: [...prev.hashtags, `#${cleanHashtag}`],
            }));
        }
    }, []);

    // Remove hashtag
    const removeHashtag = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            hashtags: prev.hashtags.filter((_, i) => i !== index),
        }));
    }, []);

    // Add link
    const addLink = useCallback((link: string) => {
        const cleanLink = link.trim();
        if (cleanLink) {
            setFormData(prev => ({
                ...prev,
                links: [...prev.links, cleanLink],
            }));
        }
    }, []);

    // Remove link
    const removeLink = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index),
        }));
    }, []);

    // Auto-load fallback files for testing (call this from screen)
    const loadTestFiles = useCallback(async () => {
        try {
            console.log('Loading test files for emulator...');

            // Load fallback thumbnail
            const thumbnail = await loadFallbackAsset(
                FALLBACK_THUMBNAIL,
                'thumbnail.jpg',
                'image/jpeg'
            );
            setThumbnailFile(thumbnail);
            setFormData(prev => ({ ...prev, thumbnail: thumbnail as any }));

            // Load fallback video
            const video = await loadFallbackAsset(
                FALLBACK_VIDEO,
                'sample-video.mp4',
                'video/mp4'
            );
            setVideoFile(video);
            setFormData(prev => ({ ...prev, video: video as any }));

            console.log('Test files loaded successfully');
            alert('Test files loaded! You can now test the upload.');
        } catch (error) {
            console.error('Error loading test files:', error);
            alert('Failed to load test files');
        }
    }, []);

    // Validate form
    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!videoFile) {
            newErrors.video = 'Video is required';
        }

        if (!thumbnailFile) {
            newErrors.thumbnail = 'Thumbnail is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, videoFile, thumbnailFile]);

    // Submit form
    const submitUpload = useCallback(async () => {
        if (!validateForm()) {
            return null;
        }
        const channelId = await resolveChannelId();
        if (!channelId) {
            setErrors(prev => ({ ...prev, general: 'Channel not found. Please try again.' }));
            throw new Error('Could not resolve channel ID');
        }
        console.log("channelId:", channelId)

        try {
            setUploading(true);
            setUploadProgress(0);
            console.log("uploadVideo:", formData)
            const response = await uploadVideo({ ...formData, channelId });
            console.log("uploadVideo:", response)

            setUploadProgress(100);
            return response;
        } catch (error: any) {
            console.error('Upload error:', error);
            throw error;
        } finally {
            setUploading(false);
        }
    }, [formData, validateForm]);

    // Reset form
    const resetForm = useCallback(() => {
        setFormData({
            title: '',
            description: '',
            hashtags: [],
            links: [],
            category: 'Education',
            language: 'en',
            visibility: 'public',
            video: null,
            thumbnail: null,
            taggedPeople: [],
            channelId: ''
        });
        setVideoFile(null);
        setThumbnailFile(null);
        setErrors({});
        setUploadProgress(0);
    }, []);

    return {
        formData,
        videoFile,
        thumbnailFile,
        uploading,
        uploadProgress,
        errors,
        pickThumbnail,
        pickVideo,
        updateField,
        addHashtag,
        removeHashtag,
        addLink,
        removeLink,
        submitUpload,
        resetForm,
        loadTestFiles, // NEW: For testing in emulator
    };
};