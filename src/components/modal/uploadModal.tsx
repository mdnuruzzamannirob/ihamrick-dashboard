import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { joditConfig } from '@/utils/joditConfig';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface UploadModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (data: {
    id: number;
    title: string;
    status: boolean;
    description: string;
    coverImage?: File;
  }) => void;
  post: {
    _id: number;
    title: string;
    status: boolean;
    description: string;
    coverImage: File | null;
  } | null;
  isNewBlog: boolean; // Pass `isNewBlog` prop to indicate whether it's a new blog or update
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen = true,
  onClose = () => {},
  onSave = () => {},
  post,
  isNewBlog,
}) => {
  const [title, setTitle] = useState('');
  const [id, setId] = useState(0);
  const [status, setStatus] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const editor = useRef<any>(null);
  const descriptionRef = useRef('');

  // Reset or load data based on whether it's a new blog or editing an existing one
  useEffect(() => {
    if (isOpen) {
      if (isNewBlog) {
        // Reset form when adding a new blog
        setId(0);
        setTitle('');
        setStatus(false);
        setCoverImage(null);
        descriptionRef.current = '';
        setFilePreview(null);
      } else {
        // Load data when editing an existing blog
        if (post) {
          setId(post._id);
          setTitle(post.title);
          setStatus(post.status);
          setCoverImage(post.coverImage);
          descriptionRef.current = post.description;

          // Check if coverImage exists and is a valid File object before creating an object URL
          if (post.coverImage && post.coverImage instanceof File) {
            setFilePreview(URL.createObjectURL(post.coverImage));
          } else {
            setFilePreview(null);
          }
        }
      }
    }
  }, [isOpen, post, isNewBlog]);

  const handleSave = () => {
    onSave({
      id,
      title,
      status,
      description: descriptionRef.current,
      coverImage: coverImage || undefined,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setCoverImage(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile)); // Preview the selected file
    }
  };

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
      setCoverImage(droppedFile);
      setFilePreview(URL.createObjectURL(droppedFile)); // Preview the dropped file
    }
  };

  if (!isOpen) return null;

  return (
    <div className="font-poppins fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-gray-500 transition-colors hover:text-gray-700 sm:top-4 sm:right-4"
        >
          <X size={20} className="sm:h-6 sm:w-6" />
        </button>
        <div className="p-4 sm:p-6">
          {/* Title and Status */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:grid-cols-2">
            <div>
              <label className="font-poppins mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write the title.."
                className="font-poppins w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-neutral-800 focus:border-transparent focus:ring-2 focus:ring-gray-400 focus:outline-none sm:text-base"
              />
            </div>
            <div>
              <label className="font-poppins mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                Status
              </label>
              <div className="relative">
                <select
                  value={status ? 'Published' : 'Unpublished'}
                  onChange={(e) => setStatus(e.target.value === 'Published')}
                  className="font-poppins w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-transparent focus:ring-2 focus:ring-gray-400 focus:outline-none sm:text-base"
                >
                  <option value="Published">Published</option>
                  <option value="Unpublished">Unpublished</option>
                </select>
                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
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

          {/* Description Editor */}
          <div className="mb-4 sm:mb-6">
            <label className="font-poppins mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
              Description
            </label>
            <div className="font-poppins overflow-hidden rounded-md border border-gray-300 text-xs text-neutral-800">
              <JoditEditor
                ref={editor}
                value={descriptionRef.current}
                config={joditConfig}
                onChange={(value) => {
                  descriptionRef.current = value;
                }}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-4 sm:mb-6">
            <label className="font-poppins mb-3 block text-center text-xs font-medium text-gray-700 sm:mb-4 sm:text-sm">
              Upload Cover
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors sm:p-8 ${
                isDragging ? 'border-red-400 bg-blue-50' : 'border-gray-300'
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
                  <div className="mb-2 h-12 w-12 text-gray-400 sm:mb-3 sm:h-16 sm:w-16">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" />
                      <path
                        d="M3 7L3 17L9 11L15 17L21 11V7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="font-poppins text-xs text-gray-600 sm:text-sm">
                    {coverImage ? (
                      <span className="text-blue-600">{coverImage.name}</span>
                    ) : (
                      <>
                        Drag and Drop a file here, or{' '}
                        <span className="font-semibold text-red-400">Browse</span>
                      </>
                    )}
                  </p>
                  {/* Image Preview */}
                  {filePreview && (
                    <div className="mt-4">
                      <Image
                        src={filePreview}
                        alt="Preview"
                        width={500}
                        height={200}
                        className="h-auto max-w-full rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="font-poppins rounded-md bg-black px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800 sm:px-6 sm:text-sm"
            >
              {isNewBlog ? 'Create Blog' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
