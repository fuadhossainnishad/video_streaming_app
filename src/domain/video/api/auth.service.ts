// domain/auth/api/auth.service.ts
import { axiosClient } from '@/shared/config/axios.config';
import { SIGN_UP, SOCIAL_LOGIN } from '@/shared/constants/api.constants';
import {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  User,
  AuthTokens,
} from '@/shared/types/auth.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      return { isAuthenticated: true, user };
    }

    return { isAuthenticated: false, user: null };
  } catch (error) {
    console.error('Error initializing auth:', error);
    return { isAuthenticated: false, user: null };
  }
};