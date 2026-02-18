// shared/hooks/usePasswordChange.ts
import { useState, useCallback } from 'react';
import { ChangePasswordRequest } from '../types/password-reset.types';
import { changePassword } from '@/domain/video/api/auth.service';

export const usePasswordChange = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const change = useCallback(async (data: ChangePasswordRequest) => {
        try {
            setLoading(true);
            setError(null);

            const response = await changePassword(data);

            return { success: true, message: response.message };
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to change password';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        changePassword: change,
        clearError: () => setError(null),
    };
};