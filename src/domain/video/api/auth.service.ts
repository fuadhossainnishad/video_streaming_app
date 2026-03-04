// domain/auth/api/auth.service.ts
import { axiosClient } from '@/shared/config/axios.config';
import { CHANGE_PASSWORD, DELETE_ACCOUNT, SIGN_UP, SOCIAL_LOGIN } from '@/shared/constants/api.constants';
import {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  User,
  AuthTokens,
  ChangePasswordRequest,
  DeleteAccountResponse,
} from '@/shared/types/auth.types';
import { ChangePasswordResponse } from '@/shared/types/password-reset.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncFcmToken, unregisterTokenFromServer } from './notifications.service';
import { getUniqueId } from 'react-native-device-info';
import { SocialAuthPayload } from '@/shared/lib/socialAuth';

const TOKEN_KEY = '@auth_tokens';
const USER_KEY = '@user_data';

/**
 * Sign up a new user
 */
export const signupUser = async (data: SignupRequest): Promise<AuthResponse> => {
  try {
    console.log("signup api:", SIGN_UP)

    const response = await axiosClient.post<AuthResponse>(SIGN_UP, {
      username: data.username,
      email: data.email,
      password: data.password,
    });

    if (response.data.status !== 'success') {
      throw new Error('Signup failed');
    }
    console.log("signup api:", SIGN_UP)

    console.log("signup response:", response.data)


    // Save tokens and user data
    await saveAuthData(response.data);

    return response.data;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw {
      message: error.message || 'Signup failed',
      statusCode: error.statusCode || 500,
    };
  }
};

/**
 * Login user
 */
export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await axiosClient.post<AuthResponse>(SOCIAL_LOGIN, {
      email: data.email,
      name: data.password,
      photo: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    });
    console.log("signup response:", response.data)

    if (response.data.status !== 'success') {
      throw new Error('Login failed');
    }

    // Save tokens and user data
    await saveAuthData(response.data);
    await syncFcmToken()

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw {
      message: error.message || 'Login failed',
      statusCode: error.statusCode || 500,
    };
  }
};

/**
 * Change password
 * POST /user/change-password
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  try {
    const response = await axiosClient.post<ChangePasswordResponse>(CHANGE_PASSWORD, {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });

    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to change password');
    }

    return response.data;
  } catch (error: any) {
    console.error('Change password error:', error);
    throw {
      message: error.message || 'Failed to change password',
      statusCode: error.statusCode || 500,
    };
  }
};

/**
 * Save auth data to AsyncStorage
 */
const saveAuthData = async (authResponse: AuthResponse): Promise<void> => {
  try {
    const tokens: AuthTokens = {
      accessToken: authResponse.access_token,
      refreshToken: authResponse.refresh_token,
    };

    const user: User = {
      id: authResponse.data._id,
      username: authResponse.data.username,
      email: authResponse.data.email,
    };

    await AsyncStorage.multiSet([
      [TOKEN_KEY, JSON.stringify(tokens)],
      [USER_KEY, JSON.stringify(user)],
    ]);
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw error;
  }
};

/**
 * Get stored tokens
 */
export const getStoredTokens = async (): Promise<AuthTokens | null> => {
  try {
    const tokensJson = await AsyncStorage.getItem(TOKEN_KEY);
    if (!tokensJson) return null;

    return JSON.parse(tokensJson);
  } catch (error) {
    console.error('Error getting tokens:', error);
    return null;
  }
};

/**
 * Get stored user data
 */
export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    if (!userJson) return null;

    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Logout user (clear storage)
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await unregisterTokenFromServer(await getUniqueId());
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const tokens = await getStoredTokens();
  return tokens !== null && tokens.accessToken !== '';
};

/**
 * Initialize auth state (call on app start)
 */
export const initializeAuth = async (): Promise<{
  isAuthenticated: boolean;
  user: User | null;
}> => {
  try {
    const tokens = await getStoredTokens();
    const user = await getStoredUser();

    if (tokens && user) {
      await syncFcmToken();
      return { isAuthenticated: true, user };
    }

    return { isAuthenticated: false, user: null };
  } catch (error) {
    console.error('Error initializing auth:', error);
    return { isAuthenticated: false, user: null };
  }
};

/**
 * Delete user account
 * DELETE /user/delete-user
 */
export const deleteAccount = async (): Promise<DeleteAccountResponse> => {
  try {
    const response = await axiosClient.delete<DeleteAccountResponse>(DELETE_ACCOUNT);

    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to delete account');
    }

    // Clear all local data after successful deletion
    await clearAllUserData();

    return response.data;
  } catch (error: any) {
    console.error('Delete account error:', error);
    throw {
      message: error.message || 'Failed to delete account',
      statusCode: error.statusCode || 500,
    };
  }
};

/**
 * Clear all user data from AsyncStorage
 */
const clearAllUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      '@auth_tokens',
      '@user_data',
      '@signup_email',
      '@reset_email',
      '@reset_otp',
    ]);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

export interface SocialLoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    photo: string;
  };
}
export const socialLogin = async (data: SocialAuthPayload): Promise<AuthResponse> => {
  try {
    const response = await axiosClient.post<AuthResponse>(SOCIAL_LOGIN, {
      email: data.email,
      name: data.name,
      photo: data.photo
    });
    console.log("signup response:", response.data)

    if (response.data.status !== 'success') {
      throw new Error('Login failed');
    }

    // Save tokens and user data
    await saveAuthData(response.data);
    await syncFcmToken()

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw {
      message: error.message || 'Login failed',
      statusCode: error.statusCode || 500,
    };
  }
};
