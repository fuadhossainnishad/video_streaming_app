// presentation/videos/hooks/useCommentPreview.ts
import { useState, useEffect, useCallback } from 'react';
import { CommentUI } from '../types/comments.type';
import { getVideoComments } from '@/domain/video/api/comments.service';

interface UseCommentPreviewProps {
    videoId: string;
    previewCount?: number;
}

export const useCommentPreview = ({
    videoId,
    previewCount = 2,
}: UseCommentPreviewProps) => {
    const [comments, setComments] = useState<CommentUI[]>([]);
    const [totalComments, setTotalComments] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchCommentPreview = useCallback(async () => {
        if (!videoId) return;

        try {
            setLoading(true);
            const result = await getVideoComments(videoId, 1, previewCount);
            setComments(result.comments);
            setTotalComments(result.pagination.total);
        } catch (error) {
            console.error('Error fetching comment preview:', error);
            setComments([]);
            setTotalComments(0);
        } finally {
            setLoading(false);
        }
    }, [videoId, previewCount]);

    useEffect(() => {
        fetchCommentPreview();
    }, [fetchCommentPreview]);

    const refreshComments = useCallback(() => {
        fetchCommentPreview();
    }, [fetchCommentPreview]);

    return {
        comments,
        totalComments,
        loading,
        refreshComments,
    };
};