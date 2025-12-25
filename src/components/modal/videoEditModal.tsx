'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { useUpdateVideoMutation } from '../../../services/allApi';
import { joditConfig } from '@/utils/joditConfig';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const VideoEditModal = ({ video, refetch }: { video: any; refetch: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();

  const [formData, setFormData] = useState({
    title: '',
    uploadDate: '',
    status: 'published',
    description: '',
    transcription: '',
  });

  const [files, setFiles] = useState<{ video: File | null; coverImage: File | null }>({
    video: null,
    coverImage: null,
  });

  const [previews, setPreviews] = useState({
    video: '',
    thumbnail: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (video && isModalOpen) {
      setFormData({
        title: video.title || '',
        uploadDate: video.uploadDate ? new Date(video.uploadDate).toISOString().split('T')[0] : '',
        status: video.status ? 'published' : 'unpublished',
        description: video.description || '',
        transcription: video.transcription || '',
      });
      setPreviews({
        video: video.signedUrl || video.videoUrl || '',
        thumbnail: video.thumbnailUrl || '',
      });
    }
  }, [video, isModalOpen]);

  /* -------------------- handlers -------------------- */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'video') {
          setFiles((prev) => ({ ...prev, video: file }));
          setPreviews((prev) => ({ ...prev, video: reader.result as string }));
        } else {
          setFiles((prev) => ({ ...prev, coverImage: file }));
          setPreviews((prev) => ({ ...prev, thumbnail: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('transcription', formData.transcription);
      submitData.append('uploadDate', formData.uploadDate);
      submitData.append('status', formData.status);

      if (files.video) submitData.append('video', files.video);
      if (files.coverImage) submitData.append('coverImage', files.coverImage);

      await updateVideo({ id: video.id, data: submitData as any }).unwrap();
      refetch();
      toast.success('Video updated successfully!');
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update video');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
        aria-label="Edit"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-sm font-semibold text-gray-800">Edit Video Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl leading-none text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Basic Info */}
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
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Upload Date
                    </label>
                    <input
                      name="uploadDate"
                      type="date"
                      disabled
                      value={formData.uploadDate}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100 disabled:opacity-50"
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

                {/* Video Upload Preview */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Video</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-full min-h-40 cursor-pointer items-center justify-center rounded border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-gray-400"
                  >
                    {previews.video ? (
                      <video src={previews.video} controls className="max-h-48 rounded" />
                    ) : (
                      <span className="px-4 text-center text-sm text-gray-500">
                        Click to change video file
                      </span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={(e) => handleFileChange(e, 'video')}
                  />
                </div>
              </div>

              {/* Thumbnail Preview */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Thumbnail</label>
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="flex min-h-40 cursor-pointer items-center justify-center overflow-hidden rounded border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-gray-400"
                >
                  {previews.thumbnail ? (
                    <Image
                      src={previews.thumbnail}
                      alt="thumbnail"
                      width={600}
                      height={200}
                      className="size-full max-h-48 rounded object-cover"
                    />
                  ) : (
                    <span className="px-4 text-center text-sm text-gray-500">
                      Click to upload thumbnail image
                    </span>
                  )}
                </div>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFileChange(e, 'image')}
                />
              </div>

              {/* Description Editor */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                <JoditEditor
                  value={formData.description}
                  config={joditConfig}
                  onBlur={(v) => setFormData((p) => ({ ...p, description: v }))}
                />
              </div>

              {/* Transcription Editor */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Transcription
                </label>
                <JoditEditor
                  value={formData.transcription}
                  config={joditConfig}
                  onBlur={(v) => setFormData((p) => ({ ...p, transcription: v }))}
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isUpdating}
                className="rounded bg-red-500 px-5 py-2 text-sm text-white transition-colors hover:bg-red-600 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2 rounded bg-black px-6 py-2 text-sm text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoEditModal;
