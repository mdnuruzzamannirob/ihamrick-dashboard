"use client";

import {
  Eye,
  X,
  Calendar,
  User,
  Play,
  Download,
  Clock,
  File,
} from "lucide-react";
import { useState } from "react";

interface Video {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  status: "Published" | "Unpublished";
  description: string;
  videoUrl: string;
  duration: string;
  fileSize: string;
  category: string;
  resolution: string;
  thumbnail: string;
}

interface VideoViewModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  video?: Video | null;
}

export function VideoViewModal({
  isOpen,
  onClose,
  video,
}: VideoViewModalProps) {
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Default video data
  const defaultVideo: Video = {
    id: "1",
    title: "Healthy Living Happier Life",
    author: "Dr. Sarah Johnson",
    publishDate: "2025-10-11",
    status: "Published",
    description:
      "A healthy life isn't just about eating greens or hitting the gym — it's about cultivating habits that nourish your body, mind, and soul. In this video, we explore how small lifestyle shifts can lead to lasting happiness. From mindful mornings to joyful movement, discover practical ways to feel more energized, balanced, and fulfilled every day. Because when you care for your health, happiness naturally follows.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "15:42",
    fileSize: "125.8 MB",
    category: "Health & Wellness",
    resolution: "1080p HD",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
  };

  const currentVideo = video || defaultVideo;

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
        aria-label="View Video"
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
                Video Details
              </h2>
              <p className="text-sm font-poppins text-gray-500 mt-1">
                View video information and content
              </p>
            </div>

            {/* Video Content */}
            <div className="space-y-6">
              {/* Header with Title and Status Badge */}
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentVideo.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentVideo.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentVideo.status}
                </span>
              </div>

              {/* Author and Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Creator</p>
                    <p className="text-gray-900 font-medium">
                      {currentVideo.author}
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
                      {formatDate(currentVideo.publishDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Video Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Duration
                    </p>
                    <p className="text-gray-900 font-medium">
                      {currentVideo.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Play className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Resolution
                    </p>
                    <p className="text-gray-900 font-medium">
                      {currentVideo.resolution}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-sm">📁</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Category
                    </p>
                    <p className="text-gray-900 font-medium">
                      {currentVideo.category}
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Video */}
              <div className="space-y-3">
                <label className="text-sm font-poppins font-medium text-gray-700 block">
                  Featured Video
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-black">
                  <video
                    src={currentVideo.videoUrl}
                    controls
                    className="w-full h-64 md:h-80 object-contain bg-black"
                    poster={currentVideo.thumbnail}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Video Player</span>
                  <span>{currentVideo.fileSize}</span>
                </div>
              </div>

              {/* Download Section */}
              <div className="space-y-3">
                <label className="text-sm font-poppins font-medium text-gray-700 block">
                  Download Options
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <File className="w-8 h-8 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {currentVideo.title}.mp4
                        </p>
                        <p className="text-xs text-gray-500">
                          HD Quality • {currentVideo.fileSize}
                        </p>
                        <button className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>Download HD</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <File className="w-8 h-8 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {currentVideo.title}_720p.mp4
                        </p>
                        <p className="text-xs text-gray-500">
                          Standard Quality • 68.3 MB
                        </p>
                        <button className="mt-2 text-green-600 text-sm font-medium hover:text-green-700 transition-colors flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>Download 720p</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-poppins font-medium text-gray-700 block">
                  Video Description
                </label>
                <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 rounded-lg p-6">
                  <p className="leading-relaxed">{currentVideo.description}</p>
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
