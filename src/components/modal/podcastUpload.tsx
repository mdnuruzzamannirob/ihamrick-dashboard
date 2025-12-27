'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { useCreatePodcastMutation } from '../../../services/allApi';
import { joditConfig } from '@/utils/joditConfig';

interface PodcastFormState {
  title: string;
  date: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  description: string;
  transcription: string;
  coverImage: File | null;
}

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const PodcastUploadModal = ({ refetch }: any) => {
  const [formData, setFormData] = useState<PodcastFormState>({
    title: '',
    date: '',
    status: 'scheduled',
    description: '',
    transcription: '',
    coverImage: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createPodcast, { isLoading }] = useCreatePodcastMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (file?: File) => {
    if (!file) return;
    setFormData((p) => ({ ...p, coverImage: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formData.coverImage) {
      toast.error('Cover image is required');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('transcription', formData.transcription);
    payload.append(
      'date',
      formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
    );
    payload.append('status', formData.status);
    if (formData.coverImage) payload.append('coverImage', formData.coverImage);

    try {
      await createPodcast(payload).unwrap();
      refetch();
      toast.success('Podcast created successfully');
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create podcast');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      status: 'scheduled',
      description: '',
      transcription: '',
      coverImage: null,
    });
    setImagePreview('');
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white"
      >
        <Plus size={18} />
        Create Podcast
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-sm font-semibold">Create Podcast</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left */}
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Title"
                      className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Cover Image */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium">Cover Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-full min-h-[140px] cursor-pointer items-center justify-center rounded border-2 border-dashed border-gray-200 text-sm transition-colors hover:border-inherit"
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="cover"
                        width={600}
                        height={200}
                        className="h-full w-full rounded object-cover"
                      />
                    ) : (
                      'Click to upload image'
                    )}
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

              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <JoditEditor
                  value={formData.description}
                  config={joditConfig}
                  onBlur={(v) => setFormData((p) => ({ ...p, description: v }))}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Transcription</label>
                <JoditEditor
                  value={formData.transcription}
                  config={joditConfig}
                  onBlur={(v) => setFormData((p) => ({ ...p, transcription: v }))}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 border-t border-gray-200 bg-white px-6 py-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded bg-red-500 px-5 py-2 text-sm text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="rounded bg-black px-5 py-2 text-sm text-white"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PodcastUploadModal;
