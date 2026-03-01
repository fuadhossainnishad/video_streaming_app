import {
    checkSaveStatus,
    saveContent,
    unsaveContent,
} from "@/domain/video/api/save.service";
import { useCallback, useEffect, useState } from "react";

export const useSave = (contentId: string, contentType: string) => {
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    // 🔹 Initial check
    useEffect(() => {
        if (!contentId) {
            setChecking(false);
            return;
        }

        const fetchStatus = async () => {
            try {
                setChecking(true);
                const saved = await checkSaveStatus(contentId);
                setIsSaved(saved);
            } catch (error) {
                console.log("Failed to check save status");
            } finally {
                setChecking(false);
            }
        };

        fetchStatus();
    }, [contentId]);

    // 🔹 Real toggle
    const toggleSave = useCallback(async () => {
        if (!contentId || loading) return;

        const previousState = isSaved;

        // Optimistic update
        setIsSaved(!previousState);
        setLoading(true);

        try {
            if (!previousState) {
                // Was not saved → Save it
                const result = await saveContent(contentType, contentId);
                setIsSaved(result);
            } else {
                // Was saved → Unsave it
                const result = await unsaveContent(contentId);
                setIsSaved(result);
            }
        } catch (error) {
            // Rollback on failure
            setIsSaved(previousState);
            console.log("Toggle save failed");
        } finally {
            setLoading(false);
        }
    }, [contentId, isSaved, loading, contentType]);

    return {
        isSaved,
        loading,
        checking,
        toggleSave,
    };
};