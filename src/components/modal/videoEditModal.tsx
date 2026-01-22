'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Pencil, Play, ImageIcon, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUpdateVideoMutation } from '../../../services/allApi';
import { SmartMediaUpload } from '../SmartMediaUpload';
import { fromZonedTime } from 'date-fns-tz';
import { dateFormatter } from '@/utils/dateFormatter';
import TiptapEditor from '../editor/TiptapEditor';

const VideoEditModal = ({ video, refetch }: { video: any; refetch: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();

  // Form States
  const [formData, setFormData] = useState({
    title: '',
    uploadDate: '',
    status: 'published',
    description: '',
    transcription: '',
    videoUrl: '',
  });

  // Media States
  const [videoData, setVideoData] = useState<{ file: File | Blob | null; preview: string }>({
    file: null,
    preview: '',
  });
  const [imageData, setImageData] = useState<{ file: File | Blob | null; preview: string }>({
    file: null,
    preview: '',
  });

  // Initialize data when modal opens
  useEffect(() => {
    if (video && isModalOpen) {
      const existingUrl = typeof video.videoUrl === 'string' ? video.videoUrl : '';

      setFormData({
        title: video.title || '',
        uploadDate: video.uploadDate
          ? dateFormatter(video.uploadDate, { unformatted: true }).split('T')[0]
          : '',
        status: video.status === 'published' || video.status === true ? 'published' : 'unpublished',
        description: video.description || '',
        transcription: video.transcription || '',
        videoUrl: existingUrl,
      });

      setVideoData({
        file: null,
        preview: video.signedUrl || (!existingUrl ? video.videoUrl : '') || '',
      });

      setImageData({ file: null, preview: video.thumbnailUrl || '' });
    }
  }, [video, isModalOpen]);

  const handleSave = async () => {
    if (!formData.title.trim()) return toast.error('Title is required');
    if (formData.status === 'published' && !formData.uploadDate)
      return toast.error('Upload date is required');

    // Validation: Check if at least one source exists
    if (!videoData.file && !formData.videoUrl.trim() && !videoData.preview) {
      return toast.error('Video content is required');
    }

    const payload = new FormData();

    const utcDate = (() => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date();

      let localDateStr = formData.uploadDate;

      if (!localDateStr) {
        localDateStr = now.toISOString().split('T')[0];
      }

      if (localDateStr) {
        try {
          let localDateTime = localDateStr;

          if (!localDateTime.includes('T')) {
            const currentTime = now.toTimeString().slice(0, 8);
            localDateTime = `${localDateTime}T${currentTime}`;
          }

          const zonedDate = fromZonedTime(localDateTime, timeZone);

          if (isNaN(zonedDate.getTime())) {
            return null;
          }

          return zonedDate.toISOString();
        } catch {
          return null;
        }
      }
      return null;
    })();

    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('transcription', formData.transcription);
    payload.append('status', formData.status);
    if (utcDate) payload.append('uploadDate', utcDate);

    if (videoData.file) {
      payload.append('video', videoData.file);
      payload.append('videoUrl', '');
    } else if (formData.videoUrl.trim()) {
      payload.append('videoUrl', formData.videoUrl.trim());
    }

    if (imageData.file) {
      payload.append('coverImage', imageData.file);
    }

    try {
      await updateVideo({ id: video._id, data: payload as any }).unwrap();
      toast.success('Video updated successfully');
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Update failed');
    }
  };

  const isUrlDisabled = !!videoData.file;
  const isFileUploadDisabled = formData.videoUrl.trim().length > 0;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
      >
        <Pencil size={16} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-md">
          <div className="z-10 flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-4xl border border-white/10 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-10 py-5">
              <h2 className="text-2xl font-black tracking-tight text-zinc-900">Edit Video</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 hover:bg-zinc-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* 1. Video Edit Section */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-[10px] font-black tracking-[2px] text-zinc-400 uppercase">
                      <Play size={14} className="text-zinc-900" /> Video Source
                    </label>
                  </div>

                  {/* File Upload part */}
                  <div
                    className={`${isFileUploadDisabled ? 'pointer-events-none opacity-40' : ''}`}
                  >
                    <SmartMediaUpload
                      label="Change Video File"
                      allowedFormats={['video/*']}
                      className="aspect-video"
                      onFileChange={(file, preview) => setVideoData({ file, preview })}
                      initialUrl={videoData.preview}
                    />
                  </div>

                  <div className="relative flex items-center py-1">
                    <div className="grow border-t border-zinc-100"></div>
                    <span className="mx-4 text-[10px] font-bold text-zinc-300 uppercase">OR</span>
                    <div className="grow border-t border-zinc-100"></div>
                  </div>

                  {/* URL Input part */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black tracking-[2px] text-zinc-400 uppercase">
                      <LinkIcon size={14} className="text-zinc-900" /> Video URL
                    </label>
                    <input
                      type="text"
                      disabled={isUrlDisabled}
                      placeholder={
                        isUrlDisabled
                          ? 'Clear selected file to use URL'
                          : 'Paste YouTube/Vimeo link...'
                      }
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm font-medium transition-all outline-none focus:border-black focus:bg-white disabled:cursor-not-allowed"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    />
                  </div>
                </div>

                {/* 2. Thumbnail Edit Section */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black tracking-[2px] text-zinc-400 uppercase">
                    <ImageIcon size={14} className="text-zinc-900" /> Cover Thumbnail
                  </label>
                  <SmartMediaUpload
                    label="Change Thumbnail"
                    allowedFormats={['image/*']}
                    className="aspect-video"
                    onFileChange={(file, preview) => setImageData({ file, preview })}
                    initialUrl={imageData.preview}
                  />
                </div>
              </div>

              {/* Form Details Section */}
              <div className="mt-12 space-y-8 border-t border-zinc-100 pt-10">
                <div className="space-y-2">
                  <label className="text-xs font-black tracking-widest text-zinc-500 uppercase">
                    Video Title
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-6 py-4 text-sm font-medium transition-all outline-none focus:border-black focus:bg-white"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-black tracking-widest text-zinc-500 uppercase">
                      Release Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-6 py-4 text-sm outline-none focus:bg-white"
                      value={formData.uploadDate}
                      onChange={(e) => setFormData({ ...formData, uploadDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black tracking-widest text-zinc-500 uppercase">
                      Visibility Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full cursor-pointer appearance-none rounded-2xl border border-zinc-200 bg-zinc-50/50 px-6 py-4 text-sm outline-none focus:bg-white"
                    >
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black tracking-widest text-zinc-500 uppercase">
                      Description
                    </label>
                    <TiptapEditor
                      value={formData.description}
                      onChange={(newContent) =>
                        setFormData((p) => ({ ...p, description: newContent }))
                      }
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black tracking-widest text-zinc-500 uppercase">
                      Transcription
                    </label>
                    <TiptapEditor
                      value={formData.transcription}
                      onChange={(newContent) =>
                        setFormData((p) => ({ ...p, transcription: newContent }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 border-t border-zinc-100 bg-zinc-50/50 px-10 py-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-xs font-black tracking-widest text-zinc-400 uppercase transition-colors hover:text-zinc-900"
              >
                DISCARD
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-3 rounded-2xl bg-black px-12 py-4 text-xs font-black tracking-[2px] text-white uppercase shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:bg-zinc-200"
              >
                {isUpdating && <Loader2 className="animate-spin" size={18} />}
                {isUpdating ? 'SAVING...' : 'UPDATE VIDEO'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoEditModal;
