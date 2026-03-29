// hooks/useVideoDuration.ts
import { useEffect, useRef, useState } from 'react';
import { useVideoPlayer } from 'expo-video';

const durationCache = new Map<string, number>();

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function useVideoDuration(uri: string): {
    duration: string | null;
    isLoading: boolean;
} {
    const [duration, setDuration] = useState<string | null>(() => {
        // initialiser runs once — safe to read cache here
        const hit = durationCache.get(uri);
        return hit != null ? formatDuration(hit) : null;
    });
    const [isLoading, setIsLoading] = useState(() => !durationCache.has(uri));

    const resolvedRef = useRef(false);

    const player = useVideoPlayer(uri, (p) => {
        p.muted = true;
        // intentionally no p.play() — metadata only
    });

    useEffect(() => {
        // Check cache INSIDE the effect — no leaked render variable
        if (durationCache.has(uri)) {
            const hit = durationCache.get(uri)!;
            setDuration(formatDuration(hit));
            setIsLoading(false);
            return;
        }

        resolvedRef.current = false;
        setIsLoading(true);

        // player is the stable object from useVideoPlayer — safe as dep.
        // We read player.duration inside the interval, not as a dep itself.
        const interval = setInterval(() => {
            const raw = player.duration;
            if (raw && isFinite(raw) && raw > 0 && !resolvedRef.current) {
                resolvedRef.current = true;
                durationCache.set(uri, raw);
                setDuration(formatDuration(raw));
                setIsLoading(false);
                clearInterval(interval);
            }
        }, 500);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            if (!resolvedRef.current) setIsLoading(false);
        }, 8000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [uri, player]);

    return { duration, isLoading };
}