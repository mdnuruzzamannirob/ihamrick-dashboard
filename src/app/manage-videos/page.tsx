'use client';
import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import { Trash2, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import VideoUploadModal from '@/components/modal/videoUploadModal';
import { toast } from 'react-toastify';
import { useDeleteVideoMutation, useGetVideosQuery } from '../../../services/allApi';
import { VideoViewModal } from '@/components/modal/videoViewModal';
import VideoEditModal from '@/components/modal/videoEditModal';

const ITEMS_PER_PAGE = 10;

export default function ManageVideos() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetVideosQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });

  const [deleteVideo, { isLoading: deleting }] = useDeleteVideoMutation();

  const videos = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
            page === i
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await deleteVideo(id).unwrap();
      toast.success('Video deleted successfully');
    } catch {
      toast.error('Failed to delete video');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 p-6 lg:ml-64">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-800">Manage Videos</h1>
          <UserProfile />
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-end">
          <VideoUploadModal />
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Duration</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      Loading videos...
                    </td>
                  </tr>
                ) : videos.length > 0 ? (
                  videos.map((video: any) => (
                    <tr key={video.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{video.title}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(video.uploadDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {video.duration || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs leading-5 font-semibold ${
                            video.status
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {video.status ? 'Published' : 'Unpublished'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <VideoEditModal video={video} />
                          <VideoViewModal video={video} />
                          <button
                            disabled={deleting}
                            onClick={() => handleDelete(video.id)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      No videos found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 bg-white px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing page <span className="font-semibold text-gray-900">{page}</span> of{' '}
                  <span className="font-semibold text-gray-900">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </button>

                  {/* Numeric Buttons */}
                  <div className="hidden items-center gap-1 md:flex">{renderPageNumbers()}</div>

                  {/* Next Button */}
                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
