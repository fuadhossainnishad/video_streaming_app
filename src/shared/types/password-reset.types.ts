// shared/types/password-reset.types.ts

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    verified: boolean;
  };
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifySignupOtpRequest {
  email: string;
  otp: string;
}

export interface VerifySignupOtpResponse {
  success: boolean;
  message: string;
  data?: {
    verified: boolean;
  };
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  status: 'success' | 'error';
  message: string;
  data?: any;
}