'use client';

import { X, Calendar, User, File, Eye, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
interface Blog {
  id: string | number;
  title: string;
  author: string;
  updatedAt: string;
  status: boolean;
  description: string;
  featuredImage: string;
  readTime: string;
  category: string;
  tags: string[];
  coverImage: string;
  views: number;
}

interface ViewBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
}

export function ViewBlogModal({ isOpen, onClose, blog }: ViewBlogModalProps) {
  if (!isOpen || !blog) return null;

  const currentBlog = blog;
  console.log(currentBlog);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
          <h2 className="font-poppins text-xl font-semibold text-gray-900">Blog Details</h2>
          <p className="font-poppins mt-1 text-sm text-gray-500">
            View blog information and content
          </p>
        </div>

        {/* Blog Content */}
        <div className="space-y-6">
          {/* Header with Title and Status Badge */}
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{currentBlog.title}</h1>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium text-white ${
                currentBlog.status === true ? 'bg-red-400' : 'bg-black'
              }`}
            >
              {currentBlog.status === true ? 'Published' : 'Unpublished'}
            </span>
          </div>

          {/* Author and Date Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Author</p>
                <p className="font-medium text-gray-900">{currentBlog.author}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Publish Date</p>
                <p className="font-medium text-gray-900">
                  {currentBlog.status === true
                    ? formatDate(currentBlog.updatedAt) // Show updated date if status is "Published"
                    : 'Not Published'}{' '}
                  {/* Show "Not Published" if status is not "Published" */}
                </p>
              </div>
            </div>
          </div>

          {/* Blog Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Read Time</p>
                <p className="font-medium text-gray-900">{currentBlog.readTime}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <Eye className="h-5 w-5 text-gray-600" />
            </div>

            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <Tag className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="font-medium text-gray-900">{currentBlog.category}</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-3">
            <label className="font-poppins block text-sm font-medium text-gray-700">
              Featured Image
            </label>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Image
                src={currentBlog.coverImage}
                alt={currentBlog.title}
                width={1280} // adjust based on layout
                height={320} // matches h-80 (20rem)
                className="h-64 w-full object-cover md:h-80" // maintain aspect ratio using the parent container
                layout="responsive" // Ensures the aspect ratio is preserved
              />

              <div className="border-t border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <File className="h-4 w-4" />
                  <span>Featured blog image</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="font-poppins block text-sm font-medium text-gray-700">
              Blog Content
            </label>
            <div className="prose prose-sm max-w-none rounded-lg bg-gray-50 p-6 text-gray-700">
              {/* Render HTML content using dangerouslySetInnerHTML */}
              <div
                className="mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentBlog.description }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end border-t border-gray-200 pt-4">
            <button
              onClick={onClose}
              className="font-poppins rounded-lg px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
