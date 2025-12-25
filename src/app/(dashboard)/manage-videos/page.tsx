'use client';
import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertTriangle,
  Loader2,
  ArrowUpDown,
  Video,
} from 'lucide-react';
import VideoUploadModal from '@/components/modal/videoUploadModal';
import { toast } from 'react-toastify';
import { VideoViewModal } from '@/components/modal/videoViewModal';
import VideoEditModal from '@/components/modal/videoEditModal';
import { useGetVideosQuery, useDeleteVideoMutation } from '../../../../services/allApi';

const ITEMS_PER_PAGE = 10;

export default function ManageVideos() {
  const [page, setPage] = useState(1);

  // --- Sorting State ---
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const { data, isLoading, refetch, isFetching } = useGetVideosQuery({
    page,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder,
  });

  const [deleteVideo, { isLoading: deleting }] = useDeleteVideoMutation();

  const videos = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  // --- Sorting Handler ---
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field)
      return (
        <ArrowUpDown
          size={14}
          className="ml-1 text-neutral-300 transition hover:text-neutral-500"
        />
      );
    return (
      <ArrowUpDown
        size={14}
        className={`ml-1 ${sortOrder === 'asc' ? 'rotate-180 transform text-blue-600' : 'text-blue-600'}`}
      />
    );
  };

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
      refetch();
    } catch {
      toast.error('Failed to delete video');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-black md:text-3xl">Manage Videos</h1>
            <UserProfile />
          </div>

          {/* Actions */}
          <div className="mb-6 flex justify-end">
            <VideoUploadModal refetch={refetch} />
          </div>

          {/* Table Section */}
          <div className="overflow-hidden rounded-3xl border border-neutral-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr className="text-left text-xs font-black tracking-widest text-neutral-500 uppercase">
                    <th
                      className="cursor-pointer px-6 py-4 transition-colors hover:bg-neutral-100"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">Title {renderSortIcon('title')}</div>
                    </th>
                    <th
                      className="cursor-pointer px-6 py-4 transition-colors hover:bg-neutral-100"
                      onClick={() => handleSort('uploadDate')}
                    >
                      <div className="flex items-center">
                        Upload Date {renderSortIcon('uploadDate')}
                      </div>
                    </th>
                    <th
                      className="cursor-pointer px-6 py-4 text-center transition-colors hover:bg-neutral-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center justify-center">
                        Status {renderSortIcon('status')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100 bg-white">
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                          <p className="text-sm font-medium text-neutral-500">Getting videos...</p>
                        </div>
                      </td>
                    </tr>
                  ) : videos.length > 0 ? (
                    videos.map((video: any) => (
                      <tr key={video._id} className="transition-colors hover:bg-neutral-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                              <Video size={18} />
                            </div>
                            <span className="max-w-[180px] truncate text-sm font-semibold text-neutral-800">
                              {video.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-neutral-400" />
                            {new Date(video.uploadDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                              video.status === 'published'
                                ? 'bg-black text-white'
                                : 'bg-neutral-200 text-neutral-500'
                            }`}
                          >
                            {video.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <VideoEditModal video={video} refetch={refetch} />
                            <VideoViewModal video={video} />
                            <button
                              onClick={() => openDeleteModal(video._id || video.id)}
                              className="rounded-lg bg-red-50 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-neutral-400">
                        No videos found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-neutral-100 bg-white px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-neutral-600">
                    Page <span className="font-semibold">{page}</span> of{' '}
                    <span className="font-semibold">{totalPages}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="flex h-10 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-sm transition-all hover:bg-neutral-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </button>
                    <button
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="flex h-10 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-sm transition-all hover:bg-neutral-50 disabled:opacity-50"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={closeDeleteModal} />
          <div className="z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900">Are you sure?</h3>
              <p className="mb-8 text-sm text-neutral-500">
                This video will be permanently deleted. This action cannot be undone.
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-neutral-200 py-3 text-sm font-bold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Video'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
