// shared/hooks/useAccountDeletion.ts
import { deleteAccount } from '@/domain/video/api/auth.service';
import { useState, useCallback } from 'react';

export const useAccountDeletion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUserAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await deleteAccount();

      return { 
        success: true, 
        message: response.message || 'Account deleted successfully' 
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete account';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    deleteAccount: deleteUserAccount,
    clearError: () => setError(null),
  };
};