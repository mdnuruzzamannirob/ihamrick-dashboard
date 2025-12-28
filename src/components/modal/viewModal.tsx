'use client';

import { dateFormatter } from '@/utils/dateFormatter';
import { X, Calendar, User, Music, Headphones } from 'lucide-react';

interface ViewBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: any;
}

export function ViewBlogModal({ isOpen, onClose, blog }: ViewBlogModalProps) {
  if (!isOpen || !blog) return null;

  const audioSrc = blog.audioSignedUrl || blog.audioUrl;
  const isScheduled = blog.status === 'scheduled';
  const dateLabel = isScheduled ? 'Scheduled Date' : 'Upload Date';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm md:p-5">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="font-poppins relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-8 border-b border-neutral-100 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Blog Details</h2>
              <p className="mt-1 text-sm text-neutral-500">
                View complete information regarding this post
              </p>
            </div>
            <span
              className={`inline-block shrink-0 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-md ${
                blog.status === 'published'
                  ? 'bg-black'
                  : blog.status === 'scheduled'
                    ? 'bg-blue-600'
                    : 'bg-red-500'
              }`}
            >
              {blog.status}
            </span>
          </div>
        </div>

        {/* Blog Content */}
        <div className="space-y-8">
          {/* Title Area */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Title
            </label>
            <h1 className="text-xl font-medium text-neutral-800 md:text-2xl">{blog.title}</h1>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <User className="h-5 w-5 text-neutral-600" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider text-neutral-400 uppercase">
                  Author
                </p>
                <p className="font-semibold text-neutral-900">{blog.author || 'Admin'}</p>
              </div>
            </div>

            {/* Dynamic Date Field */}
            <div className="flex items-center space-x-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <Calendar className="h-5 w-5 text-neutral-600" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider text-neutral-400 uppercase">
                  {dateLabel}
                </p>
                <p className="font-semibold text-neutral-900">
                  {' '}
                  {blog?.status === 'scheduled'
                    ? dateFormatter(blog?.scheduledAt)
                    : dateFormatter(blog.uploadDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Audio Player Section (Replaced Image) */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
              <Music size={14} /> Audio File
            </label>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-10">
              {audioSrc ? (
                <div className="w-full max-w-lg space-y-4">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-xl shadow-black/20">
                      <Headphones size={32} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="truncate px-4 text-sm font-medium text-neutral-600">
                      {blog.audioFileName ? blog.audioFileName.split('/').pop() : 'Audio Track'}
                    </p>
                  </div>
                  <audio controls src={audioSrc} className="h-12 w-full rounded-lg" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-400">
                  <Music size={40} className="opacity-20" />
                  <p className="text-sm font-medium">No audio file attached</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="block text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Description
            </label>
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
              <div
                className="prose prose-sm max-w-none leading-relaxed font-normal text-gray-600"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="rounded-xl bg-neutral-100 px-8 py-3 text-sm font-bold text-neutral-600 transition-all hover:bg-black hover:text-white hover:shadow-lg"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
