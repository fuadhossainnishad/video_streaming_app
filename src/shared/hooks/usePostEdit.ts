import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { getPostById, updatePost } from '@/domain/video/api/post-edit.service';

interface MediaFile {
  uri: string;         // local file:// URI (always)
  name: string;
  type: string;
  isExisting: boolean;
  remoteUrl?: string;  // original S3 URL (only for existing)
}

interface PostFormData {
  description: string;
  hashtags: string[];
  links: string;
  taggedPeople: string[];
}

export const usePostEdit = (postId: string) => {
  const [formData, setFormData] = useState<PostFormData>({
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

  useEffect(() => {
    loadPostData();
  }, [postId]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      const post = await getPostById(postId);

      setFormData({
        description: post.description || '',
        hashtags: post.hashtags || [],
        links: post.links || '',
        taggedPeople: post.taggedPeople || [],
      });

      // Store remote URL — will be downloaded to local URI before submit
      const existingMedia: MediaFile[] =
        post.media?.map((item: any) => ({
          uri: item.url,        // remote URL for display
          name: item.url.split('/').pop() || 'image.jpg',
          type: item.type || 'image/jpeg',
          isExisting: true,
          remoteUrl: item.url,  // keep track of remote URL
        })) || [];

      setMediaFiles(existingMedia);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  // Download S3 image to local cache so it can be sent as a file
  const downloadToLocal = async (remoteUrl: string, fileName: string): Promise<string> => {
    const localUri = `${FileSystem.cacheDirectory}post_media_${fileName}`;

    // Use cached version if already downloaded
    const info = await FileSystem.getInfoAsync(localUri);
    if (info.exists) return localUri;

    const { uri } = await FileSystem.downloadAsync(remoteUrl, localUri);
    return uri;
  };

  const pickImages = async () => {
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
      const newFiles: MediaFile[] = result.assets.map((asset, index) => ({
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}_${index}.jpg`,
        type: asset.mimeType || 'image/jpeg',
        isExisting: false,
      }));
      setMediaFiles(prev => [...prev, ...newFiles]);
      setErrors(prev => ({ ...prev, media: '' }));
    }
  };

  const replaceImage = async (index: number) => {
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
      setMediaFiles(prev => {
        const updated = [...prev];
        updated[index] = {
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.mimeType || 'image/jpeg',
          isExisting: false,
        };
        return updated;
      });
    }
  };

  const removeImage = (index: number) => {
    Alert.alert('Remove Image', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setMediaFiles(prev => prev.filter((_, i) => i !== index)),
      },
    ]);
  };

  const updateField = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const addHashtag = (tag: string) => {
    const clean = tag.trim().replace(/^#/, '');
    if (clean && !formData.hashtags.includes(clean)) {
      setFormData(prev => ({ ...prev, hashtags: [...prev.hashtags, clean] }));
    }
  };

  const removeHashtag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (mediaFiles.length === 0) newErrors.media = 'At least one image is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitUpdate = async () => {
    if (!validate()) return null;

    try {
      setUpdating(true);
      setUploadProgress(0);

      // Download existing S3 images to local cache before sending
      const resolvedMedia = await Promise.all(
        mediaFiles.map(async (file) => {
          if (!file.isExisting) {
            // Already a local file
            return { uri: file.uri, name: file.name, type: file.type };
          }
          // Download S3 image to local cache
          const localUri = await downloadToLocal(file.remoteUrl!, file.name);
          return { uri: localUri, name: file.name, type: file.type };
        })
      );

      console.log('submitUpdate resolvedMedia:', resolvedMedia.map(f => ({
        name: f.name,
        uri: f.uri.substring(0, 60),
      })));

      const response = await updatePost(
        {
          postId,
          description: formData.description,
          hashtags: formData.hashtags,
          links: formData.links,
          taggedPeople: formData.taggedPeople,
          allMedia: resolvedMedia,
        },
        (progress) => setUploadProgress(progress)
      );

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
    submitUpdate,
    reloadPost: loadPostData,
  };
};