'use client';

import type React from 'react';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCreatePodcastMutation } from '../../../services/allApi';
import { SmartMediaUpload } from '../SmartMediaUpload';
import { fromZonedTime } from 'date-fns-tz';
import TiptapEditor from '../editor/TiptapEditor';

interface PodcastFormState {
  title: string;
  date: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  description: string;
  transcription: string;
  coverImage: File | Blob | null;
}

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

  const [createPodcast, { isLoading }] = useCreatePodcastMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.date) {
      toast.error('Date is required');
      return;
    }

    const payload = new FormData();

    const utcDate = formData?.date
      ? (() => {
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const now = new Date();
          const localDateTime = `${formData.date}T${now.toTimeString().slice(0, 8)}`;

          return fromZonedTime(localDateTime, timeZone).toISOString();
        })()
      : null;

    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('transcription', formData.transcription);
    if (utcDate) payload.append('date', utcDate);
    payload.append('status', formData.status);

    if (formData.coverImage) {
      payload.append('coverImage', formData.coverImage);
    }

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
            className="z-10 flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
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

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium">Cover Image (optional)</label>
                  <SmartMediaUpload
                    label="Click to upload image"
                    allowedFormats={['image/*']}
                    className="h-full max-h-48"
                    onFileChange={(file, preview) => {
                      setFormData((p) => ({ ...p, coverImage: file }));
                      setImagePreview(preview);
                    }}
                    initialUrl={imagePreview}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <TiptapEditor
                  value={formData.description}
                  onChange={(newContent) => setFormData((p) => ({ ...p, description: newContent }))}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Transcription</label>
                <TiptapEditor
                  value={formData.transcription}
                  onChange={(newContent) =>
                    setFormData((p) => ({ ...p, transcription: newContent }))
                  }
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
