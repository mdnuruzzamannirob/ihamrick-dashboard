'use client';

import { useState } from 'react';
import { Upload, X, Play, FileText, Check, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUploadVideoMutation } from '../../../services/allApi';
import { SmartMediaUpload } from '../SmartMediaUpload';
import { fromZonedTime } from 'date-fns-tz';
import TiptapEditor from '../editor/TiptapEditor';

const VideoUploadModal = ({ refetch }: { refetch: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadVideo, { isLoading }] = useUploadVideoMutation();

  // Form States
  const [formData, setFormData] = useState({
    title: '',
    date: '',
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

  const handleLinkThumbnail = async (url: string) => {
    setFormData((prev) => ({ ...prev, videoUrl: url }));
    if (!url.trim()) return;

    const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    if (ytMatch && ytMatch[2].length === 11) {
      const thumbUrl = `https://img.youtube.com/vi/${ytMatch[2]}/maxresdefault.jpg`;
      try {
        const res = await fetch(thumbUrl);
        const blob = await res.blob();
        setImageData({
          file: new File([blob], 'yt-thumb.jpg', { type: 'image/jpeg' }),
          preview: thumbUrl,
        });
        toast.info('YouTube thumbnail captured!');
      } catch {
        setImageData((prev) => ({
          ...prev,
          preview: `https://img.youtube.com/vi/${ytMatch[2]}/hqdefault.jpg`,
        }));
      }
      return;
    }

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      try {
        const res = await fetch(`https://vimeo.com/api/v2/video/${vimeoMatch[1]}.json`);
        const data = await res.json();
        const thumbUrl = data[0].thumbnail_large;
        const imgRes = await fetch(thumbUrl);
        const blob = await imgRes.blob();
        setImageData({
          file: new File([blob], 'vimeo.jpg', { type: 'image/jpeg' }),
          preview: thumbUrl,
        });
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
      const video = document.createElement('video');
      video.src = url;
      video.crossOrigin = 'anonymous';
      video.currentTime = 1.5;
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'video-frame.jpg', { type: 'image/jpeg' });
            setImageData({ file, preview: URL.createObjectURL(blob) });
            toast.info('Thumbnail generated from video!');
          }
        }, 'image/jpeg');
      };
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      status: 'published',
      description: '',
      transcription: '',
      videoUrl: '',
    });
    setVideoData({ file: null, preview: '' });
    setImageData({ file: null, preview: '' });
  };

  const handleSubmit = async () => {
    if (!videoData.file && !formData.videoUrl.trim()) {
      return toast.error('Please upload a video file or provide a video URL');
    }

    if (videoData.file && formData.videoUrl.trim()) {
      return toast.error('Please provide either a video file or a URL, not both');
    }

    if (!imageData.file) return toast.error('Please upload a thumbnail');
    if (formData.status === 'published' && !formData.date)
      return toast.error('Upload date is required');
    if (!formData.title.trim()) return toast.error('Title is required');

    const payload = new FormData();

    const utcDate = (() => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date();

      let localDateStr = formData.date;

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
    payload.append('coverImage', imageData.file as Blob);
    if (utcDate) payload.append('uploadDate', utcDate);

    if (videoData.file) {
      payload.append('video', videoData.file);
    } else if (formData.videoUrl.trim()) {
      payload.append('videoUrl', formData.videoUrl.trim());
    }

    try {
      await uploadVideo(payload).unwrap();
      toast.success('Video uploaded successfully');
      setIsModalOpen(false);
      refetch();
      resetForm();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || 'Upload failed.');
    }
  };

  const isUrlDisabled = !!videoData.file;
  const isFileUploadDisabled = formData.videoUrl.trim().length > 0;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800"
      >
        <Upload size={18} /> Upload Video
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-md">
          <div className="z-10 flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-4xl border border-white/10 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-10 py-5">
              <h2 className="text-2xl font-black tracking-tight text-zinc-900">
                Publish New Video
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-zinc-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-[10px] font-black tracking-[2px] text-zinc-400 uppercase">
                      <Play size={14} className="text-zinc-900" /> Video File
                    </label>
                    <p className="text-[10px] text-zinc-400 italic">Upload a local file</p>
                  </div>

                  <div
                    className={`${isFileUploadDisabled ? 'pointer-events-none opacity-40' : ''}`}
                  >
                    <SmartMediaUpload
                      label="Drop Video File"
                      allowedFormats={['video/*']}
                      className="aspect-video"
                      onFileChange={(file: any, preview: any) => setVideoData({ file, preview })}
                      initialUrl={videoData.preview}
                    />
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="grow border-t border-zinc-100"></div>
                    <span className="mx-4 shrink text-[10px] font-bold text-zinc-300 uppercase">
                      OR
                    </span>
                    <div className="grow border-t border-zinc-100"></div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black tracking-[2px] text-zinc-400 uppercase">
                      <LinkIcon size={14} className="text-zinc-900" /> Video URL
                    </label>
                    <input
                      type="text"
                      disabled={isUrlDisabled}
                      placeholder={
                        isUrlDisabled ? 'Disable: Video file selected' : 'Paste YouTube link...'
                      }
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm font-medium transition-all outline-none focus:border-black focus:bg-white disabled:cursor-not-allowed"
                      value={formData.videoUrl}
                      onChange={(e) => handleLinkThumbnail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-[10px] font-black tracking-[2px] text-zinc-400 uppercase">
                      <FileText size={14} className="text-zinc-900" /> Cover Thumbnail
                    </label>
                    <p className="text-[10px] text-zinc-400 italic">High-res image recommended</p>
                  </div>
                  <SmartMediaUpload
                    label="Drop Cover Image"
                    allowedFormats={['image/*']}
                    className="aspect-video"
                    onFileChange={(file: any, preview: any) => setImageData({ file, preview })}
                    initialUrl={imageData.preview}
                  />
                </div>
              </div>

              <div className="mt-12 space-y-8 border-t border-zinc-100 pt-10">
                <div className="space-y-2">
                  <label className="text-xs font-black tracking-widest text-zinc-500 uppercase">
                    Video Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a catchy title..."
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
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

                <div className="grid grid-cols-1 gap-8">
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

            <div className="flex items-center justify-end gap-4 border-t border-zinc-100 bg-zinc-50/50 px-10 py-5">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="px-6 py-2 text-xs font-black tracking-widest text-zinc-400 uppercase transition-colors hover:text-zinc-900"
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-3 rounded-2xl bg-black px-12 py-4 text-xs font-black tracking-[2px] text-white uppercase shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:bg-zinc-200 disabled:text-zinc-400"
              >
                {isLoading ? (
                  'UPLOADING...'
                ) : (
                  <>
                    <Check size={18} /> Publish Video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoUploadModal;
