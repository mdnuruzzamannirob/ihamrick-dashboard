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
  ArrowUpDown,
  Mic,
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

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const router = useRouter();

  const { data, isLoading, refetch, isFetching } = useGetPodcastsQuery({
    page,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder,
  });

  const [deletePodcast, { isLoading: deleting }] = useDeletePodcastMutation();
  const [startPodcast] = useStartPodcastMutation();
  const [endPodcast] = useEndPodcastMutation();

  const podcasts = data?.data?.podcasts ?? [];
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  /* -------------------- Handlers -------------------- */
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

  return (
    <div className="flex min-h-screen bg-white text-neutral-900">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="font-primary text-2xl font-bold md:text-3xl">Manage Podcasts</h1>
            <UserProfile />
          </div>

          {/* Action Button */}
          <div className="mb-6 flex justify-end">
            <PodcastsUploadModal refetch={refetch} />
          </div>

          {/* Table Container */}
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
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">Date {renderSortIcon('createdAt')}</div>
                    </th>
                    <th
                      className="cursor-pointer px-6 py-4 transition-colors hover:bg-neutral-100"
                      onClick={() => handleSort('duration')}
                    >
                      <div className="flex items-center">Duration {renderSortIcon('duration')}</div>
                    </th>
                    <th
                      className="cursor-pointer px-6 py-4 text-center transition-colors hover:bg-neutral-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center justify-center">
                        Status {renderSortIcon('status')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center">Live Control</th>
                    <th className="px-6 py-4 text-center">Manage</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100 bg-white">
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                          <p className="text-sm font-medium text-neutral-500">
                            Getting podcasts...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : podcasts.length > 0 ? (
                    podcasts.map((podcast: any) => {
                      const isProcessingThisRow = processingId === podcast._id;

                      return (
                        <tr key={podcast._id} className="transition-colors hover:bg-neutral-50/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                                <Mic size={18} />
                              </div>
                              <span className="max-w-[180px] truncate text-sm font-semibold text-neutral-800">
                                {podcast.title}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-neutral-500">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              {new Date(podcast.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-neutral-500">
                            <div className="flex items-center gap-2 font-mono">
                              <Clock size={14} />
                              {podcast.duration || '00:00'}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
                                podcast.status === 'live'
                                  ? 'animate-pulse bg-red-500 text-white shadow-lg shadow-red-200'
                                  : podcast.status === 'scheduled'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-neutral-200 text-neutral-500'
                              }`}
                            >
                              {podcast.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {podcast.status === 'scheduled' && (
                                <button
                                  onClick={() => startPodcastLive(podcast._id)}
                                  disabled={isProcessingThisRow}
                                  className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-[10px] font-black tracking-widest text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
                                >
                                  {isProcessingThisRow ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Cast size={14} />
                                  )}
                                  GO LIVE
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
                                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-[10px] font-black tracking-widest text-white shadow-md shadow-indigo-100 hover:bg-indigo-700"
                                  >
                                    <Radio size={14} /> STUDIO
                                  </button>
                                  <button
                                    onClick={() => endPodcastLive(podcast._id)}
                                    disabled={isProcessingThisRow}
                                    className="flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-[10px] font-black tracking-widest text-red-600 hover:bg-red-200"
                                  >
                                    {isProcessingThisRow ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <StopCircle size={14} />
                                    )}
                                    STOP
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
                                className="rounded-xl bg-red-50 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
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
                      <td colSpan={6} className="py-20 text-center text-neutral-400">
                        No podcasts available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-neutral-100 bg-white px-6 py-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                    Page <span className="text-black">{page}</span> of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="flex h-10 items-center gap-1 rounded-xl border border-neutral-200 px-4 text-xs font-bold transition-all hover:bg-neutral-50 disabled:opacity-30"
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="flex h-10 items-center gap-1 rounded-xl border border-neutral-200 px-4 text-xs font-bold transition-all hover:bg-neutral-50 disabled:opacity-30"
                    >
                      Next <ChevronRight size={16} />
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
          <div className="z-10 w-full max-w-sm rounded-4xl bg-white p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="mb-2 text-xl font-bold">Delete Podcast?</h3>
              <p className="mb-8 text-sm leading-relaxed text-neutral-500">
                This will permanently remove the podcast. This action is irreversible.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 rounded-2xl border border-neutral-200 py-3 text-sm font-bold text-neutral-500 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 hover:bg-red-600 disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
