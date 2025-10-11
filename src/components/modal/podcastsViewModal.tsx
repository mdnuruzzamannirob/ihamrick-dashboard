"use client";

import { Eye, X } from "lucide-react";
import { useState } from "react";

interface ViewBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: {
    title: string;
    status: "Published" | "Unpublished";
    // description: string;
  } | null;
}

export function PodcastsViewModal() {
  const [viewModalOpen, setViewModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setViewModalOpen(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
        aria-label="View"
      >
        <Eye className="h-4 w-4" />
      </button>
      {viewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl md:p-8">
            {/* Close Button */}
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-neutral-600 transition-colors hover:bg-neutral-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <h2 className="mb-6 text-2xl font-poppins font-bold text-neutral-900 md:text-3xl">
              Podcasts Details
            </h2>

            {/* Blog Content */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <h3 className="mb-2 text-sm font-poppins font-semibold text-neutral-600">
                  Title
                </h3>
                <p className="text-base font-poppins text-neutral-900 md:text-lg">
                  Healthy Living Happier Life
                </p>
              </div>

              {/* Status */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-600">
                  Status
                </h3>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-poppins font-medium text-white bg-red-400`}
                >
                  Published
                </span>
              </div>
              {/* Date */}
              <div>
                <h3 className="mb-2 text-sm font-poppins font-semibold text-neutral-600">
                  Date
                </h3>
                <p className="text-base font-poppins text-neutral-900 md:text-lg">
                  October 11, 2025
                </p>
              </div>

              {/* Featured Video */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-600">
                  Featured Video
                </h3>
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  controls
                  className="w-full h-64 object-cover rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-600">
                  Description
                </h3>
                <p className="text-sm text-justify font-poppins leading-relaxed text-neutral-700 md:text-base">
                  A healthy life isn't just about eating greens or hitting the
                  gym — it's about cultivating habits that nourish your body,
                  mind, and soul. In this post, we explore how small lifestyle
                  shifts can lead to lasting happiness. From mindful mornings to
                  joyful movement, discover practical ways to feel more
                  energized, balanced, and fulfilled every day. Because when you
                  care for your health, happiness naturally follows.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg font-poppins bg-neutral-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
