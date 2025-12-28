'use client';

import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Crop as CropIcon,
  Play,
  Calendar,
  FileText,
  Check,
  Edit3,
  Image as ImageIcon,
  RotateCcw,
  Loader2,
  Pencil,
} from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Cropper from 'react-easy-crop';
import { toast } from 'react-toastify';
import { useUpdateVideoMutation } from '../../../services/allApi';
import { joditConfig } from '@/utils/joditConfig';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

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
  });

  // Media States
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState('');

  // Thumbnail/Crop States
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [finalThumbnailPreview, setFinalThumbnailPreview] = useState<string>('');
  const [finalBlob, setFinalBlob] = useState<Blob | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const ASPECT_RATIO = 16 / 9;

  // Initialize data when modal opens
  useEffect(() => {
    if (video && isModalOpen) {
      setFormData({
        title: video.title || '',
        uploadDate: video.uploadDate || '',
        status: video.status === 'published' || video.status === true ? 'published' : 'unpublished',
        description: video.description || '',
        transcription: video.transcription || '',
      });
      setVideoPreview(video.signedUrl || video.videoUrl || '');
      setFinalThumbnailPreview(video.thumbnailUrl || '');
    }
  }, [video, isModalOpen]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const saveCrop = async () => {
    try {
      if (!originalImage || !croppedAreaPixels) return;
      const image = new window.Image();
      image.src = originalImage;
      await new Promise((res) => (image.onload = res));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx?.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setFinalBlob(blob);
            setFinalThumbnailPreview(URL.createObjectURL(blob));
            setShowCropper(false);
          }
        },
        'image/jpeg',
        0.95,
      );
    } catch {
      toast.error('Crop failed!');
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return toast.error('Title is required');

    const payload = new FormData();
    const utcDate = new Date(formData.uploadDate).toISOString();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('transcription', formData.transcription);
    payload.append('uploadDate', utcDate);
    payload.append('status', formData.status);

    if (videoFile) payload.append('video', videoFile);
    if (finalBlob) payload.append('coverImage', finalBlob);

    try {
      await updateVideo({ id: video._id, data: payload as any }).unwrap();
      toast.success('Video updated successfully');
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Update failed');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
      >
        <Pencil size={16} />
      </button>

      {isModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4 backdrop-blur-sm duration-200">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-8 py-5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                  Edit Video Details
                </h2>
                <p className="text-[13px] font-medium text-gray-500">
                  Update your video content and configuration.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-black"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto p-6">
              {/* Media Upload Row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Video Preview */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    <Play size={12} /> Video Content
                  </label>
                  <div className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-gray-400">
                    {videoPreview ? (
                      <div className="relative h-full w-full">
                        <video
                          src={videoPreview}
                          controls
                          className="h-full w-full bg-black object-contain"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute top-3 right-3 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-[11px] font-bold text-black opacity-0 shadow-lg backdrop-blur-sm transition-all group-hover:opacity-100 hover:scale-105 hover:bg-white"
                        >
                          <Edit3 size={12} /> CHANGE VIDEO
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex flex-col items-center justify-center text-gray-400"
                      >
                        <Loader2 className="animate-spin" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="video/*"
                    onChange={handleVideoChange}
                  />
                </div>

                {/* Thumbnail Preview */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    <ImageIcon size={12} /> Thumbnail
                  </label>
                  <div className="group relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-gray-400">
                    {finalThumbnailPreview ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={finalThumbnailPreview}
                          alt="Cover"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-[2px] transition-all group-hover:opacity-100">
                          {originalImage && (
                            <button
                              type="button"
                              onClick={() => setShowCropper(true)}
                              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-[11px] font-bold text-black transition-all hover:scale-105"
                            >
                              <CropIcon size={14} /> RESIZE
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => thumbnailInputRef.current?.click()}
                            className="flex items-center gap-2 rounded-lg border border-white/20 bg-zinc-800 px-5 py-2 text-[11px] font-bold text-white transition-all hover:scale-105 hover:bg-black"
                          >
                            <RotateCcw size={14} /> CHANGE
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center text-gray-400"
                      >
                        <ImageIcon size={24} className="mb-2 opacity-40" />
                        <span className="text-xs font-semibold">Select Cover Image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6 border-t border-gray-100 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600">Video Title</label>
                  <input
                    type="text"
                    className="w-full rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm ring-gray-100 transition-all outline-none focus:bg-white focus:ring-2"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <Calendar size={14} /> Release Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-gray-100 disabled:opacity-50"
                      value={formData.uploadDate}
                      onChange={(e) => setFormData({ ...formData, uploadDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600">Content Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full cursor-pointer rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-gray-100"
                    >
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <FileText size={14} /> Description
                  </label>
                  <JoditEditor
                    value={formData.description}
                    config={joditConfig}
                    onBlur={(v) => setFormData({ ...formData, description: v })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600">Transcription</label>
                  <JoditEditor
                    value={formData.transcription}
                    config={joditConfig}
                    onBlur={(v) => setFormData({ ...formData, transcription: v })}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 p-5 px-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 text-[11px] font-black tracking-widest text-gray-400 uppercase transition-colors hover:text-gray-700"
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2 rounded-xl bg-black px-10 py-3 text-xs font-bold text-white shadow-lg shadow-gray-200 transition-all hover:bg-gray-800 disabled:bg-gray-200"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check size={14} />}
                {isUpdating ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CROP OVERLAY --- */}
      {showCropper && originalImage && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex flex-col bg-gray-950 duration-300">
          <div className="flex items-center justify-between bg-gray-950/50 p-5 text-white backdrop-blur-md">
            <div className="flex items-center gap-3 text-sm font-bold tracking-tight uppercase">
              <CropIcon size={16} className="text-gray-400" /> Adjust Thumbnail (16:9)
            </div>
            <button
              onClick={() => setShowCropper(false)}
              className="rounded-full p-2 hover:bg-white/10"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative flex-1">
            <Cropper
              image={originalImage}
              crop={crop}
              zoom={zoom}
              zoomSpeed={0.2}
              aspect={ASPECT_RATIO}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="flex flex-col items-center gap-6 border-t border-white/10 bg-gray-950 p-8">
            <div className="flex w-full max-w-sm items-center gap-6 text-white">
              <span className="text-[10px] font-bold tracking-widest opacity-30">ZOOM</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-800 accent-white"
              />
              <span className="font-mono text-[10px] opacity-30">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCropper(false)}
                className="px-8 py-2 text-[11px] font-bold tracking-widest text-white/50 hover:text-white"
              >
                CANCEL
              </button>
              <button
                onClick={saveCrop}
                className="rounded-xl bg-white px-12 py-3 text-[11px] font-black tracking-widest text-black shadow-2xl transition-all hover:bg-gray-100"
              >
                SAVE CROP
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoEditModal;
