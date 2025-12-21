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

const ITEMS_PER_PAGE = 5;

export default function ManagePodcasts() {
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPodcastId, setSelectedPodcastId] = useState<string | null>(null);

  const router = useRouter();

  /* -------------------- API -------------------- */
  const { data, isLoading } = useGetPodcastsQuery({
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
      router.refresh();
    } catch {
      toast.error('Failed to delete podcast');
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

  const startPodcastLive = async (id: string) => {
    try {
      const res: any = await startPodcast(id).unwrap();

      toast.success('Podcast is now live');
      const liveSessionId = res?.data?.podcast?.liveSessionId;
      router.push(`/broadcaster?podcastId=${id}&sessionId=${liveSessionId}`);
    } catch {
      toast.error('Failed to start live podcast');
    }
  };

  const endPodcastLive = async (id: string) => {
    try {
      await endPodcast(id).unwrap();
      toast.success('Podcast live ended');
      router.refresh();
    } catch {
      toast.error('Failed to end live podcast');
    }
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
          <PodcastsUploadModal />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Duration</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700"> </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      Loading podcasts...
                    </td>
                  </tr>
                ) : podcasts.length > 0 ? (
                  podcasts.map((podcast: any) => (
                    <tr
                      key={podcast.id}
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
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            podcast.status === 'Published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {podcast.status}
                        </span>
                      </td>

                      <td>
                        {' '}
                        {podcast.status === 'scheduled' ? (
                          <button
                            onClick={() => startPodcastLive(podcast?._id)}
                            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white"
                          >
                            {starting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Starting...
                              </>
                            ) : (
                              <>
                                <Cast size={18} /> Go Live
                              </>
                            )}
                          </button>
                        ) : podcast.status === 'live' ? (
                          <button
                            onClick={() => endPodcastLive(podcast?._id)}
                            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm text-white"
                          >
                            {ending ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Stopping...
                              </>
                            ) : (
                              <>
                                <StopCircle size={18} /> Stop Live
                              </>
                            )}
                          </button>
                        ) : null}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <PodcastsEditModal podcast={podcast} />
                          <PodcastsViewModal podcast={podcast} />
                          <button
                            onClick={() => openDeleteModal(podcast.id)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
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
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>

                  <div className="hidden gap-1 md:flex">{renderPageNumbers()}</div>

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm disabled:opacity-50"
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
        <div
          onClick={() => setDeleteModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
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
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
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
