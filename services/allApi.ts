import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
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

interface Video {
  _id: string;
  title: string;
  description: string;
  transcription: string;
  videoUrl: string;
  signedUrl: string;
  thumbnailUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  duration: number;
  uploadDate: string;
  status: boolean;
  views: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isNotified: boolean;
  formattedFileSize: string;
}

interface Podcast {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  transcription: string;
  date: string;
  status: string;
  admin: {
    _id: string;
    email: string;
  };
  currentListeners: number;
  peakListeners: number;
  totalListeners: number;
  audioFormat: string;
  isRecording: boolean;
  podcastListeners: Array<{
    joinedAt: string;
    sessionId: string;
    leftAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  actualStart: string;
  liveSessionId: string;
  actualEnd: string;
  duration: number;
  activeListeners: number;
  streamConfig: {
    channelId: string;
    sessionId: string | null;
    socketNamespace: string;
    socketEndpoint: string;
    playbackMethod: string;
    playbackUrl: string | null;
    recordingBucket: string;
    roomId: string;
  };
}

interface Publication {
  _id: string;
  title: string;
  author: string;
  publicationDate: string;
  fileType: string;
  status: boolean;
  description: string;
  coverImage: string;
  file: string;
  createdAt: string;
  updatedAt: string;
}

interface Blog {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

// Define API Response Types
interface VideoResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number | null;
  };
  data: Video[];
}

interface PodcastResponse {
  success: boolean;
  message: string;
  results: number;
  data: { podcasts: Podcast[] };
}

interface PublicationResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number | null;
  };
  data: Publication[];
}

interface BlogResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number | null;
  };
  data: Blog[];
}

// Life Suggestion related types
interface LifeSuggestion {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface LifeSuggestionsResponse {
  success: boolean;
  message: string;
  data: {
    increase: LifeSuggestion[];
    decrease: LifeSuggestion[];
  };
}

interface CreateLifeSuggestionRequest {
  type: "increase" | "decrease";
  content: string;
}

interface DeleteLifeSuggestionResponse {
  success: boolean;
  message: string;
}

const allApi = createApi({
  reducerPath: "allApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.10.20.73:5005/api/",
    prepareHeaders: (headers) => {
      // Retrieve token from cookies
      const token = Cookies.get("Ihamrickadmindashboardtoken");

      // If the token is present, add it to the Authorization header
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
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
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: ({ email, newPassword, confirmPassword, otp }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { email, newPassword, confirmPassword, otp },
      }),
    }),

    getVideos: builder.query<VideoResponse, void>({
      query: () => ({
        url: "/videos",
        method: "GET",
      }),
    }),
    getPodcasts: builder.query<PodcastResponse, void>({
      query: () => ({
        url: "/podcasts",
        method: "GET",
      }),
    }),
    getPublications: builder.query<PublicationResponse, void>({
      query: () => ({
        url: "/publications",
        method: "GET",
      }),
    }),
    getBlogs: builder.query<BlogResponse, void>({
      query: () => ({
        url: "/blog",
        method: "GET",
      }),
    }),
    // Life Suggestions API Endpoints
    createLifeSuggestion: builder.mutation<
      LifeSuggestion,
      CreateLifeSuggestionRequest
    >({
      query: (newLifeSuggestion) => ({
        url: "/life-suggestions/create",
        method: "POST",
        body: newLifeSuggestion,
      }),
    }),
    getLifeSuggestions: builder.query<LifeSuggestionsResponse, void>({
      query: () => ({
        url: "/life-suggestions/",
        method: "GET",
      }),
    }),
    deleteLifeSuggestion: builder.mutation<
      DeleteLifeSuggestionResponse,
      string
    >({
      query: (suggestionId) => ({
        url: `/life-suggestions/${suggestionId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useGetVideosQuery,
  useGetPodcastsQuery,
  useGetPublicationsQuery,
  useGetBlogsQuery,
  useCreateLifeSuggestionMutation,
  useGetLifeSuggestionsQuery,
  useDeleteLifeSuggestionMutation,
} = allApi;

export default allApi;
