'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import VideoUploadModal from '@/components/modal/videoUploadModal';
import { toast } from 'react-toastify';
import { VideoViewModal } from '@/components/modal/videoViewModal';
import VideoEditModal from '@/components/modal/videoEditModal';
import { useRouter } from 'next/navigation';
import { useGetVideosQuery, useDeleteVideoMutation } from '../../../../services/allApi';

const ITEMS_PER_PAGE = 10;

export default function ManageVideos() {
  const [page, setPage] = useState(1);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const { data, isLoading } = useGetVideosQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });

  const [deleteVideo, { isLoading: deleting }] = useDeleteVideoMutation();
  const router = useRouter();

  const videos = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  /* -------------------- Handlers -------------------- */
  const openDeleteModal = (id: string) => {
    setSelectedVideoId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedVideoId(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedVideoId) return;
    try {
      await deleteVideo(selectedVideoId).unwrap();
      toast.success('Video deleted successfully');
      closeDeleteModal();
      router.refresh();
    } catch {
      toast.error('Failed to delete video');
    }
  };

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
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${video.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {video.status ? 'Published' : 'Unpublished'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <VideoEditModal video={video} />
                          <VideoViewModal video={video} />
                          <button
                            onClick={() => openDeleteModal(video.id)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
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
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>
                  <div className="hidden items-center gap-1 md:flex">{renderPageNumbers()}</div>
                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md scale-100 rounded-xl bg-white p-6 shadow-2xl transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={30} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Confirm Deletion</h3>
              <p className="mb-6 text-sm text-gray-500">
                Are you sure you want to delete this video? This action cannot be undone and the
                video will be permanently removed.
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
