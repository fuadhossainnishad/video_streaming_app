import { useState, useCallback, useEffect } from 'react';
import { editShort, getShortById } from '@/domain/video/api/EditShort.service';
import { EditShortFormData, ShortDetail } from '@/shared/types/EditShort.type';

const CATEGORIES = ['Education', 'Comedy', 'Music', 'Gaming', 'News', 'Sports', 'Tech', 'Other'];
const VISIBILITY_OPTIONS = ['public', 'private', 'unlisted'] as const;

export const useEditShort = (shortId: string) => {
  const [shortDetail, setShortDetail] = useState<ShortDetail | null>(null);
  const [formData, setFormData] = useState<EditShortFormData>({
    title: '',
    description: '',
    hashtags: [],
    category: 'Education',
    visibility: 'public',
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchShort = async () => {
      try {
        setLoading(true);
        const response = await getShortById(shortId);
        const short = response.data.short;
        setShortDetail(short);
        setFormData({
          title: short.title,
          description: short.description,
          hashtags: short.hashtags,
          category: short.category,
          visibility: short.visibility,
        });
      } catch (error) {
        console.error('Failed to fetch short:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShort();
  }, [shortId]);

  const updateField = useCallback(
    (field: keyof EditShortFormData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    },
    []
  );

  const addHashtag = useCallback((hashtag: string) => {
    const clean = hashtag.trim().replace(/^#/, '');
    if (!clean) return;
    setFormData(prev => ({
      ...prev,
      hashtags: [...prev.hashtags, `#${clean}`],
    }));
  }, []);

  const removeHashtag = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter((_, i) => i !== index),
    }));
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
    try {
      setUploading(true);
      const response = await editShort(formData, shortId);
      setShortDetail(response.data.short);
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      setUploading(false);
    }
  }, [formData, validate, shortId]);

  return {
    shortDetail,
    formData,
    loading,
    uploading,
    errors,
    updateField,
    addHashtag,
    removeHashtag,
    submitEdit,
    CATEGORIES,
    VISIBILITY_OPTIONS,
  };
};