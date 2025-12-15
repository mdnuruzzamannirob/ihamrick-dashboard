import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
// Define the base URL (you can change this if needed)
const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.pg-65.com//api/";

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
  status: boolean;
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

interface BlogDeleteResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    title: string;
    status: boolean;
    description: string;
    isNotified: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    coverImage: string;
  };
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
interface BlogUpdateRequest {
  title: string;
  description: string;
  coverImage: string;
  status: boolean;
}
interface BlogUpdateResponse {
  success: boolean;
  message: string;
  data: Blog;
}

interface SendNotifications {
  success: boolean;
  message: string;
  data?: {
    subscribersNotified: number;
    contentCounts: {
      blogs: number;
      publications: number;
      videos: number;
      podcasts: number;
      lifeSuggestions: number;
    };
    livePodcasts: number;
    emailsSent: number;
    emailsFailed: number;
  };
  errorSources?: {
    type: string;
    details: string;
  }[];
  err?: {
    statusCode: number;
    stack?: string;
  };
}

// Define the API response types for social links
interface SocialLink {
  _id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
interface content {
  content: string;
}

interface SocialLinkResponse {
  success: boolean;
  message: string;
  data: SocialLink[];
}

interface UpdateSocialLinkRequest {
  name: string;
  url: string;
}

interface UpdateSocialLinkResponse {
  success: boolean;
  message: string;
  data: SocialLink;
}
interface updateAboutUsRequest {
  content: content;
}

interface User {
  _id: string;
  email: string;
  role: string;
  location: string;
  phoneNumber: string;
  userName: string;
  profilePicture: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MeResponse {
  success: boolean;
  message: string;
  data: User;
}

// Define the API types and response structures
interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

interface UpdateProfileRequest {
  userName: string;
  email: string;
  phoneNumber: string;
  location: string;
  profilePicture: File | null;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: User; // Assuming the response contains user data
}
interface CreateBlogRequest {
  title: string;
  status: boolean;
  description: string;
  coverImage: File | null;
}

interface CreateBlogResponse {
  success: boolean;
  message: string;
  data: Blog;
}

const allApi = createApi({
  reducerPath: "allApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.10.20.73:5005/api/",
    prepareHeaders: (headers) => {
      // Retrieve token from cookies
      const token = Cookies.get("Ihamrickadmindashboardtoken");

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

    getVideos: builder.query<void, void>({
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
    deleteBlog: builder.mutation<BlogResponse, string>({
      query: (blogId) => ({
        url: `/blog/delete/${blogId}`,
        method: "DELETE",
      }),
    }),
    updateBlog: builder.mutation<
      BlogUpdateResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/blog/update/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    sentNotifications: builder.mutation<SendNotifications, void>({
      query: () => ({
        url: "/notifications/send-notifications",
        method: "POST",
      }),
    }),
    // Get all social links
    getSocialLinks: builder.query<SocialLinkResponse, void>({
      query: () => ({
        url: "/social-links",
        method: "GET",
      }),
    }),

    // Update a social link by ID
    updateSocialLink: builder.mutation<
      UpdateSocialLinkResponse,
      { id: string; data: UpdateSocialLinkRequest }
    >({
      query: ({ id, data }) => ({
        url: `/social-links/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    updateAboutUs: builder.mutation<void, { content: content }>({
      query: ({ content }) => ({
        url: "website-content/about-us",
        method: "PATCH",
        body: content,
      }),
    }),
    // Mutation for updating the 'Privacy Policy' content
    updatePrivacyPolicy: builder.mutation<void, { content: content }>({
      query: ({ content }) => ({
        url: "website-content/privacy-policy",
        method: "PATCH",
        body: content,
      }),
    }),

    // New query to get the current authenticated user
    getCurrentUser: builder.query<MeResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: (formData: FormData) => {
        return {
          url: "/auth/update-profile",
          method: "PATCH",
          body: formData,
        };
      },
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: ({ oldPassword, newPassword }) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: { oldPassword, newPassword },
      }),
    }),
    createBlog: builder.mutation<void, { data: FormData }>({
      query: ({ data }) => {
        return {
          url: "/blog/create-blog", // Adjust this URL to your endpoint
          method: "POST",
          body: data,
        };
      },
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
  useDeleteBlogMutation,
  useLogoutMutation,
  useUpdateBlogMutation,
  useSentNotificationsMutation,
  useGetSocialLinksQuery,
  useUpdateSocialLinkMutation,
  useUpdateAboutUsMutation,
  useUpdatePrivacyPolicyMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useCreateBlogMutation,
} = allApi;

export default allApi;
