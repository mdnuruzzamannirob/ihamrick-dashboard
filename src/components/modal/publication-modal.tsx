"use client";

import type React from "react";

import { useState, useRef } from "react";
import { ChevronDown, X, Upload, File } from "lucide-react";
import JoditEditor from "jodit-react";

export function PublicationModal() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [publicationType, setPublicationType] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [publicationTypeOpen, setPublicationTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [podcastFile, setPodcastFile] = useState<File | null>(null);
  const [coverDragging, setCoverDragging] = useState(false);
  const [podcastDragging, setPodcastDragging] = useState(false);

  const editor = useRef(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const podcastInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);

  const config = {
    readonly: false,
    toolbar: true,
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
    console.log({
      title,
      author,
      publicationDate,
      publicationType,
      status,
      description,
      coverFile,
      podcastFile,
    });
  };

  const handleCoverDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setCoverDragging(true);
  };

  const handleCoverDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setCoverDragging(false);
  };

  const handleCoverDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setCoverDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setCoverFile(file);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
    }
  };

  const handlePodcastDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPodcastDragging(true);
  };

  const handlePodcastDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPodcastDragging(false);
  };

  const handlePodcastDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPodcastDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setPodcastFile(file);
    }
  };

  const handlePodcastFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPodcastFile(file);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center font-poppins gap-2 rounded-lg bg-black px-4 py-2 text-base font-medium text-white transition-colors hover:bg-neutral-800"
      >
        <span className="text-base">+</span>
        Add
      </button>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex  justify-center bg-black/50 "
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] p-8 font-sans relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Publication
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the details below
              </p>
            </div>

            <div className="space-y-5">
              {/* Title and Author Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="author"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Author
                  </label>
                  <input
                    id="author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author"
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="publication-type"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Type
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setPublicationTypeOpen(!publicationTypeOpen)
                      }
                      className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent flex items-center justify-between bg-white transition-shadow"
                    >
                      <span
                        className={
                          publicationType ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {publicationType
                          ? publicationType.charAt(0).toUpperCase() +
                            publicationType.slice(1)
                          : "Select type"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {publicationTypeOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {["Article", "Podcast", "Video", "Research"].map(
                          (typeOption) => (
                            <button
                              key={typeOption}
                              type="button"
                              onClick={() => {
                                setPublicationType(typeOption);
                                setPublicationTypeOpen(false);
                              }}
                              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                            >
                              {typeOption}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="publication-date"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Publication Date
                  </label>
                  <input
                    id="publication-date"
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Status
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusOpen(!statusOpen)}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent flex items-center justify-between bg-white transition-shadow"
                  >
                    <span
                      className={status ? "text-gray-900" : "text-gray-400"}
                    >
                      {status || "Select status"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {statusOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {["Draft", "Published", "Unpublished"].map(
                        (statusOption) => (
                          <button
                            key={statusOption}
                            type="button"
                            onClick={() => {
                              setStatus(statusOption);
                              setStatusOpen(false);
                            }}
                            className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                          >
                            {statusOption}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Cover and Upload File */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Upload Cover
                  </label>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    onDragOver={handleCoverDragOver}
                    onDragLeave={handleCoverDragLeave}
                    onDrop={handleCoverDrop}
                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                      coverDragging
                        ? "border-black bg-gray-50"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {coverFile ? (
                      <>
                        <File className="w-8 h-8 text-green-600 mb-2" />
                        <p className="text-xs text-gray-700 font-medium truncate w-full px-2">
                          {coverFile.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">
                          Drop image or{" "}
                          <span className="text-gray-900 font-medium">
                            browse
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Upload File
                  </label>
                  <input
                    ref={podcastInputRef}
                    type="file"
                    onChange={handlePodcastFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => podcastInputRef.current?.click()}
                    onDragOver={handlePodcastDragOver}
                    onDragLeave={handlePodcastDragLeave}
                    onDrop={handlePodcastDrop}
                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                      podcastDragging
                        ? "border-black bg-gray-50"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {podcastFile ? (
                      <>
                        <File className="w-8 h-8 text-green-600 mb-2" />
                        <p className="text-xs text-gray-700 font-medium truncate w-full px-2">
                          {podcastFile.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">
                          Drop file or{" "}
                          <span className="text-gray-900 font-medium">
                            browse
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description with Jodit Editor */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Description
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden [&_.jodit-container]:border-0 [&_.jodit-workplace]:text-sm [&_.jodit-toolbar-button]:text-xs">
                  <JoditEditor
                    ref={editor}
                    value={description}
                    config={config}
                    onBlur={(newContent) => setDescription(newContent)}
                    onChange={(newContent) => {}}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
