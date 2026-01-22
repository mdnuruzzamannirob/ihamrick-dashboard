'use client';

import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import Editor from '@/components/ui/editor';
import { toast } from 'react-toastify';
import {
  useGetMotivationQuery,
  useUpdateMotivationMutation,
  useGetMotivationForBlogQuery,
  useUpdateMotivationForBlogMutation,
  useGetMotivationForPublicationQuery,
  useUpdateMotivationForPublicationMutation,
  useGetMotivationForVideoQuery,
  useUpdateMotivationForVideoMutation,
  useGetMotivationForPodcastQuery,
  useUpdateMotivationForPodcastMutation,
} from '../../../../../services/allApi';

export default function MotivationPage() {
  // Default Motivation
  const { data: defaultData, isLoading: defaultLoading } = useGetMotivationQuery();
  const [updateDefault, { isLoading: savingDefault }] = useUpdateMotivationMutation();

  // Blog Motivation
  const { data: blogData, isLoading: blogLoading } = useGetMotivationForBlogQuery();
  const [updateBlog, { isLoading: savingBlog }] = useUpdateMotivationForBlogMutation();

  // Publication Motivation
  const { data: publicationData, isLoading: pubLoading } = useGetMotivationForPublicationQuery();
  const [updatePublication, { isLoading: savingPub }] = useUpdateMotivationForPublicationMutation();

  // Video Motivation
  const { data: videoData, isLoading: videoLoading } = useGetMotivationForVideoQuery();
  const [updateVideo, { isLoading: savingVideo }] = useUpdateMotivationForVideoMutation();

  // Podcast Motivation
  const { data: podcastData, isLoading: podcastLoading } = useGetMotivationForPodcastQuery();
  const [updatePodcast, { isLoading: savingPodcast }] = useUpdateMotivationForPodcastMutation();

  const handleSave = async (
    type: 'default' | 'blog' | 'publication' | 'video' | 'podcast',
    content: string,
  ) => {
    try {
      switch (type) {
        case 'default':
          await updateDefault({ content }).unwrap();
          toast.success('Motivation updated successfully');
          break;
        case 'blog':
          await updateBlog({ content }).unwrap();
          toast.success('Blog motivation updated successfully');
          break;
        case 'publication':
          await updatePublication({ content }).unwrap();
          toast.success('Publication motivation updated successfully');
          break;
        case 'video':
          await updateVideo({ content }).unwrap();
          toast.success('Video motivation updated successfully');
          break;
        case 'podcast':
          await updatePodcast({ content }).unwrap();
          toast.success('Podcast motivation updated successfully');
          break;
      }
    } catch {
      toast.error('Failed to update motivation');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 bg-gray-50 px-4 py-8 lg:ml-64 lg:px-8">
        <div className="mb-8 flex justify-end">
          <UserProfile />
        </div>

        <Editor
          title="Motivation"
          initialContent={defaultData?.data?.content || ''}
          onSave={(content) => handleSave('default', content)}
          isFetching={defaultLoading}
          isSaving={savingDefault}
        />

        <Editor
          title="Blog Motivation"
          initialContent={blogData?.data?.content || ''}
          onSave={(content) => handleSave('blog', content)}
          isFetching={blogLoading}
          isSaving={savingBlog}
        />

        <Editor
          title="Publication Motivation"
          initialContent={publicationData?.data?.content || ''}
          onSave={(content) => handleSave('publication', content)}
          isFetching={pubLoading}
          isSaving={savingPub}
        />

        <Editor
          title="Video Motivation"
          initialContent={videoData?.data?.content || ''}
          onSave={(content) => handleSave('video', content)}
          isFetching={videoLoading}
          isSaving={savingVideo}
        />

        <Editor
          title="Podcast Motivation"
          initialContent={podcastData?.data?.content || ''}
          onSave={(content) => handleSave('podcast', content)}
          isFetching={podcastLoading}
          isSaving={savingPodcast}
        />
      </div>
    </div>
  );
}
