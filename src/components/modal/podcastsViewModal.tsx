"use client";

import { Eye, X, Calendar, User, Play, Download } from "lucide-react";
import { useState } from "react";

interface Podcast {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  status: "Published" | "Unpublished";
  description: string;
  featuredVideo: string;
  duration: string;
  fileSize: string;
  category: string;
}

interface PodcastsViewModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  podcast?: Podcast | null;
}

export function PodcastsViewModal({
  isOpen,
  onClose,
  podcast,
}: PodcastsViewModalProps) {
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Default podcast data
  const defaultPodcast: Podcast = {
    id: "1",
    title: "Healthy Living Happier Life",
    author: "Dr. Sarah Johnson",
    publishDate: "2025-10-11",
    status: "Published",
    description:
      "A healthy life isn't just about eating greens or hitting the gym — it's about cultivating habits that nourish your body, mind, and soul. In this podcast, we explore how small lifestyle shifts can lead to lasting happiness. From mindful mornings to joyful movement, discover practical ways to feel more energized, balanced, and fulfilled every day. Because when you care for your health, happiness naturally follows.",
    featuredVideo:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "24:35",
    fileSize: "45.2 MB",
    category: "Health & Wellness",
  };

  const currentPodcast = podcast || defaultPodcast;

  const handleClose = () => {
    setViewModalOpen(false);
    onClose?.();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <button
        onClick={() => setViewModalOpen(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
        aria-label="View Podcast"
      >
        <Eye className="h-4 w-4" />
      </button>

      {(viewModalOpen || isOpen) && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 md:p-5">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] p-8 font-poppins relative overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-xl font-poppins font-semibold text-gray-900">
                Podcast Details
              </h2>
              <p className="text-sm font-poppins text-gray-500 mt-1">
                View podcast information and content
              </p>
            </div>

            {/* Podcast Content */}
            <div className="space-y-6">
              {/* Header with Title and Status Badge */}
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentPodcast.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentPodcast.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentPodcast.status}
                </span>
              </div>

              {/* Author and Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Host/Author
                    </p>
                    <p className="text-gray-900 font-medium">
                      {currentPodcast.author}
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
                      {formatDate(currentPodcast.publishDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Category and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-sm">📁</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Category
                    </p>
                    <p className="text-gray-900 font-medium">
                      {currentPodcast.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Play className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Duration
                    </p>
                    <p className="text-gray-900 font-medium">
                      {currentPodcast.duration}
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Video/Player */}
              <div className="space-y-3">
                <label className="text-sm font-poppins font-medium text-gray-700 block">
                  Featured Podcast
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-black">
                  <video
                    src={currentPodcast.featuredVideo}
                    controls
                    className="w-full h-64 md:h-80 object-contain bg-black"
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231f2937'/%3E%3Ccircle cx='200' cy='150' r='40' fill='%236b7280'/%3E%3Cpolygon points='180,130 180,170 220,150' fill='%23ffffff'/%3E%3C/svg%3E"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Podcast Episode</span>
                  <span>{currentPodcast.fileSize}</span>
                </div>
              </div>

              {/* Download Section */}
              <div className="space-y-3">
                <label className="text-sm font-poppins font-medium text-gray-700 block">
                  Download Options
                </label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Download className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {currentPodcast.title}.mp3
                        </p>
                        <p className="text-xs text-gray-500">
                          Audio File • {currentPodcast.fileSize}
                        </p>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-poppins font-medium text-gray-700 block">
                  Episode Description
                </label>
                <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 rounded-lg p-6">
                  <p className="leading-relaxed">
                    {currentPodcast.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleClose}
                  className="px-5 py-2 font-poppins rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
