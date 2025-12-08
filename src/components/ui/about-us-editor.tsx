"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor only on client side
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const initialContent = `
// Initial content goes here, including HTML structure...
`;

export default function AboutUsEditor({ title, onSave, isLoading }: { title: string, onSave: (content: string) => void, isLoading: boolean }) {
  const editor = useRef(null);
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Only run this effect on the client side
  useEffect(() => {
    setIsClient(true);  // Ensures that client-side rendering is done
  }, []);

  const config = {
    readonly: false,
    toolbar: true,
    height: "calc(100vh - 220px)",
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

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Call onSave from parent (AboutUs component) to save the content
      await onSave(content);


      setTimeout(() => {
        router.push("/dashboard"); // Redirect to dashboard after saving
      }, 2000);
    } catch (error) {
      setIsSaving(false);
      console.error(error);  // Log the error
    }
  };

  // Show loading state until the component is client-side
  if (!isClient) {
    return (
      <div className="min-h-screen font-poppins">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-poppins">
      <div className="mb-6">
        <h1 className="text-lg font-poppins font-semibold text-gray-900">
          {title}
        </h1>
      </div>

      <div className="rounded-lg text-base font-poppins text-[#333333] border border-gray-200">
        {/* JoditEditor to edit content */}
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={(newContent) => setContent(newContent)}  // Update content when editor loses focus
        />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="rounded-md bg-black px-6 py-2 font-poppins text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving || isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
