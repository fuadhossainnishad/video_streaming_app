// shared/hooks/usePostEdit-Complete.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getPostById, updatePost } from '@/domain/video/api/post-edit.service';

interface MediaFile {
    uri: string;
    name: string;
    type: string;
    isExisting?: boolean;
    _id?: string;
}

interface FormData {
    description: string;
    hashtags: string[];
    links: string;
    taggedPeople: string[];
}

export const usePostEdit = (postId: string) => {
    const [formData, setFormData] = useState<FormData>({
        description: '',
        hashtags: [],
        links: '',
        taggedPeople: [],
    });

    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});

    /**
     * Load post data on mount
     */
    useEffect(() => {
        loadPostData();
    }, [postId]);

    /**
     * Load post data from API
     */
    const loadPostData = async () => {
        try {
            setLoading(true);
            console.log('Loading post:', postId);

            const post = await getPostById(postId);
            console.log('Post loaded:', post);

            // Set form data
            setFormData({
                description: post.description || '',
                hashtags: post.hashtags || [],
                links: post.links || '',
                taggedPeople: post.taggedPeople || [],
            });

            // Set existing media
            const existingMedia =
                post.media?.map((item: any) => ({
                    uri: item.url,
                    name: item.url.split('/').pop() || 'image.jpg',
                    type: item.type || 'image/jpeg',
                    isExisting: true,
                    _id: item._id,
                })) || [];

            console.log('Existing media:', existingMedia);
            setMediaFiles(existingMedia);
        } catch (error: any) {
            console.error('Error loading post:', error);
            Alert.alert('Error', error.message || 'Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Pick multiple images to add
     */
    const pickImages = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please allow access to your photos');
                return;
            }

            const remainingSlots = 10 - mediaFiles.length;
            if (remainingSlots <= 0) {
                Alert.alert('Limit reached', 'You can only have up to 10 images');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: remainingSlots,
            });

            if (!result.canceled && result.assets.length > 0) {
                const newFiles = result.assets.map((asset, index) => ({
                    uri: asset.uri,
                    name: asset.fileName || `image_${Date.now()}_${index}.jpg`,
                    type: 'image/jpeg',
                    isExisting: false,
                }));

                setMediaFiles((prev) => [...prev, ...newFiles]);
                setErrors((prev) => ({ ...prev, media: '' }));
            }
        } catch (error) {
            console.error('Error picking images:', error);
            Alert.alert('Error', 'Failed to pick images');
        }
    };

    /**
     * Replace specific image
     */
    const replaceImage = async (index: number) => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please allow access to your photos');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const newFile: MediaFile = {
                    uri: asset.uri,
                    name: asset.fileName || `image_${Date.now()}.jpg`,
                    type: 'image/jpeg',
                    isExisting: false,
                };

                setMediaFiles((prev) => {
                    const updated = [...prev];
                    updated[index] = newFile;
                    return updated;
                });
            }
        } catch (error) {
            console.error('Error replacing image:', error);
            Alert.alert('Error', 'Failed to replace image');
        }
    };

    /**
     * Remove image
     */
    const removeImage = (index: number) => {
        Alert.alert('Remove Image', 'Are you sure you want to remove this image?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: () => {
                    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
                },
            },
        ]);
    };

    /**
     * Update form field
     */
    const updateField = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    /**
     * Add hashtag
     */
    const addHashtag = (tag: string) => {
        const cleanTag = tag.trim().replace(/^#/, '');
        if (cleanTag && !formData.hashtags.includes(cleanTag)) {
            setFormData((prev) => ({
                ...prev,
                hashtags: [...prev.hashtags, cleanTag],
            }));
        }
    };

    /**
     * Remove hashtag
     */
    const removeHashtag = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            hashtags: prev.hashtags.filter((_, i) => i !== index),
        }));
    };

    /**
     * Add link
     */
    // const addLink = (link: string) => {
    //     const cleanLink = link.trim();
    //     if (cleanLink && !formData.links.includes(cleanLink)) {
    //         setFormData((prev) => ({
    //             ...prev,
    //             links: [...prev.links, cleanLink],
    //         }));
    //     }
    // };

    /**
     * Remove link
     */
    // const removeLink = (index: number) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         links: prev.links.filter((_, i) => i !== index),
    //     }));
    // };

    /**
     * Validate form
     */
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (mediaFiles.length === 0) {
            newErrors.media = 'At least one image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Submit update
     */
    const submitUpdate = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fill all required fields');
            return null;
        }

        try {
            setUpdating(true);
            setUploadProgress(0);

            // Separate existing and new media
            const existingMedia = mediaFiles.filter((file) => file.isExisting);
            const newMedia = mediaFiles.filter((file) => !file.isExisting);

            console.log('Submitting update:', {
                existingCount: existingMedia.length,
                newCount: newMedia.length,
                totalImages: mediaFiles.length,
            });

            const response = await updatePost(
                {
                    postId,
                    description: formData.description,
                    hashtags: formData.hashtags,
                    links: formData.links,
                    taggedPeople: formData.taggedPeople,
                    newMedia: newMedia.length > 0 ? newMedia : undefined,
                    // existingMediaIds: existingMedia.map((m) => m._id!).filter(Boolean),
                },
                (progress) => {
                    console.log('Upload progress:', progress);
                    setUploadProgress(progress);
                }
            );

            console.log('Update successful:', response);
            return response;
        } catch (error: any) {
            console.error('Update failed:', error);
            throw error;
        } finally {
            setUpdating(false);
        }
    };

    return {
        formData,
        mediaFiles,
        loading,
        updating,
        uploadProgress,
        errors,
        pickImages,
        replaceImage,
        removeImage,
        updateField,
        addHashtag,
        removeHashtag,
        // addLink,
        // removeLink,
        submitUpdate,
        reloadPost: loadPostData,
    };
};