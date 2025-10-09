"use client";

import { X } from "lucide-react";

interface ViewBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: {
    title: string;
    status: "Published" | "Unpublished";
    // description: string;
  } | null;
}

export function ViewBlogModal({ isOpen, onClose, blog }: ViewBlogModalProps) {
  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-neutral-600 transition-colors hover:bg-neutral-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <h2 className="mb-6 text-2xl font-poppins font-bold text-neutral-900 md:text-3xl">
          Blog Details
        </h2>

        {/* Blog Content */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <h3 className="mb-2 text-sm font-poppins font-semibold text-neutral-600">
              Title
            </h3>
            <p className="text-base font-poppins text-neutral-900 md:text-lg">
              {blog.title}
            </p>
          </div>

          {/* Status */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-600">
              Status
            </h3>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-poppins font-medium text-white ${
                blog.status === "Published" ? "bg-red-400" : "bg-neutral-800"
              }`}
            >
              {blog.status}
            </span>
          </div>

          {/* Featured Image */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-600">
              Featured Image
            </h3>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
              alt="Person meditating peacefully in nature"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-600">
              Description
            </h3>
            <p className="text-sm font-poppins leading-relaxed text-neutral-700 md:text-base">
              A healthy life isn't just about eating greens or hitting the gym —
              it's about cultivating habits that nourish your body, mind, and
              soul. In this post, we explore how small lifestyle shifts can lead
              to lasting happiness. From mindful mornings to joyful movement,
              discover practical ways to feel more energized, balanced, and
              fulfilled every day. Because when you care for your health,
              happiness naturally follows.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg font-poppins bg-neutral-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
