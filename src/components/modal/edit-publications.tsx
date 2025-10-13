"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronDown,
  X,
  File,
  Eye,
  Pencil,
  Calendar,
  User,
} from "lucide-react";
import videoEdit from "@/assets/image/videoEdit.png";
import dynamic from "next/dynamic";

interface Publication {
  id: string;
  title: string;
  author: string;
  publicationDate: string;
  publicationType: string;
  status: "Published" | "Unpublished";
  description: string;
  coverImage: string;
  fileUrl: string;
  fileName: string;
}
interface SaveData {
  title: string;
  author: string;
  publicationDate: string;
  publicationType: string;
  status: "Published" | "Unpublished";
  description: string;
}

interface EditPublicationsModalProps {
  publication: Publication;
  mode?: "edit" | "view";
  onSave?: (data: SaveData) => void;
  onClose?: () => void;
  visible?: boolean;
}

export function EditPublicationsModal({
  publication,
  mode = "view",
  onSave,
  onClose,
  visible = false,
}: EditPublicationsModalProps) {
  const [title, setTitle] = useState(publication.title);
  const [author, setAuthor] = useState(publication.author);
  const [publicationDate, setPublicationDate] = useState(
    publication.publicationDate
  );
  const [publicationType, setPublicationType] = useState(
    publication.publicationType
  );
  const [status, setStatus] = useState<"Published" | "Unpublished">(
    publication.status
  );
  const [description, setDescription] = useState(publication.description);
  const [statusOpen, setStatusOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(visible);
  // Dynamically import JoditEditor only on client side
  const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
  });

  const editor = useRef(null);
  const [currentMode, setCurrentMode] = useState<"edit" | "view">(mode);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const config = {
    readonly: currentMode === "view",
    toolbar: currentMode === "edit",
    height: 150,
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

  const handleSave = () => {
    const publicationData = {
      title,
      author,
      publicationDate,
      publicationType,
      status,
      description,
    };

    if (onSave) {
      onSave(publicationData);
    }
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
    setCurrentMode(mode);
    setTitle(publication.title);
    setAuthor(publication.author);
    setPublicationDate(publication.publicationDate);
    setPublicationType(publication.publicationType);
    setStatus(publication.status);
    setDescription(publication.description);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
        aria-label={mode === "view" ? "View Details" : "Edit"}
      >
        {mode === "view" ? (
          <Eye className="h-4 w-4" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsVisible(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
        aria-label={mode === "view" ? "View Details" : "Edit"}
      >
        {mode === "view" ? (
          <Eye className="h-4 w-4" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
      </button>

      <div
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 md:p-5"
        onClick={handleClose}
      >
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] p-8 font-poppins relative overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <h2 className="text-xl font-poppins font-semibold text-gray-900">
              {currentMode === "view"
                ? "Publication Details"
                : "Edit Publication"}
            </h2>
            <p className="text-sm font-poppins text-gray-500 mt-1">
              {currentMode === "view"
                ? "View publication information"
                : "Modify the details below"}
            </p>
          </div>

          {currentMode === "view" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    status === "Published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Author</p>
                    <p className="text-gray-900 font-medium">{author}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Publication Date
                    </p>
                    <p className="text-gray-900 font-medium">
                      {new Date(publicationDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-poppins font-medium text-gray-700 block">
                    Cover Image
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative group">
                      <Image
                        src={videoEdit}
                        alt={publication.coverImage}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-sm font-medium text-gray-900 text-center">
                        {publication.coverImage}
                      </p>
                      <p className="text-xs text-gray-500 text-center mt-1">
                        Cover Image
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-poppins font-medium text-gray-700 block">
                    Publication File
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <File className="w-10 h-10 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {publication.fileName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF Document • 2.4 MB
                      </p>
                      <p className="text-xs text-blue-600 font-medium mt-2">
                        Click to download
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-poppins font-medium text-gray-700 block">
                  Description
                </label>
                <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 rounded-lg p-6">
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleClose}
                  className="px-5 py-2 font-poppins rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-poppins font-medium text-gray-700 block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                    className="w-full h-10 px-3 text-neutral-800 placeholder:text-gray-400 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-poppins font-medium text-gray-700 block">
                    Author
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author"
                    className="w-full h-10 px-3 text-neutral-800 placeholder:text-gray-400 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-poppins font-medium text-gray-700 block">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-gray-300 text-neutral-800 placeholder:text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-poppins font-medium text-gray-700 block">
                  Status
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusOpen(!statusOpen)}
                    className="w-full h-10 px-3 font-poppins text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent flex items-center justify-between bg-white transition-shadow"
                  >
                    <span
                      className={status ? "text-gray-900" : "text-gray-400"}
                    >
                      {status || "Select status"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {statusOpen && (
                    <div className="absolute z-10 w-full mt-1 font-poppins border border-gray-200 rounded-lg shadow-lg bg-white">
                      {["Published", "Unpublished"].map((statusOption) => (
                        <button
                          key={statusOption}
                          type="button"
                          onClick={() => {
                            setStatus(
                              statusOption as "Published" | "Unpublished"
                            );
                            setStatusOpen(false);
                          }}
                          className="w-full px-3 font-poppins bg-white py-2 text-black hover:text-white text-sm text-left hover:bg-black first:rounded-t-lg last:rounded-b-lg transition-colors"
                        >
                          {statusOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-poppins font-medium text-gray-700 block">
                    Cover Image
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-100">
                      <Image
                        src={videoEdit}
                        alt={publication.coverImage}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 border-t border-gray-300 flex items-center space-x-3 bg-white">
                      <File className="w-6 h-6 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {publication.coverImage}
                        </p>
                        <p className="text-xs text-gray-500">Cover Image</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-poppins font-medium text-gray-700 block">
                    Publication File
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 flex items-center space-x-3 bg-gray-50">
                    <File className="w-8 h-8 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {publication.fileName}
                      </p>
                      <p className="text-xs text-gray-500">Document</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-poppins font-medium text-gray-700 block">
                  Description
                </label>
                <div className="border text-neutral-800 placeholder:text-gray-400  border-gray-300 rounded-lg overflow-hidden [&_.jodit-container]:border-0 [&_.jodit-workplace]:text-sm [&_.jodit-toolbar-button]:text-xs">
                  <JoditEditor
                    ref={editor}
                    value={description}
                    config={config}
                    // onBlur={(newContent) => setDescription(newContent)}
                    // onChange={(newContent) => {}}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleClose}
                  className="px-5 py-2 font-poppins rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-black font-poppins text-white hover:bg-gray-800 px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
