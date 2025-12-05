"use client";

import { X, Calendar, User, File, Eye, Clock, Tag } from "lucide-react";
import Image from "next/image";
import yoga from "@/assets/image/yoga.jpg";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 md:p-5">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] p-8 font-poppins relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-poppins font-semibold text-gray-900">
            Blog Details
          </h2>
          <p className="text-sm font-poppins text-gray-500 mt-1">
            View blog information and content
          </p>
        </div>

        {/* Blog Content */}
        <div className="space-y-6">
          {/* Header with Title and Status Badge */}
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentBlog.title}
            </h1>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium text-white ${
                currentBlog.status === true ? "bg-red-400" : "bg-black"
              }`}
            >
              {currentBlog.status === true ? "Published" : "Unpublished"}
            </span>
          </div>

          {/* Author and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Author</p>
                <p className="text-gray-900 font-medium">
                  {currentBlog.author}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Publish Date
                </p>
                <p className="text-gray-900 font-medium">
                  {currentBlog.status === true
                    ? formatDate(currentBlog.updatedAt) // Show updated date if status is "Published"
                    : "Not Published"}{" "}
                  {/* Show "Not Published" if status is not "Published" */}
                </p>
              </div>
            </div>
          </div>

          {/* Blog Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Read Time</p>
                <p className="text-gray-900 font-medium">
                  {currentBlog.readTime}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Eye className="w-5 h-5 text-gray-600" />
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Tag className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-gray-900 font-medium">
                  {currentBlog.category}
                </p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-3">
            <label className="text-sm font-poppins font-medium text-gray-700 block">
              Featured Image
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Image
                src={currentBlog.coverImage}
                alt={currentBlog.title}
                width={1280} // adjust based on layout
                height={320} // matches h-80 (20rem)
                className="w-full h-64 md:h-80 object-cover" // maintain aspect ratio using the parent container
                layout="responsive" // Ensures the aspect ratio is preserved
              />

              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <File className="w-4 h-4" />
                  <span>Featured blog image</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-sm font-poppins font-medium text-gray-700 block">
              Blog Content
            </label>
            <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 rounded-lg p-6">
              <p className="leading-relaxed mb-4">{currentBlog.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-5 py-2 font-poppins rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
