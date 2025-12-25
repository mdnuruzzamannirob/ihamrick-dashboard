'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useUploadVideoMutation } from '../../../services/allApi';
import { toast } from 'react-toastify';
import { joditConfig } from '@/utils/joditConfig';

interface VideoFormState {
  title: string;
  date: string;
  status: 'published' | 'unpublished';
  description: string;
  transcriptions: string;
  coverVideo: File | null;
  thumbnail: File | null;
}

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const VideoUploadModal = ({ refetch }: { refetch: any }) => {
  const [formData, setFormData] = useState<VideoFormState>({
    title: '',
    date: '',
    status: 'published',
    description: '',
    transcriptions: '',
    coverVideo: null,
    thumbnail: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [uploadVideo, { isLoading }] = useUploadVideoMutation();

  /* -------------------- handlers -------------------- */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilePreview = (file: File, setter: (v: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (file?: File) => {
    if (!file) return;
    setFormData((p) => ({ ...p, coverVideo: file }));
    handleFilePreview(file, setVideoPreview);
  };

  const handleThumbnailChange = (file?: File) => {
    if (!file) return;
    setFormData((p) => ({ ...p, thumbnail: file }));
    handleFilePreview(file, setThumbnailPreview);
  };

  /* -------------------- submit -------------------- */

  const handleSubmit = async () => {
    if (!formData.coverVideo || !formData.thumbnail) {
      toast.error('Video and thumbnail are required');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('transcription', formData.transcriptions);
    payload.append(
      'uploadDate',
      formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
    );
    payload.append('status', formData.status);
    payload.append('video', formData.coverVideo);
    payload.append('coverImage', formData.thumbnail);

    try {
      await uploadVideo(payload).unwrap();
      refetch();
      toast.success('Video uploaded successfully');
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || err.data.message || 'Upload failed. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      status: 'published',
      description: '',
      transcriptions: '',
      coverVideo: null,
      thumbnail: null,
    });
    setVideoPreview('');
    setThumbnailPreview('');
  };

  /* -------------------- UI -------------------- */

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white"
      >
        <Upload size={18} />
        Upload
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-background text-foreground z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-sm font-semibold">Upload Video</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl leading-none text-gray-500 hover:text-black"
              >
                x
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Title / Date / Status */}

                <div className="flex flex-col gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                    <input
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Title"
                      className="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Date</label>
                    <input
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                  </div>
                </div>

                {/* Video Upload */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium">Video</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-full min-h-[140px] cursor-pointer items-center justify-center rounded border-2 border-dashed border-gray-200 text-sm transition-colors hover:border-inherit"
                  >
                    {videoPreview ? (
                      <video src={videoPreview} controls className="max-h-40" />
                    ) : (
                      'Click to upload video'
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={(e) => handleVideoChange(e.target.files?.[0])}
                  />
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="mb-2 block text-sm font-medium">Thumbnail</label>
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="flex max-h-80 min-h-[140px] cursor-pointer items-center justify-center overflow-hidden rounded border-2 border-dashed border-gray-200 text-sm transition-colors hover:border-inherit"
                >
                  {thumbnailPreview ? (
                    <Image
                      src={thumbnailPreview}
                      alt="thumbnail"
                      width={600}
                      height={200}
                      className="size-full rounded object-cover"
                    />
                  ) : (
                    'Click to upload thumbnail'
                  )}
                </div>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleThumbnailChange(e.target.files?.[0])}
                />
              </div>

              {/* Editors */}
              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <JoditEditor
                  value={formData.description}
                  config={joditConfig}
                  onBlur={(v) => setFormData((p) => ({ ...p, description: v }))}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Transcriptions</label>
                <JoditEditor
                  value={formData.transcriptions}
                  config={joditConfig}
                  onBlur={(v) => setFormData((p) => ({ ...p, transcriptions: v }))}
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-5 border-t border-gray-200 bg-white px-6 py-4">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
                className="rounded bg-red-500 px-5 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="rounded bg-black px-5 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {isLoading ? 'Uploading...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoUploadModal;
