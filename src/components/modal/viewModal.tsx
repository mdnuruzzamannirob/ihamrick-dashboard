"use client";

import { X, Calendar, User, File, Eye, Clock, Tag } from "lucide-react";

interface Blog {
  id: string | number;
  title: string;
  author: string;
  publishDate: string;
  status: "Published" | "Unpublished";
  description: string;
  featuredImage: string;
  readTime: string;
  category: string;
  tags: string[];
  views: number;
}

interface ViewBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
}

export function ViewBlogModal({ isOpen, onClose, blog }: ViewBlogModalProps) {
  if (!isOpen || !blog) return null;

  // Default blog data with enhanced fields
  const defaultBlog: Blog = {
    id: "1",
    title: "Healthy Living Happier Life",
    author: "Dr. Sarah Johnson",
    publishDate: "2025-10-11",
    status: "Published",
    description:
      "A healthy life isn't just about eating greens or hitting the gym — it's about cultivating habits that nourish your body, mind, and soul. In this post, we explore how small lifestyle shifts can lead to lasting happiness. From mindful mornings to joyful movement, discover practical ways to feel more energized, balanced, and fulfilled every day. Because when you care for your health, happiness naturally follows.",
    featuredImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    readTime: "5 min read",
    category: "Health & Wellness",
    tags: ["Wellness", "Lifestyle", "Mindfulness", "Health"],
    views: 1247,
  };

  const currentBlog = blog || defaultBlog;

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
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentBlog.status === "Published"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {currentBlog.status}
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
                  {formatDate(currentBlog.publishDate)}
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
              <div>
                <p className="text-sm font-medium text-gray-500">Views</p>
                <p className="text-gray-900 font-medium">
                  {currentBlog.views.toLocaleString()}
                </p>
              </div>
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

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-sm font-poppins font-medium text-gray-700 block">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {currentBlog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-3">
            <label className="text-sm font-poppins font-medium text-gray-700 block">
              Featured Image
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={currentBlog.featuredImage}
                alt={currentBlog.title}
                className="w-full h-64 md:h-80 object-cover"
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

              <h4 className="font-semibold text-gray-900 mb-2">
                Key Takeaways:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Cultivate daily habits that nourish body and mind</li>
                <li>Incorporate mindful practices into your routine</li>
                <li>Find joy in movement and physical activity</li>
                <li>Create balance for long-term well-being</li>
              </ul>

              <p className="leading-relaxed mt-4">
                Remember that small, consistent changes often lead to the most
                significant improvements in overall health and happiness. Start
                with one habit today and build from there.
              </p>
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
