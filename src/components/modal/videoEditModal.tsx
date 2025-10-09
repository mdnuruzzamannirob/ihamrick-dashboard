import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { Upload } from "lucide-react";

interface FormData {
  title: string;
  date: string;
  status: string;
  description: string;
  transcriptions: string;
  coverVideo: File | null;
}

const VideoEditModal = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    date: "",
    status: "",
    description: "",
    transcriptions: "",
    coverVideo: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descriptionEditor = useRef(null);
  const transcriptionsEditor = useRef(null);
  const handleSave = (data: FormData) => {
    console.log("Form data:", data);
    console.log("Video file:", data.coverVideo);
    setIsModalOpen(false);
  };
  const editorConfig = {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverVideo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setFormData((prev) => ({ ...prev, coverVideo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center font-poppins gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        <Upload size={18} />
        Upload
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 md:p-5">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-3xl font-light leading-none w-8 h-8 flex items-center justify-center z-10"
            >
              ×
            </button>

            <div className="p-6 md:p-8 pt-12 md:pt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-5">
                {/* Left Column */}
                <div className="flex flex-col space-y-5">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-poppins font-medium text-gray-700 mb-2"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Write the title..."
                      className="w-full px-3 text-xs py-2 border text-neutral-800 placeholder:text-gray-400  border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="block font-poppins text-sm font-medium text-gray-700 mb-2"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-neutral-800 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-poppins font-medium text-gray-700 mb-2"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full font-poppins px-3 py-2 border text-neutral-800 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm appearance-none bg-white"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        paddingRight: "36px",
                      }}
                    >
                      {/* <option value="">Select status</option> */}
                      {/* <option value="draft">Draft</option> */}
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                  </div>
                </div>

                {/* Right Column - Upload Area */}
                <div className="flex flex-col">
                  <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                    Upload Cover
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => !videoPreview && handleBrowseClick()}
                    className="border-2 border-dashed border-gray-300 rounded hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center flex-1 min-h-[140px] p-6"
                  >
                    {videoPreview ? (
                      <video
                        src={videoPreview}
                        controls
                        className="max-w-full font-poppins max-h-[140px] rounded"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <>
                        <svg
                          className="w-12 h-12 text-gray-400 mb-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                          />
                        </svg>
                        <p className="text-sm text-gray-600 text-center">
                          Drag and Drop a file here, or{" "}
                          <span className="text-red-400 font-poppins underline cursor-pointer hover:text-red-600">
                            Browse
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Description Editor */}
              <div className="mb-5  text-xs placeholder:text-gray-400 font-poppins text-neutral-800 ">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <JoditEditor
                  ref={descriptionEditor}
                  value={formData.description}
                  config={editorConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: newContent,
                    }))
                  }
                />
              </div>

              {/* Transcriptions Editor */}
              <div className="mb-6 text-xs placeholder:text-gray-400  font-poppins text-neutral-800 ">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transcriptions
                </label>
                <JoditEditor
                  ref={transcriptionsEditor}
                  value={formData.transcriptions}
                  config={editorConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({
                      ...prev,
                      transcriptions: newContent,
                    }))
                  }
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave(formData)}
                  className="bg-black font-poppins text-white px-7 py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition-colors w-full md:w-auto"
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
};

export default VideoEditModal;
