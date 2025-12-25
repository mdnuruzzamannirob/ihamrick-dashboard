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
  BookOpen,
  User,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { EditPublicationModal } from '@/components/modal/edit-publications';
import { ViewPublicationModal } from '@/components/modal/ViewPublicationModal';
import { PublicationModal } from '@/components/modal/publication-modal';
import { useGetPublicationsQuery, useDeletePublicationMutation } from '../../../../services/allApi';

const ITEMS_PER_PAGE = 10;

export default function ManagePublications() {
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPublicationId, setSelectedPublicationId] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState('publicationDate');
  const [sortOrder, setSortOrder] = useState('desc');

  /* -------------------- API -------------------- */
  const { data, isLoading, refetch, isFetching } = useGetPublicationsQuery({
    page,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder,
  });

  const [deletePublication, { isLoading: deleting }] = useDeletePublicationMutation();

  const publications = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

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
    setSelectedPublicationId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedPublicationId(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedPublicationId) return;
    try {
      await deletePublication(selectedPublicationId).unwrap();
      toast.success('Publication deleted successfully');
      closeDeleteModal();
      refetch();
    } catch {
      toast.error('Failed to delete publication');
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-neutral-900">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="font-primary text-2xl font-bold tracking-tight md:text-3xl">
              Manage Publications
            </h1>
            <UserProfile />
          </div>

          {/* Action Button */}
          <div className="mb-6 flex justify-end">
            <PublicationModal refetch={refetch} />
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-4xl border border-neutral-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-neutral-50/50">
                  <tr className="border-b border-neutral-100 text-left text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase">
                    <th
                      className="cursor-pointer px-6 py-5 transition-colors hover:bg-neutral-100/50"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">Title {renderSortIcon('title')}</div>
                    </th>
                    <th
                      className="cursor-pointer px-6 py-5 transition-colors hover:bg-neutral-100/50"
                      onClick={() => handleSort('author')}
                    >
                      <div className="flex items-center">Author {renderSortIcon('author')}</div>
                    </th>
                    <th
                      className="cursor-pointer px-6 py-5 transition-colors hover:bg-neutral-100/50"
                      onClick={() => handleSort('publicationDate')}
                    >
                      <div className="flex items-center">
                        Date {renderSortIcon('publicationDate')}
                      </div>
                    </th>
                    <th
                      className="cursor-pointer px-6 py-5 text-center transition-colors hover:bg-neutral-100/50"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center justify-center">
                        Status {renderSortIcon('status')}
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center">Manage</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="h-10 w-10 animate-spin text-neutral-200" />
                          <p className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                            Getting publications...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : publications.length > 0 ? (
                    publications.map((publication: any) => (
                      <tr
                        key={publication._id}
                        className="group transition-colors hover:bg-neutral-50/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                              <BookOpen size={18} />
                            </div>
                            <span className="max-w-60 truncate text-sm font-semibold text-neutral-800">
                              {publication.title}
                            </span>
                          </div>
                        </td>

                        <td className="max-w-54 px-6 py-4 text-sm text-neutral-500">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-neutral-300" />
                            <span className="truncate font-medium">{publication.author}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-neutral-500">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-neutral-300" />
                            <span className="font-medium">
                              {new Date(publication.publicationDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`rounded-full px-4 py-1 text-[10px] font-black tracking-widest uppercase transition-all ${
                              publication.status
                                ? 'bg-black text-white shadow-lg shadow-neutral-200'
                                : 'bg-neutral-100 text-neutral-400'
                            }`}
                          >
                            {publication.status ? 'Published' : 'Draft'}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <EditPublicationModal publication={publication} refetch={refetch} />
                            <ViewPublicationModal publication={publication} />
                            <button
                              onClick={() => openDeleteModal(publication._id)}
                              className="rounded-xl bg-red-50 p-2.5 text-red-500 transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-2 text-neutral-300">
                          <BookOpen size={48} strokeWidth={1} />
                          <p className="text-sm font-bold tracking-widest uppercase">
                            No publications found
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-neutral-100 bg-white px-8 py-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black tracking-[0.15em] text-neutral-400 uppercase">
                    Page <span className="text-black">{page}</span> of {totalPages}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="flex h-11 items-center gap-2 rounded-2xl border border-neutral-200 px-5 text-xs font-bold transition-all hover:bg-neutral-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronLeft size={16} /> PREV
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="flex h-11 items-center gap-2 rounded-2xl border border-neutral-200 px-5 text-xs font-bold transition-all hover:bg-neutral-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      NEXT <ChevronRight size={16} />
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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all">
          <div className="absolute inset-0" onClick={closeDeleteModal} />
          <div className="animate-in zoom-in-95 z-10 w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-2xl duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertTriangle size={40} strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 text-2xl font-black tracking-tight">Remove this?</h3>
              <p className="mb-10 text-sm leading-relaxed font-medium text-neutral-500">
                This publication will be permanently deleted. This action cannot be undone.
              </p>
              <div className="flex w-full gap-4">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 rounded-2xl border border-neutral-100 py-4 text-xs font-black tracking-widest text-neutral-400 uppercase transition-colors hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 text-xs font-black tracking-widest text-white shadow-xl shadow-red-100 transition-all hover:bg-red-600 active:scale-95 disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'DELETE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
