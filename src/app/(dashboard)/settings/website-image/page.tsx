'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import { SmartMediaUpload } from '@/components/SmartMediaUpload';
import {
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  X,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';

import {
  useGetImagesQuery,
  useCreateImageMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
} from '../../../../../services/allApi';
import Image from 'next/image';

const ITEMS_PER_PAGE = 8;

export default function ManageImagesPage() {
  // --- States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [imageData, setImageData] = useState({ file: null, preview: '' });

  // --- RTK Query ---
  const { data, isLoading, isFetching } = useGetImagesQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const [createImage, { isLoading: isCreating }] = useCreateImageMutation();
  const [updateImage, { isLoading: isUpdating }] = useUpdateImageMutation();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();

  const images = Array.isArray(data) ? data : data?.data || [];
  const totalPages = data?.meta?.totalPages || Math.ceil(images.length / ITEMS_PER_PAGE) || 1;

  // --- Handlers ---
  const handleSubmit = async () => {
    if (!imageData.file && !selectedItem) {
      return toast.error('Please select an image first');
    }

    const formData = new FormData();
    if (imageData.file) {
      formData.append('image', imageData.file);
    }

    try {
      if (selectedItem) {
        // Update
        await updateImage({ id: selectedItem._id, updatedImage: formData }).unwrap();
        toast.success('Image updated successfully');
      } else {
        // Create
        await createImage(formData).unwrap();
        toast.success('Image uploaded successfully');
      }
      closeFormModal();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Operation failed');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteImage(selectedItem._id).unwrap();
      toast.success('Image removed');
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || err?.data.message || 'Failed to delete');
    }
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedItem(null);
    setImageData({ file: null, preview: '' });
  };

  return (
    <div className="flex min-h-screen bg-[#FBFBFC]">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          {/* Top Header */}
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">Website Image</h1>
              <p className="mt-1 font-medium text-gray-500">
                Manage your website&apos;s visual assets
              </p>
            </div>
            <UserProfile />
          </div>

          {/* Action Bar */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => {
                setSelectedItem(null);
                setImageData({ file: null, preview: '' });
                setIsFormModalOpen(true);
              }}
              className="group flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-black active:scale-95"
            >
              <Plus size={18} />
              Add New Image
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-[11px] font-black tracking-widest text-gray-400 uppercase">
                    <th className="px-8 py-5">Preview</th>
                    <th className="px-8 py-5">Image ID</th>
                    <th className="px-8 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={3} className="py-24 text-center">
                        <Loader2 className="mx-auto animate-spin text-gray-300" size={40} />
                      </td>
                    </tr>
                  ) : images.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-24 text-center">
                        <div className="flex flex-col items-center text-gray-400">
                          <Inbox size={60} strokeWidth={1} className="mb-4 opacity-20" />
                          <p className="text-sm font-semibold italic">No images found...</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    images.map((item: any) => (
                      <tr key={item._id} className="group transition-colors hover:bg-gray-50/40">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-5">
                            <div className="relative h-16 w-24 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                              <Image
                                src={item.image}
                                alt="Website asset"
                                fill
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <p className="font-mono text-xs text-gray-400 uppercase">{item._id}</p>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setImageData({ file: null, preview: item.image });
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-50 bg-gray-50/30 px-8 py-5">
                <p className="text-sm font-bold text-gray-400 uppercase">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-black uppercase transition-all hover:bg-gray-50 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-black uppercase transition-all hover:bg-gray-50 disabled:opacity-30"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Form Modal (Add/Edit) */}
      {isFormModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={closeFormModal} />
          <div className="animate-in zoom-in-95 z-10 w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-8 flex items-center justify-between border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-black text-gray-900">
                {selectedItem ? 'Edit' : 'Upload'} Image
              </h2>
              <button
                onClick={closeFormModal}
                className="rounded-full bg-gray-50 p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-8">
              <SmartMediaUpload
                label="Drop Website Image"
                allowedFormats={['image/*']}
                className="aspect-video"
                onFileChange={(file: any, preview: any) => setImageData({ file, preview })}
                initialUrl={imageData.preview}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeFormModal}
                className="px-6 py-3 font-bold text-gray-400 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
                className="flex items-center gap-2 rounded-2xl bg-black px-10 py-3.5 font-bold text-white shadow-lg active:scale-95 disabled:bg-gray-300"
              >
                {(isCreating || isUpdating) && <Loader2 size={18} className="animate-spin" />}
                {selectedItem ? 'Update Image' : 'Upload Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setIsViewModalOpen(false)} />
          <div className="animate-in zoom-in-95 z-10 w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="rounded-full bg-gray-50 p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={selectedItem?.image}
                alt="Preview"
                width={500}
                height={500}
                className="h-auto max-h-[70vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="animate-in zoom-in-95 z-10 w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertCircle size={40} strokeWidth={1.5} />
            </div>
            <h2 className="mb-2 text-2xl font-black text-gray-900">Are you sure?</h2>
            <p className="mb-8 text-sm font-medium text-gray-400">
              This image will be permanently removed from your website storage.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-gray-500 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 rounded-2xl bg-red-500 py-4 font-bold text-white shadow-lg shadow-red-200 active:scale-95 disabled:bg-red-300"
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
