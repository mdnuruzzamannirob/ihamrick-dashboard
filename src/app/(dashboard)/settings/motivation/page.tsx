'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import {
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Quote,
  X,
  ArrowUpDown,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';

// API Hooks
import {
  useCreateMotivationMutation,
  useDeleteMotivationMutation,
  useGetMotivationsQuery,
  useUpdateMotivationMutation,
} from '../../../../../services/allApi';
import { joditConfig } from '@/utils/joditConfig';

// JoditEditor dynamic import to prevent SSR errors
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const ITEMS_PER_PAGE = 10;

export default function ManageMotivationsPage() {
  // --- States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editorContent, setEditorContent] = useState('');

  // --- RTK Query ---
  const { data, isLoading, isFetching } = useGetMotivationsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder,
  });

  const [createMotivation, { isLoading: isCreating }] = useCreateMotivationMutation();
  const [updateMotivation, { isLoading: isUpdating }] = useUpdateMotivationMutation();
  const [deleteMotivation, { isLoading: isDeleting }] = useDeleteMotivationMutation();

  const motivations = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;
  const totalItems = data?.meta?.total || 0;

  // --- Helpers ---
  const getPlainText = (html: string) => {
    if (typeof window === 'undefined') return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const handleSort = (field: string) => {
    setSortOrder(sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc');
    setSortBy(field);
    setCurrentPage(1);
  };

  const handleSubmit = async () => {
    const stripped = getPlainText(editorContent).trim();
    if (!stripped) return toast.error('Please enter some content');

    try {
      if (selectedItem) {
        await updateMotivation({ id: selectedItem._id, text: editorContent }).unwrap();
        toast.success('Motivation updated');
      } else {
        await createMotivation({ text: editorContent }).unwrap();
        toast.success('Motivation created');
      }
      setIsFormModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteMotivation(selectedItem._id).unwrap();
      toast.success('Motivation deleted');
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || err?.data.message || 'Failed to delete');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FBFBFC]">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          {/* Top Header */}
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">Motivations</h1>
              <p className="mt-1 font-medium text-gray-500">
                Manage your daily inspirational database
              </p>
            </div>
            <UserProfile />
          </div>

          {/* Action Bar */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => {
                setSelectedItem(null);
                setEditorContent('');
                setIsFormModalOpen(true);
              }}
              className="group flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-black active:scale-95"
            >
              <Plus size={18} />
              New Motivation
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-[11px] font-black tracking-widest text-gray-400 uppercase">
                    <th
                      className="cursor-pointer px-8 py-5 transition-colors hover:text-black"
                      onClick={() => handleSort('text')}
                    >
                      <div className="flex items-center gap-2">
                        Content Snippet <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th className="px-8 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={2} className="py-24 text-center">
                        <Loader2 className="mx-auto animate-spin text-gray-300" size={40} />
                      </td>
                    </tr>
                  ) : motivations.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-24 text-center">
                        <div className="flex flex-col items-center text-gray-400">
                          <Inbox size={60} strokeWidth={1} className="mb-4 opacity-20" />
                          <p className="text-sm font-semibold italic">No records found...</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    motivations.map((item: any) => (
                      <tr key={item._id} className="group transition-colors hover:bg-gray-50/40">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                              <Quote size={18} />
                            </div>
                            <p className="max-w-2xl truncate text-base font-semibold text-gray-700">
                              {getPlainText(item.text)}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setEditorContent(item.text);
                                setIsFormModalOpen(true);
                              }}
                              className="rounded-xl bg-gray-50 p-2.5 text-gray-500 shadow-sm transition-all hover:bg-gray-900 hover:text-white"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setIsViewModalOpen(true);
                              }}
                              className="rounded-xl bg-gray-50 p-2.5 text-gray-500 shadow-sm transition-all hover:bg-gray-900 hover:text-white"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setIsDeleteModalOpen(true);
                              }}
                              className="rounded-xl bg-red-50 p-2.5 text-red-400 shadow-sm transition-all hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Smart Pagination */}
            {totalItems > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between border-t border-gray-50 bg-gray-50/30 px-8 py-5">
                <p className="text-sm font-bold tracking-tighter text-gray-400 uppercase">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-black uppercase transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-black uppercase transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-30"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
          <div className="absolute inset-0" onClick={() => setIsFormModalOpen(false)} />

          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in zoom-in-95 z-10 w-full max-w-4xl rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5 duration-200"
          >
            <div className="mb-8 flex items-center justify-between border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-black text-gray-900">
                {selectedItem ? 'Edit' : 'Add'} Motivation
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="rounded-full bg-gray-50 p-2 transition-colors hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-8 overflow-hidden rounded">
              <JoditEditor
                value={editorContent}
                config={joditConfig}
                onBlur={(v) => setEditorContent(v)}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="px-6 py-3 font-bold text-gray-400 transition-colors hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
                className="flex items-center gap-2 rounded-2xl bg-black px-10 py-3.5 font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-95 disabled:bg-gray-300"
              >
                {(isCreating || isUpdating) && <Loader2 size={18} className="animate-spin" />}
                {selectedItem ? 'Update Now' : 'Save Motivation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md duration-200">
          {' '}
          <div className="absolute inset-0" onClick={() => setIsViewModalOpen(false)} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in zoom-in-95 z-10 w-full max-w-2xl rounded-3xl bg-white p-10 shadow-2xl duration-200"
          >
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase">
                Content Detail
              </span>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="rounded-full bg-gray-50 p-2 transition-colors hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div
              className="prose prose-neutral min-h-40 max-w-none text-lg leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: selectedItem?.text }}
            />
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="mt-10 w-full rounded-3xl bg-gray-900 py-4 font-bold text-white shadow-xl transition-all hover:bg-black active:scale-[0.98]"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
          {' '}
          <div className="absolute inset-0" onClick={() => setIsDeleteModalOpen(false)} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in zoom-in-95 z-10 w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl duration-200"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertCircle size={40} strokeWidth={1.5} />
            </div>
            <h2 className="mb-2 text-2xl font-black text-gray-900">Wait a minute!</h2>
            <p className="mb-8 text-sm font-medium text-gray-400">
              Are you sure you want to delete this? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-gray-500 transition-colors hover:bg-gray-200"
              >
                No, Keep it
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 rounded-2xl bg-red-500 py-4 font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 active:scale-95 disabled:bg-red-300"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
