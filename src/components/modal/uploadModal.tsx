'use client';
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CloudUpload, FileText, Loader2, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { joditConfig } from '@/utils/joditConfig';
import { toast } from 'react-toastify';
import { useCreateBlogMutation, useUpdateBlogMutation } from '../../../services/allApi';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface UploadModalProps {
  selectedBlog?: any | null;
  onCloseTrigger?: () => void;
  refetch: () => void;
}

export default function UploadModal({ selectedBlog, onCloseTrigger, refetch }: UploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    status: 'published' as 'published' | 'scheduled' | 'unpublished',
    date: '',
    description: '',
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const isLoading = isCreating || isUpdating;

  // Sync state when editing
  useEffect(() => {
    if (selectedBlog) {
      const postDate =
        selectedBlog.status === 'scheduled' ? selectedBlog.scheduledAt : selectedBlog.uploadDate;
      setFormState({
        title: selectedBlog.title || '',
        status: selectedBlog.status,
        date: postDate
          ? selectedBlog.status === 'scheduled'
            ? postDate.substring(0, 16)
            : postDate.split('T')[0]
          : '',
        description: selectedBlog.description || '',
      });
      setFilePreview(selectedBlog.coverImage || null);
      setIsOpen(true);
    }
  }, [selectedBlog]);

  const handleClose = () => {
    setIsOpen(false);
    setFormState({ title: '', status: 'published', date: '', description: '' });
    setCoverImage(null);
    setFilePreview(null);
    if (onCloseTrigger) onCloseTrigger();
  };

  const validateForm = () => {
    if (!formState.title.trim()) {
      toast.error('Title is required!');
      return false;
    }
    if (!formState.date) {
      toast.error('Please select a date!');
      return false;
    }
    if (!formState.description.trim()) {
      toast.error('Content is empty!');
      return false;
    }
    if (!selectedBlog && !coverImage) {
      toast.error('Please upload a cover image!');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    const utcDate = new Date(formState.date).toISOString();

    formData.append('title', formState.title);
    formData.append('description', formState.description);
    formData.append('status', formState.status);

    if (formState.status === 'scheduled') {
      formData.append('scheduledAt', utcDate);
    } else {
      formData.append('uploadDate', utcDate);
    }

    if (coverImage) formData.append('coverImage', coverImage);

    try {
      if (selectedBlog) {
        await updateBlog({ id: selectedBlog._id, data: formData }).unwrap();
        toast.success('Article updated!');
      } else {
        await createBlog({ data: formData }).unwrap();
        toast.success('Article published!');
      }
      refetch();
      handleClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <>
      {!selectedBlog && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-neutral-800"
        >
          <Plus size={18} /> Add New Blog
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-black/60 p-4 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-50 bg-white/90 px-8 py-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-black p-2.5 text-white shadow-xl shadow-black/20">
                  <FileText size={22} />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-800">
                  {selectedBlog ? 'Modify Article' : 'Create Article'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto bg-[#fcfcfc] p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(e) => setFormState((p) => ({ ...p, title: e.target.value }))}
                    className="w-full rounded border border-neutral-200 bg-white px-5 py-4 transition-all outline-none focus:border-black focus:ring-4 focus:ring-black/5"
                    placeholder="Enter blog title..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={formState.status}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, status: e.target.value as any }))
                      }
                      className="w-full cursor-pointer appearance-none rounded border border-neutral-200 bg-white px-5 py-4 font-bold text-neutral-700 outline-none focus:border-black"
                    >
                      {selectedBlog ? (
                        <>
                          <option value="scheduled">Scheduled</option>
                          <option value="published">Published</option>
                          <option value="unpublished">Unpublished</option>
                        </>
                      ) : (
                        <>
                          <option value="scheduled">Scheduled</option>
                          <option value="published">Published</option>
                        </>
                      )}
                    </select>
                    <Clock
                      className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-neutral-400"
                      size={18}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Date Input Based on Status */}
              <div className="space-y-2">
                <label className="ml-1 flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                  {formState.status === 'scheduled' ? <Clock size={14} /> : <Calendar size={14} />}
                  {formState.status === 'scheduled'
                    ? 'Scheduling Time (UTC)'
                    : 'Target Publication Date'}
                </label>
                <input
                  type={formState.status === 'scheduled' ? 'datetime-local' : 'date'}
                  value={formState.date}
                  onChange={(e) => setFormState((p) => ({ ...p, date: e.target.value }))}
                  className="w-full rounded border border-neutral-200 bg-white px-5 py-4 font-medium transition-all outline-none focus:border-black"
                />
              </div>

              {/* Editor Section */}
              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                  Main Content
                </label>
                <div className="overflow-hidden rounded border border-neutral-200 bg-white shadow-inner">
                  <JoditEditor
                    value={formState.description}
                    config={joditConfig}
                    onBlur={(newContent) =>
                      setFormState((p) => ({ ...p, description: newContent }))
                    }
                  />
                </div>
              </div>

              {/* Dynamic Image Upload Area */}
              <div className="space-y-3">
                <label className="ml-1 text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                  Cover Image
                </label>
                <label
                  htmlFor="file-upload-final"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      setCoverImage(file);
                      setFilePreview(URL.createObjectURL(file));
                    }
                  }}
                  className={`group relative flex min-h-[280px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-500 ${
                    isDragging
                      ? 'scale-[0.98] border-black bg-neutral-100'
                      : 'border-neutral-200 hover:border-neutral-400 hover:bg-white'
                  }`}
                >
                  <input
                    id="file-upload-final"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverImage(file);
                        setFilePreview(URL.createObjectURL(file));
                      }
                    }}
                  />

                  {filePreview ? (
                    <div className="absolute inset-0 h-full w-full overflow-hidden">
                      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl">
                        <Image
                          src={filePreview}
                          alt="Preview"
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[3px] transition-all group-hover:opacity-100">
                          <span className="bold rounded-full bg-white px-8 py-3 text-[10px] tracking-widest uppercase shadow-2xl">
                            Replace Media
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-12">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-neutral-100 bg-neutral-50 shadow-sm transition-all duration-500 group-hover:scale-105">
                        <CloudUpload className="text-neutral-400" size={36} />
                      </div>
                      <p className="text-sm font-bold text-neutral-800">
                        Drag & Drop or Click to Upload
                      </p>
                      <p className="mt-2 text-xs font-medium text-neutral-400">
                        Supports High-res PNG, JPG, WebP
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-4 border-t border-neutral-50 bg-white px-8 py-6">
              <button
                disabled={isLoading}
                onClick={handleClose}
                className="rounded-2xl px-6 py-3 text-sm font-bold text-neutral-400 transition-all hover:bg-neutral-50 hover:text-neutral-800"
              >
                Discard
              </button>
              <button
                disabled={isLoading}
                onClick={handleSave}
                className="flex min-w-[200px] items-center justify-center gap-3 rounded-[22px] bg-black px-10 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-2xl shadow-black/20 transition-all hover:bg-neutral-800 active:scale-95 disabled:bg-neutral-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Syncing...
                  </>
                ) : selectedBlog ? (
                  'Update Blog'
                ) : (
                  'Publish Blog'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
