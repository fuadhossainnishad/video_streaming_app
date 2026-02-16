// shared/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import {
    signupUser,
    loginUser,
    logoutUser as logoutService,
    getStoredUser,
} from '@/domain/video/api/auth.service';
import { SignupRequest, LoginRequest, User } from '@/shared/types/auth.types';
import { useAuth as useAuthContext } from '@/context/AuthProvider';

export const useAuth = () => {
    const { setIsAuthenticated } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // Signup
    const signup = useCallback(async (data: SignupRequest) => {
        try {
            setLoading(true);
            setError(null);

            const response = await signupUser(data);

            setUser({
                id: response.data._id,
                username: response.data.username,
                email: response.data.email,
            });

            return { success: true, data: response };
        } catch (err: any) {
            const errorMessage = err.message || 'Signup failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    // Login
    const login = useCallback(async (data: LoginRequest) => {
        try {
            setLoading(true);
            setError(null);

            const response = await loginUser(data);

            setUser({
                id: response.data._id,
                username: response.data.username,
                email: response.data.email,
            });

            setIsAuthenticated(true);

            return { success: true, data: response };
        } catch (err: any) {
            const errorMessage = err.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [setIsAuthenticated]);

    // Logout
    const logout = useCallback(async () => {
        try {
            setLoading(true);
            await logoutService();
            setUser(null);
            setIsAuthenticated(false);
            return { success: true };
        } catch (err: any) {
            const errorMessage = err.message || 'Logout failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [setIsAuthenticated]);

    // Load user from storage
    const loadUser = useCallback(async () => {
        try {
            const storedUser = await getStoredUser();
            if (storedUser) {
                setUser(storedUser);
                setIsAuthenticated(true);
            }
        } catch (err) {
            console.error('Error loading user:', err);
        }
    }, [setIsAuthenticated]);

    return {
        user,
        loading,
        error,
        signup,
        login,
        logout,
        loadUser,
        clearError: () => setError(null),
    };
};