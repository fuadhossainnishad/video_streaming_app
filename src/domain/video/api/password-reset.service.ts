// domain/auth/api/password-reset.service.ts
import { axiosClient } from '@/shared/config/axios.config';
import { FORGOT_PASSWORD, RESEND_OTP, REST_PASSWORD, VERIFY_EMAIL, VERIFY_RESET_EMAIL } from '@/shared/constants/api.constants';
import { ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse, VerifyOtpRequest, VerifyOtpResponse, VerifySignupOtpRequest, VerifySignupOtpResponse } from '@/shared/types/password-reset.types';


/**
 * Send OTP to email for password reset
 */
export const sendPasswordResetOtp = async (
    data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
    try {
        const response = await axiosClient.post<ForgotPasswordResponse>(
            FORGOT_PASSWORD,
            {
                email: data.email,
            }
        );
        console.log("signup response:", response)
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to send OTP');
        }

        return response.data;
    } catch (error: any) {
        console.error('Error sending reset OTP:', error);
        throw {
            message: error.message || 'Failed to send OTP',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Verify OTP for password reset
 */
export const verifyPasswordResetOtp = async (
    data: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
    try {
        const response = await axiosClient.post<VerifyOtpResponse>(
            VERIFY_RESET_EMAIL,
            {
                email: data.email,
                otp: data.otp,
            }
        );
        console.log("signup response:", response)
        if (!response.data.success) {
            throw new Error(response.data.message || 'Invalid OTP');
        }

        return response.data;
    } catch (error: any) {
        console.error('Error verifying OTP:', error);
        throw {
            message: error.message || 'Invalid OTP',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Reset password with OTP
 */
export const resetPassword = async (
    data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
    try {
        const response = await axiosClient.post<ResetPasswordResponse>(
            REST_PASSWORD,
            {
                email: data.email,
                otp: data.otp,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            }
        );
        console.log("signup response:", response)
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to reset password');
        }

        return response.data;
    } catch (error: any) {
        console.error('Error resetting password:', error);
        throw {
            message: error.message || 'Failed to reset password',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Verify OTP for signup email verification
 */
export const verifySignupOtp = async (
    data: VerifySignupOtpRequest
): Promise<VerifySignupOtpResponse> => {
    try {
        const response = await axiosClient.post<VerifySignupOtpResponse>(
            VERIFY_EMAIL,
            {
                email: data.email,
                otp: data.otp,
            }
        );
        console.log("signup response:", response)
        // if (!response.data.success) {
        //     throw new Error(response.data.message || 'Invalid OTP');
        // }

        return response.data;
    } catch (error: any) {
        const backendMessage =
            error.response?.data?.message ||
            error.message ||
            'OTP verification failed';

        console.error('Error verifying signup OTP:', backendMessage);
        throw { message: backendMessage, statusCode: error.response?.status || 500 };
    }

};

/**
 * Resend OTP for email verification (signup)
 * POST /user/resend-email-otp
 * Body: { email }
 */
export const resendSignupOtp = async (
    email: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await axiosClient.post(RESEND_OTP, { email });
        console.log("signup response:", response)
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to resend OTP');
        }

        return {
            success: response.data.success,
            message: response.data.message || 'OTP resent successfully',
        };
    } catch (error: any) {
        console.error('Error resending signup OTP:', error);
        throw {
            message: error.message || 'Failed to resend OTP',
            statusCode: error.statusCode || 500,
        };
    }
};

/**
 * Resend OTP for password reset
 * POST /user/resend-reset-otp
 * Body: { email }
 */
export const resendResetOtp = async (
    email: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await axiosClient.post(RESEND_OTP, { email });
        console.log("signup response:", response)
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to resend OTP');
        }
        console.log("signup response:", response)
        return {
            success: response.data.success,
            message: response.data.message || 'OTP resent successfully',
        };
    } catch (error: any) {
        console.error('Error resending reset OTP:', error);
        throw {
            message: error.message || 'Failed to resend OTP',
            statusCode: error.statusCode || 500,
        };
    }
};