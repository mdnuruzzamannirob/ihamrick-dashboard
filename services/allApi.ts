import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL (you can change this if needed)
const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.10.20.73:5005/api/";

// Define the API types and response structures
interface LoginRequest {
  email: string;
  password: string;
}

interface UserData {
  _id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    userData: UserData;
  };
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: { token: string };
}

interface ResendOtpRequest {
  email: string;
}

interface ResendOtpResponse {
  success: boolean;
  message: string;
}

interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
  otp: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

const allApi = createApi({
  reducerPath: "allApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.10.20.73:5005/api/",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: ({ email, otp }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),
    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: ({ email }) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: { email },
      }),
    }),
    // Add the new resetPassword mutation
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: ({ email, newPassword, confirmPassword, otp }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { email, newPassword, confirmPassword, otp },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation, // Export the new hook for `resetPassword`
} = allApi;

export default allApi;
