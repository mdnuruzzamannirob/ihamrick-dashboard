'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Loader2, X, UploadCloud, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { useUpdatePodcastMutation } from '../../../services/allApi';
import { joditConfig } from '@/utils/joditConfig';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const PodcastEditModal = ({ podcast, refetch }: { podcast: any; refetch: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatePodcast, { isLoading: isUpdating }] = useUpdatePodcastMutation();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    status: 'scheduled',
    description: '',
    transcription: '',
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync data when modal opens
  useEffect(() => {
    if (podcast && isModalOpen) {
      setFormData({
        title: podcast.title || '',
        date: podcast.date ? new Date(podcast.date).toISOString().split('T')[0] : '',
        status: podcast.status,
        description: podcast.description || '',
        transcription: podcast.transcription || '',
      });
      setImagePreview(podcast.coverImageUrl || podcast.coverImage || '');
    }
  }, [podcast, isModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (file?: File) => {
    if (!file) return;
    setCoverImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return toast.error('Title is required');

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('transcription', formData.transcription);
    payload.append(
      'date',
      formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
    );
    payload.append('status', String(formData.status));

    if (coverImage) {
      payload.append('coverImage', coverImage);
    }

    try {
      await updatePodcast({ id: podcast.id, data: payload }).unwrap();
      refetch();
      toast.success('Podcast updated successfully');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update podcast');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
        title="Edit Podcast"
      >
        <Pencil size={16} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in zoom-in z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Edit Podcast Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-6 overflow-y-auto px-8 py-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Inputs */}
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Title
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Title"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm transition-all outline-none focus:border-black focus:ring-2 focus:ring-black/5"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      disabled
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm transition-all outline-none focus:border-black disabled:bg-gray-100 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Cover Image
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-black"
                  >
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-gray-300" />
                        <p className="mt-1 text-xs text-gray-500">Change Cover</p>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <UploadCloud className="text-white" />
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImageChange(e.target.files?.[0])}
                  />
                </div>
              </div>

              {/* Editors */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <JoditEditor
                    value={formData.description}
                    config={joditConfig}
                    onBlur={(v) => setFormData((p) => ({ ...p, description: v }))}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Transcription
                  </label>
                  <JoditEditor
                    value={formData.transcription}
                    config={joditConfig}
                    onBlur={(v) => setFormData((p) => ({ ...p, transcription: v }))}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg px-6 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2 rounded-lg bg-black px-8 py-2 text-sm font-medium text-white shadow-lg shadow-black/10 transition-all hover:bg-zinc-800 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  'Update Podcast'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PodcastEditModal;
