import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const baseUrl = 'https://api.pg-65.com/api/';

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
  type: 'increase' | 'decrease';
  content: string;
}

interface DeleteLifeSuggestionResponse {
  success: boolean;
  message: string;
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

const allApi = createApi({
  reducerPath: 'allApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Retrieve token from cookies
      const token = Cookies.get('Ihamrickadmindashboardtoken');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (email) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: email,
      }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: ({ email, otp }) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: { email, otp },
      }),
    }),
    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: ({ email }) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: ({ email, newPassword, confirmPassword, otp }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { email, newPassword, confirmPassword, otp },
      }),
    }),

    getBlogs: builder.query<BlogResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/blog?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
    }),
    // Life Suggestions API Endpoints
    createLifeSuggestion: builder.mutation<LifeSuggestion, CreateLifeSuggestionRequest>({
      query: (newLifeSuggestion) => ({
        url: '/life-suggestions/create',
        method: 'POST',
        body: newLifeSuggestion,
      }),
    }),
    getLifeSuggestions: builder.query<LifeSuggestionsResponse, void>({
      query: () => ({
        url: '/life-suggestions/',
        method: 'GET',
      }),
    }),
    deleteLifeSuggestion: builder.mutation<DeleteLifeSuggestionResponse, string>({
      query: (suggestionId) => ({
        url: `/life-suggestions/${suggestionId}`,
        method: 'DELETE',
      }),
    }),
    deleteBlog: builder.mutation<BlogResponse, string>({
      query: (blogId) => ({
        url: `/blog/delete/${blogId}`,
        method: 'DELETE',
      }),
    }),
    updateBlog: builder.mutation<BlogUpdateResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/blog/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    sentNotifications: builder.mutation<SendNotifications, void>({
      query: () => ({
        url: '/notifications/send-notifications',
        method: 'POST',
      }),
    }),
    // Get all social links
    getSocialLinks: builder.query<SocialLinkResponse, void>({
      query: () => ({
        url: '/social-links',
        method: 'GET',
      }),
    }),

    // Update a social link by ID
    updateSocialLink: builder.mutation<
      UpdateSocialLinkResponse,
      { id: string; data: UpdateSocialLinkRequest }
    >({
      query: ({ id, data }) => ({
        url: `/social-links/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getAboutUs: builder.query<any, void>({
      query: () => ({
        url: 'website-content/about-us',
        method: 'GET',
      }),
    }),
    updateAboutUs: builder.mutation<void, { content: string }>({
      query: ({ content }) => ({
        url: 'website-content/about-us',
        method: 'PATCH',
        body: content,
      }),
    }),
    getPrivacyPolicy: builder.query<any, void>({
      query: () => ({
        url: 'website-content/privacy-policy',
        method: 'GET',
      }),
    }),
    // Mutation for updating the 'Privacy Policy' content
    updatePrivacyPolicy: builder.mutation<void, { content: string }>({
      query: ({ content }) => ({
        url: 'website-content/privacy-policy',
        method: 'PATCH',
        body: content,
      }),
    }),

    // New query to get the current authenticated user
    getCurrentUser: builder.query<MeResponse, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
    }),
    updateProfile: builder.mutation({
      query: (formData: FormData) => {
        return {
          url: '/auth/update-profile',
          method: 'PATCH',
          body: formData,
        };
      },
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: ({ oldPassword, newPassword }) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: { oldPassword, newPassword },
      }),
    }),
    createBlog: builder.mutation<void, { data: FormData }>({
      query: ({ data }) => {
        return {
          url: '/blog/create-blog', // Adjust this URL to your endpoint
          method: 'POST',
          body: data,
        };
      },
    }),

    // upload video
    uploadVideo: builder.mutation<{ success: boolean; message: string; data: Video }, FormData>({
      query: (formData) => ({
        url: '/videos/upload',
        method: 'POST',
        body: formData,
        timeout: 600000,
      }),
    }),

    // update video by id
    updateVideo: builder.mutation<
      { success: boolean; message: string; data: Video },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/videos/update/${id}`,
        method: 'PUT',
        body: data,
        timeout: 600000,
      }),
    }),

    //  get videos
    getVideos: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/videos?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
    }),

    // get single video by id
    getVideoById: builder.query<Video, string>({
      query: (videoId) => ({
        url: `/videos/${videoId}`,
        method: 'GET',
      }),
    }),

    // delete video
    deleteVideo: builder.mutation<{ success: boolean; message: string; data: Video }, string>({
      query: (videoId) => ({
        url: `/videos/delete/${videoId}`,
        method: 'DELETE',
      }),
    }),

    // create Podcast
    createPodcast: builder.mutation<void, FormData>({
      query: (data) => {
        return {
          url: '/podcasts',
          method: 'POST',
          body: data,
        };
      },
    }),

    // get Podcasts
    getPodcasts: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/podcasts?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
    }),

    // update Podcast by id
    updatePodcast: builder.mutation<
      { success: boolean; message: string; data: Podcast },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/podcasts/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),

    // start Podcast live
    startPodcast: builder.mutation<{ success: boolean; message: string; data: Podcast }, string>({
      query: (podcastId) => ({
        url: `/podcasts/start/${podcastId}`,
        method: 'POST',
      }),
    }),

    // end Podcast live
    endPodcast: builder.mutation<{ success: boolean; message: string; data: Podcast }, string>({
      query: (podcastId) => ({
        url: `/podcasts/end/${podcastId}`,
        method: 'POST',
      }),
    }),

    // delete Podcast
    deletePodcast: builder.mutation<{ success: boolean; message: string; data: Podcast }, string>({
      query: (podcastId) => ({
        url: `/podcasts/${podcastId}`,
        method: 'DELETE',
      }),
    }),

    // get publications
    getPublications: builder.query<PublicationResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/publications?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
    }),

    // create publication
    createPublication: builder.mutation<void, FormData>({
      query: (data) => {
        return {
          url: '/publications/create',
          method: 'POST',
          body: data,
        };
      },
    }),

    // update publication by id
    updatePublication: builder.mutation<
      { success: boolean; message: string; data: Publication },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/publications/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // delete publication
    deletePublication: builder.mutation<
      { success: boolean; message: string; data: Publication },
      string
    >({
      query: (publicationId) => ({
        url: `/publications/delete/${publicationId}`,
        method: 'DELETE',
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
  useUploadVideoMutation,
  useDeleteVideoMutation,
  useGetVideoByIdQuery,
  useUpdateVideoMutation,
  useCreatePodcastMutation,
  useDeletePodcastMutation,
  useUpdatePodcastMutation,
  useCreatePublicationMutation,
  useUpdatePublicationMutation,
  useDeletePublicationMutation,
  useStartPodcastMutation,
  useEndPodcastMutation,
  useGetAboutUsQuery,
  useGetPrivacyPolicyQuery,
} = allApi;

export default allApi;
