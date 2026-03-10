import { useState, useCallback, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { editVideo, getVideoById } from '@/domain/video/api/EditVideo.service';
import { EditVideoFormData, VideoDetail } from '@/shared/types/EditVideo.type';
import { FilePickerResult } from '../types/upload.type';

export const useEditVideo = (videoId: string) => {
    const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null);
    const [formData, setFormData] = useState<EditVideoFormData>({
        title: '',
        description: '',
        thumbnail: null,
        existingThumbnailUrl: '',
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true);
                const response = await getVideoById(videoId);
                const video = response.data.video;
                setVideoDetail(video);
                setFormData({
                    title: video.title,
                    description: video.description,
                    thumbnail: null,
                    existingThumbnailUrl: video.thumbnail,
                });
            } catch (error) {
                console.error('Failed to fetch video:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [videoId]);

    const updateField = useCallback(
        (field: keyof Omit<EditVideoFormData, 'thumbnail' | 'existingThumbnailUrl'>, value: string) => {
            setFormData(prev => ({ ...prev, [field]: value }));
            setErrors(prev => ({ ...prev, [field]: '' }));
        },
        []
    );

    const pickThumbnail = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setErrors(prev => ({ ...prev, thumbnail: 'Media library permission is required.' }));
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

            // Exact same shape as usePostUpload
            const file: FilePickerResult = {
                uri: asset.uri,
                name: asset.fileName || `thumbnail-${Date.now()}.jpg`,
                type: 'image/jpeg',
                size: asset.fileSize || 0,
            };

            // Store directly in formData.thumbnail — same as postUpload stores in formData.media
            setFormData(prev => {
                const updated = { ...prev, thumbnail: file };
                console.log('PICKED thumbnail uri:', updated.thumbnail?.uri); // ADD THIS
                return updated;
            });
            setErrors(prev => ({ ...prev, thumbnail: '' }));
        }
    }, []);

    const validate = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required.';
        if (!formData.description.trim()) newErrors.description = 'Description is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const submitEdit = useCallback(async () => {
        if (!validate()) return null;
        console.log('SUBMIT thumbnail:', JSON.stringify(formData.thumbnail));
        console.log('SUBMIT existingThumbnailUrl:', formData.existingThumbnailUrl);
        try {
            setUploading(true);
            const response = await editVideo(formData, videoId);
            setVideoDetail(response.data.video);
            setFormData(prev => ({
                ...prev,
                existingThumbnailUrl: response.data.video.thumbnail,
                thumbnail: null,
            }));
            return response;
        } catch (error: any) {
            throw error;
        } finally {
            setUploading(false);
        }
    }, [formData, validate, videoId]);

    // Derive preview URI — new pick takes priority over existing server URL
    const thumbnailPreviewUri = formData.thumbnail?.uri || formData.existingThumbnailUrl;

    return {
        videoDetail,
        formData,
        thumbnailPreviewUri,  // ← use this in the screen instead of thumbnailFile
        loading,
        uploading,
        errors,
        updateField,
        pickThumbnail,
        submitEdit,
    };
};