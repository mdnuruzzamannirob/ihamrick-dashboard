import React, { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";
import JoditEditor from "jodit-react";
import Image from "next/image";

interface FormData {
  title: string;
  date: string;
  status: string;
  description: string;
  transcriptions: string;
  coverImage: File | null;
}

interface BlogPost {
  id: number;
  title: string;
  status: "Published" | "Unpublished";
}

interface PodcastsEditModalProps {
  post?: BlogPost | null;
}
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

const PodcastsEditModal = ({ post }: PodcastsEditModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: post?.title || "",
    date: "2025-10-11",
    status: post?.status.toLowerCase() || "",
    description:
      "A healthy life isn't just about eating greens or hitting the gym — it's about cultivating habits that nourish your body, mind, and soul. In this post, we explore how small lifestyle shifts can lead to lasting happiness.",
    transcriptions: `Introduction to Healthy Living [00:00]

Hello everyone and welcome back to our channel. Today we're diving deep into the topic of healthy living and how small, sustainable changes can transform your life. Whether you're just starting your wellness journey or looking to optimize your current routine, this video has something valuable for you.

The Foundation of Wellness [01:15]

Let's start with the basics. Healthy living encompasses three main pillars: nutrition, physical activity, and mental wellbeing. Many people focus on just one aspect, but true wellness comes from balancing all three. Think of it like a three-legged stool - if one leg is weak, the whole structure becomes unstable.

Nutrition Tips for Busy Lives [03:30]

When it comes to nutrition, you don't need to be perfect. Start by adding more whole foods to your diet - fresh vegetables, fruits, lean proteins, and whole grains. Meal prep on Sundays can save you hours during the week. Keep healthy snacks like nuts, fruits, and yogurt readily available to avoid reaching for processed options when hunger strikes.

Movement and Exercise [06:45]

Exercise doesn't have to mean spending hours at the gym. Find activities you genuinely enjoy - whether that's dancing, hiking, swimming, or playing sports with friends. The key is consistency over intensity. Even 20-30 minutes of daily movement can significantly impact your health, mood, and energy levels.

Mental Health Matters [09:20]

Don't neglect your mental wellness. Practice stress management techniques like meditation, deep breathing, or journaling. Set boundaries with work and technology. Quality sleep is non-negotiable - aim for 7-9 hours each night. Remember, taking care of your mental health isn't selfish, it's essential.

Building Sustainable Habits [12:00]

The secret to lasting change is building habits gradually. Start with one small change and master it before adding another. Track your progress, celebrate small wins, and be kind to yourself when you slip up. Remember, progress isn't linear - what matters is getting back on track.

Conclusion [14:30]

Thank you for watching today's video on healthy living. Remember, your health is your wealth. Start small, stay consistent, and watch how these changes compound over time. If you found this helpful, please like, subscribe, and hit the notification bell for more wellness content. Share your own healthy living tips in the comments below - I love hearing from you all. Until next time, take care of yourself!`,
    coverImage: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useRef(null);
  // Update formData when post prop changes
  useEffect(() => {
    if (post && isModalOpen) {
      setFormData((prev) => ({
        ...prev,
        title: post.title,
        status: post.status.toLowerCase(),
      }));
    }
  }, [post, isModalOpen]);

  const handleSave = (data: FormData) => {
    console.log("Form data:", data);
    console.log("Image file:", data.coverImage);
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
        aria-label="Edit"
      >
        <Pencil className="h-4 w-4" />
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
                      className="block text-sm font-medium text-gray-700 mb-2"
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
                      className="w-full px-3 text-xs py-2 border text-neutral-800 placeholder:text-gray-400 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 mb-2"
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
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-neutral-800 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm appearance-none bg-white"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        paddingRight: "36px",
                      }}
                    >
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                  </div>
                </div>

                {/* Right Column - Upload Area */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => !imagePreview && handleBrowseClick()}
                    className="border-2 border-dashed border-gray-300 rounded hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center flex-1 min-h-[140px] p-6"
                  >
                    {imagePreview ? (
                      <div className="relative w-full flex flex-col items-center">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={800} // adjust based on your layout
                          height={140}
                          className="max-w-full max-h-[140px] rounded object-cover"
                        />

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview("");
                            setFormData((prev) => ({
                              ...prev,
                              coverImage: null,
                            }));
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="mt-3 text-sm text-red-500 hover:text-red-700 underline"
                        >
                          Remove Image
                        </button>
                      </div>
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
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm text-gray-600 text-center">
                          Drag and Drop an image here, or{" "}
                          <span className="text-red-400 underline cursor-pointer hover:text-red-600">
                            Browse
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-poppins font-medium text-gray-700 block">
                  Description
                </label>
                <div className="border text-neutral-800 placeholder:text-gray-400  border-gray-300 rounded-lg overflow-hidden [&_.jodit-container]:border-0 [&_.jodit-workplace]:text-sm [&_.jodit-toolbar-button]:text-xs">
                  <JoditEditor
                    ref={editor}
                    value={formData.description}
                    config={config}
                    // onBlur={(newContent) => setFormData(newContent)}
                    // onChange={(newContent) => {}}
                  />
                </div>
              </div>

              {/* Transcriptions Editor */}
              <div className="mb-6 text-xs placeholder:text-gray-400 text-neutral-800">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transcriptions
                </label>
                <div className="border text-neutral-800 placeholder:text-gray-400  border-gray-300 rounded-lg overflow-hidden [&_.jodit-container]:border-0 [&_.jodit-workplace]:text-sm [&_.jodit-toolbar-button]:text-xs">
                  <JoditEditor
                    ref={editor}
                    value={formData.transcriptions}
                    config={config}
                    // onBlur={(newContent) => setFormData(newContent)}
                    onChange={(newContent) => {}}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave(formData)}
                  className="bg-black text-white px-7 py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition-colors w-full md:w-auto"
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

export default PodcastsEditModal;
