"use client";

import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

interface UploadModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (data: {
    title: string;
    status: string;
    description: string;
    file?: File;
  }) => void;
  post: {
    id: number;
    title: string;
    status: "Published" | "Unpublished";
  } | null;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen = true,
  onClose = () => {},
  onSave = () => {},
  post,
}) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const editor = useRef(null);
  // Dynamically import JoditEditor only on client side
  const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
  });

  const config = {
    readonly: false,
    toolbar: true,
    height: 200,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "link",
    ],
  };

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSave = () => {
    onSave({
      title,
      status,
      description: "", // Empty since we're not using description state
      file: file || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 font-poppins">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-poppins">
                Title
              </label>
              <input
                type="text"
                value={post?.title || ""}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write the title.."
                className="w-full text-neutral-800 px-3 py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent font-poppins"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-poppins">
                Status
              </label>
              <div className="relative">
                <select
                  value={post?.status || status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-neutral-800 px-3 py-2 text-xs sm:text-base border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white font-poppins"
                >
                  <option value="Published">Published</option>
                  <option value="Unpublished">Unpublished</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path
                      d="M1 1L6 6L11 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-poppins">
              Description
            </label>
            <div className="border font-poppins text-xs text-neutral-800 border-gray-300 rounded-md overflow-hidden">
              <JoditEditor
                ref={editor}
                value={
                  post?.id
                    ? "A healthy life isn't just about eating greens or hitting the gym — it's about cultivating habits that nourish your body, mind, and soul. In this post, we explore how small lifestyle shifts can lead to lasting happiness. From mindful mornings to joyful movement, discover practical ways to feel more energized, balanced, and fulfilled every day. Because when you care for your health, happiness naturally follows."
                    : ""
                }
                config={config}
              />
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4 text-center font-poppins">
              Upload Cover
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
                isDragging ? "border-red-400 bg-blue-50" : "border-gray-300"
              }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-3 text-gray-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" />
                      <path
                        d="M3 7L3 17L9 11L15 17L21 11V7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 font-poppins">
                    {file ? (
                      <span className="text-blue-600">{file.name}</span>
                    ) : (
                      <>
                        Drag and Drop a file here, or{" "}
                        <span className="text-red-400 font-semibold">
                          Browse
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 sm:px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-xs sm:text-sm font-medium font-poppins"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
