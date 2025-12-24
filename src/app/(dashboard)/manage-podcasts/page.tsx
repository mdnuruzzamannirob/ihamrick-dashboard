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
  Cast,
  StopCircle,
  Radio,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import PodcastsUploadModal from '@/components/modal/podcastUpload';
import PodcastsEditModal from '@/components/modal/podcastsEdit';
import { PodcastsViewModal } from '@/components/modal/podcastsViewModal';
import {
  useGetPodcastsQuery,
  useDeletePodcastMutation,
  useEndPodcastMutation,
  useStartPodcastMutation,
} from '../../../../services/allApi';

const ITEMS_PER_PAGE = 10;

export default function ManagePodcasts() {
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPodcastId, setSelectedPodcastId] = useState<string | null>(null);

  const [processingId, setProcessingId] = useState<string | null>(null);

  const router = useRouter();

  const { data, isLoading, refetch } = useGetPodcastsQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });

  const [deletePodcast, { isLoading: deleting }] = useDeletePodcastMutation();
  const [startPodcast, { isLoading: starting }] = useStartPodcastMutation();
  const [endPodcast, { isLoading: ending }] = useEndPodcastMutation();

  const podcasts = data?.data?.podcasts ?? [];
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  /* -------------------- Handlers -------------------- */
  const openDeleteModal = (id: string) => {
    setSelectedPodcastId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedPodcastId(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedPodcastId) return;
    try {
      await deletePodcast(selectedPodcastId).unwrap();
      toast.success('Podcast deleted successfully');
      closeDeleteModal();
      refetch();
    } catch {
      toast.error('Failed to delete podcast');
    }
  };

  const startPodcastLive = async (id: string) => {
    setProcessingId(id);
    try {
      const res: any = await startPodcast(id).unwrap();
      toast.success('Podcast is now live');
      const liveSessionId = res?.data?.podcast?.liveSessionId;

      if (typeof window !== 'undefined') {
        localStorage.setItem(`podcast_live_${id}`, 'true');
      }
      router.push(`/broadcaster?podcastId=${id}&sessionId=${liveSessionId}`);
    } catch {
      toast.error('Failed to start live podcast');
    } finally {
      setProcessingId(null);
    }
  };

  const endPodcastLive = async (id: string) => {
    setProcessingId(id);
    try {
      await endPodcast(id).unwrap();
      toast.success('Podcast live ended');
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`podcast_live_${id}`);
      }
      refetch();
    } catch {
      toast.error('Failed to end live podcast');
    } finally {
      setProcessingId(null);
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
            page === i ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 p-6 lg:ml-64">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-800">Manage Podcasts</h1>
          <UserProfile />
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-end">
          <PodcastsUploadModal refetch={refetch} />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Duration</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="min-w-[200px] px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Go Live / Actions
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Manage
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      Loading podcasts...
                    </td>
                  </tr>
                ) : podcasts.length > 0 ? (
                  podcasts.map((podcast: any) => {
                    const isProcessingThisRow = processingId === podcast._id;

                    return (
                      <tr
                        key={podcast._id}
                        className="border-gray-200 transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{podcast.title}</td>

                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(podcast.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {podcast.duration || '—'}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${
                              podcast.status === 'live'
                                ? 'animate-pulse bg-red-100 text-red-600 ring-1 ring-red-200'
                                : podcast.status === 'scheduled'
                                  ? 'bg-blue-100 text-blue-600 ring-1 ring-blue-200'
                                  : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
                            }`}
                          >
                            {podcast.status === 'live' && (
                              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                            )}
                            {podcast.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {podcast.status === 'scheduled' && (
                              <button
                                onClick={() => startPodcastLive(podcast._id)}
                                disabled={isProcessingThisRow}
                                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-50"
                              >
                                {starting && isProcessingThisRow ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Cast size={16} />
                                )}
                                Go Live
                              </button>
                            )}

                            {podcast.status === 'live' && (
                              <>
                                <button
                                  onClick={() => {
                                    if (typeof window !== 'undefined')
                                      localStorage.setItem(`podcast_live_${podcast._id}`, 'true');
                                    router.push(
                                      `/broadcaster?podcastId=${podcast._id}&sessionId=${podcast.liveSessionId}`,
                                    );
                                  }}
                                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                                >
                                  <Radio size={16} /> Studio
                                </button>

                                <button
                                  onClick={() => endPodcastLive(podcast._id)}
                                  disabled={isProcessingThisRow}
                                  className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:opacity-50"
                                >
                                  {ending && isProcessingThisRow ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <StopCircle size={16} />
                                  )}
                                  Stop
                                </button>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <PodcastsEditModal podcast={podcast} refetch={refetch} />
                            <PodcastsViewModal podcast={podcast} refetch={refetch} />
                            <button
                              onClick={() => openDeleteModal(podcast._id)}
                              className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      No podcasts found.
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
                  Page <span className="font-semibold">{page}</span> of{' '}
                  <span className="font-semibold">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>

                  <div className="hidden gap-1 md:flex">{renderPageNumbers()}</div>

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={closeDeleteModal} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={30} />
              </div>
              <h3 className="mb-2 text-xl font-bold">Confirm Deletion</h3>
              <p className="mb-6 text-sm text-gray-500">
                This podcast will be permanently deleted. This action cannot be undone.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
                    </>
                  ) : (
                    'Delete'
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
