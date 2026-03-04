// domain/video/api/comment.service.ts
import { axiosClient } from '@/shared/config/axios.config';
import { REGISTER_FCM, UNREGISTER_FCM } from '@/shared/constants/api.constants';
import { mockCommentsResponse } from '@/shared/mock/comments.mock';
import { mockNotificationsResponse } from '@/shared/mock/notifications.mock';
import { CommentUI } from '@/shared/types/comments.type';
import { transformCommentsData } from '@/shared/utils/comments.utils';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { getUniqueId } from 'react-native-device-info';

export interface GetCommentsResult {
    comments: CommentUI[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

/**
 * Fetch comments for a video
 * @param videoId - Video ID
 * @param page - Page number
 * @param limit - Comments per page
 * @returns Promise with comments data
 */
export const getVideoComments = async (
    videoId: string,
    page: number = 1,
    limit: number = 10
): Promise<GetCommentsResult> => {
    try {
        // const { data } = await axiosClient.get<ApiCommentsResponse>(
        //     `/video/${videoId}/comments`,
        //     {
        //         params: { page, limit },
        //     }
        // );

        const data = mockCommentsResponse

        if (data.status !== 'success' || !data.data.comments) {
            throw new Error('Invalid response format');
        }

        const transformedComments = transformCommentsData(data.data.comments);

        return {
            comments: transformedComments,
            pagination: data.data.pagination,
        };
    } catch (error: any) {
        console.error('Error fetching comments:', error);
        throw {
            message: error.message || 'Failed to fetch comments',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Fetch replies for a comment
 * @param commentId - Comment ID
 * @param page - Page number
 * @param limit - Replies per page
 * @returns Promise with replies data
 */
export const getNotifications = async () => {
    try {
        // const { data } = await axiosClient.get<ApiRepliesResponse>(
        //     `/comment/${commentId}/replies`,
        //     {
        //         params: { page, limit },
        //     }
        // );
        const data = mockNotificationsResponse
        if (data.status !== 'success' || !data.data.notifications) {
            throw new Error('Invalid response format');
        }

        const transformedReplies = transformCommentsData(data.replies);

        return {
            notifications: transformedReplies,
        };
    } catch (error: any) {
        console.error('Error fetching replies:', error);
        throw {
            message: error.message || 'Failed to fetch replies',
            statusCode: error.statusCode || 500,
        };
    }
};


// push notification

// export const requestNotificationPermissions = async () => {
//     const authStatus = await messaging().requestPermission();
//     return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
// };

export const requestNotificationPermissions = async () => {
    const authStatus = await messaging().requestPermission();

    return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
};

// export const getNotificationToken = async () => {
//     const token = await messaging().getToken();
//     console.log("FCM TOKEN:", token);
//     return token;
// };
export const getFcmToken = async (): Promise<string | null> => {
    try {
        const token = await messaging().getToken();
        console.log("FCM TOKEN:", token);
        return token
    } catch (error) {
        console.error('Error getting FCM token', error);
        return null;
    }
};

export const setupNotificationHandlers = (navigation) => {
    // Handle foreground notifications
    messaging().onMessage(async remoteMessage => {
        console.log('Notification:', remoteMessage);
        // Show local notification
    });

    // Handle notification tap
    messaging().onNotificationOpenedApp(remoteMessage => {
        // Navigate to screen
        navigation.navigate('VideoPlayer', {
            videoId: remoteMessage.data?.videoId
        });
    });
};

export const registerTokenToServer = async (
    token: string,
    deviceId: string,
    deviceType: 'android' | 'ios'
) => {
    return axiosClient.post(REGISTER_FCM, {
        fcmToken: token,
        deviceType,
        deviceId,
    });
};

export const unregisterTokenFromServer = async (deviceId: string) => {
    return axiosClient.post(UNREGISTER_FCM, {
        deviceId,
    });
};

export const syncFcmToken = async () => {
    try {
        const permited = await requestNotificationPermissions()
        if (!permited) return;
        const token = await getFcmToken();
        if (!token) return;

        const deviceId = await getUniqueId();

        await registerTokenToServer(
            token,
            deviceId!,
            Platform.OS as 'android' | 'ios',
        );

        // 🔥 Handle refresh automatically
        messaging().onTokenRefresh(async (newToken) => {
            await registerTokenToServer(
                newToken,
                deviceId,
                Platform.OS as 'android' | 'ios',
            );
        });
    } catch (error) {
        console.log('FCM Sync Error:', error);
    }

}

/**
 * Get single notification
 */
export const getNotificationById = async (id: string) => {
  const { data } = await axiosClient.get(
    `/api/v1/notifications/${id}`,
  );

  return data.data;
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (id: string) => {
  return axiosClient.patch(
    `/api/v1/notifications/${id}/read`,
  );
};

/**
 * Mark all as read
 */
export const markAllNotificationsAsRead = async () => {
  return axiosClient.patch(
    '/api/v1/notifications/read-all',
  );
};

/**
 * Get unread count
 */
export const getUnreadCount = async (): Promise<number> => {
  const { data } = await axiosClient.get(
    '/api/v1/notifications/unread-count',
  );

  return data.data.count;
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async () => {
  return axiosClient.delete(
    '/api/v1/notifications/clear-all',
  );
};