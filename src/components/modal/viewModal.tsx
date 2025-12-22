'use client';

import { X, Calendar, User, Eye, Clock, Tag } from 'lucide-react';
import Image from 'next/image';

interface Blog {
  _id: string | number;
  title: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  status: string;
  description: string;
  coverImage: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  views?: number;
}

interface ViewBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
}

export function ViewBlogModal({ isOpen, onClose, blog }: ViewBlogModalProps) {
  if (!isOpen || !blog) return null;

  const currentBlog = blog;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isScheduled = currentBlog.status === 'scheduled';
  const dateLabel = isScheduled ? 'Scheduled Date' : 'Upload Date';
  const displayDate = isScheduled
    ? currentBlog.scheduledAt || currentBlog.updatedAt
    : currentBlog.createdAt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-5">
      <div
        className="font-poppins relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 transition-colors hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Blog Details</h2>
          <p className="mt-1 text-sm text-gray-500">View blog information and content</p>
        </div>

        {/* Blog Content */}
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{currentBlog.title}</h1>
            <span
              className={`inline-block shrink-0 rounded-full px-3 py-1 text-xs font-bold tracking-wider text-white uppercase ${
                currentBlog.status === 'published'
                  ? 'bg-black'
                  : currentBlog.status === 'scheduled'
                    ? 'bg-blue-500'
                    : 'bg-red-500'
              }`}
            >
              {currentBlog.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Author</p>
                <p className="font-medium text-gray-900">{currentBlog.author || 'Admin'}</p>
              </div>
            </div>

            {/* Dynamic Date Field */}
            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">{dateLabel}</p>
                <p className="font-medium text-gray-900">{formatDate(displayDate)}</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Read Time</p>
                <p className="font-medium text-gray-900">{currentBlog.readTime || '5 min'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <Eye className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Views</p>
                <p className="font-medium text-gray-900">{currentBlog.views || 0}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <Tag className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="font-medium text-gray-900">{currentBlog.category || 'General'}</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200">
              <Image
                src={currentBlog.coverImage}
                alt={currentBlog.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Blog Content</label>
            <div className="prose prose-sm max-w-none rounded-xl bg-gray-50 p-6 text-gray-700">
              <div
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentBlog.description }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t border-gray-100 pt-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-neutral-100 px-6 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-black hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
