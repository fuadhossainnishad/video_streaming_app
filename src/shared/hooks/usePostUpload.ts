// presentation/Add/hooks/usePostUpload.ts
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Asset } from 'expo-asset';

import { FilePickerResult, PostUploadFormData } from '../types/uploadPost.type';
import { uploadPost } from '@/domain/video/api/uploadPost.service';

const FALLBACK_IMAGE = require('../../../assets/poster/hero.png');

export const usePostUpload = () => {
    const [formData, setFormData] = useState<PostUploadFormData>({
        channel: '69570442ce4c2a5636bc700a',
        description: '',
        hashtags: [],
        links: [],
        media: null,
        taggedPeople: [],
    });

    const [mediaFiles, setMediaFiles] = useState<FilePickerResult[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load fallback asset
    const loadFallbackAsset = async (): Promise<FilePickerResult> => {
        try {
            const asset = Asset.fromModule(FALLBACK_IMAGE);
            await asset.downloadAsync();

            return {
                uri: asset.localUri || asset.uri,
                name: 'image.jpg',
                type: 'image/jpeg',
                size: 0,
            };
        } catch (error) {
            console.error('Error loading fallback:', error);
            throw error;
        }
    };

    // Pick multiple images
    const pickImages = useCallback(async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                console.log('Permission denied, using fallback');
                const fallback = await loadFallbackAsset();
                setMediaFiles([fallback]);
                setFormData(prev => ({ ...prev, media: [fallback] as any }));
                setErrors(prev => ({ ...prev, media: '' }));
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: 10,
            });

            if (!result.canceled && result.assets.length > 0) {
                const files: FilePickerResult[] = result.assets.map((asset, index) => ({
                    uri: asset.uri,
                    name: asset.fileName || `image_${index}.jpg`,
                    type: 'image/jpeg',
                    size: asset.fileSize || 0,
                }));

                setMediaFiles(files);
                setFormData(prev => ({ ...prev, media: files as any }));
                setErrors(prev => ({ ...prev, media: '' }));
            } else {
                // User cancelled, use fallback
                const fallback = await loadFallbackAsset();
                setMediaFiles([fallback]);
                setFormData(prev => ({ ...prev, media: [fallback] as any }));
                setErrors(prev => ({ ...prev, media: '' }));
            }
        } catch (error) {
            console.error('Error picking images:', error);
            const fallback = await loadFallbackAsset();
            setMediaFiles([fallback]);
            setFormData(prev => ({ ...prev, media: [fallback] as any }));
            setErrors(prev => ({ ...prev, media: '' }));
        }
    }, []);

    // Remove image at index
    const removeImage = useCallback((index: number) => {
        setMediaFiles(prev => {
            const updated = prev.filter((_, i) => i !== index);
            setFormData(prevForm => ({ ...prevForm, media: updated as any }));
            return updated;
        });
    }, []);

    // Update form field
    const updateField = useCallback(
        (field: keyof PostUploadFormData, value: any) => {
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
                hashtags: [...prev.hashtags, cleanHashtag],
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

    // Load test files for emulator
    const loadTestFiles = useCallback(async () => {
        try {
            console.log('Loading test files...');
            const fallback = await loadFallbackAsset();
            setMediaFiles([fallback, fallback, fallback]); // 3 test images
            setFormData(prev => ({ ...prev, media: [fallback, fallback, fallback] as any }));
            alert('Test files loaded!');
        } catch (error) {
            console.error('Error loading test files:', error);
            alert('Failed to load test files');
        }
    }, []);

    // Validate form
    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!mediaFiles || mediaFiles.length === 0) {
            newErrors.media = 'At least one image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, mediaFiles]);

    // Submit form
    const submitUpload = useCallback(async () => {
        if (!validateForm()) {
            return null;
        }

        try {
            setUploading(true);
            setUploadProgress(0);

            const response = await uploadPost(formData);

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
            channel: '69570442ce4c2a5636bc700a',
            description: '',
            hashtags: [],
            links: [],
            media: null,
            taggedPeople: [],
        });
        setMediaFiles([]);
        setErrors({});
        setUploadProgress(0);
    }, []);

    return {
        formData,
        mediaFiles,
        uploading,
        uploadProgress,
        errors,
        pickImages,
        removeImage,
        updateField,
        addHashtag,
        removeHashtag,
        addLink,
        removeLink,
        submitUpload,
        resetForm,
        loadTestFiles,
    };
};