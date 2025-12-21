'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import { joditConfig } from '@/utils/joditConfig';

// Dynamically import JoditEditor only on client side
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});

const initialContent = `
// Initial content goes here, including HTML structure...
`;

export default function AboutUsEditor({
  title,
  onSave,
  isLoading,
}: {
  title: string;
  onSave: (content: string) => void;
  isLoading: boolean;
}) {
  const editor = useRef(null);
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Only run this effect on the client side
  useEffect(() => {
    setIsClient(true); // Ensures that client-side rendering is done
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Call onSave from parent (AboutUs component) to save the content
      await onSave(content);

      setTimeout(() => {
        router.push('/dashboard'); // Redirect to dashboard after saving
      }, 2000);
    } catch (error) {
      setIsSaving(false);
      console.error(error); // Log the error
    }
  };

  // Show loading state until the component is client-side
  if (!isClient) {
    return (
      <div className="font-poppins min-h-screen">
        <div className="animate-pulse">
          <div className="mb-6 h-6 w-48 rounded bg-gray-200"></div>
          <div className="mb-6 h-64 rounded bg-gray-200"></div>
          <div className="mx-auto h-10 w-32 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-poppins min-h-screen">
      <div className="mb-6">
        <h1 className="font-poppins text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="font-poppins rounded-lg border border-gray-200 text-base text-[#333333]">
        {/* JoditEditor to edit content */}
        <JoditEditor
          ref={editor}
          value={content}
          config={joditConfig}
          onBlur={(newContent) => setContent(newContent)} // Update content when editor loses focus
        />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="font-poppins flex items-center gap-2 rounded-md bg-black px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSaving || isLoading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-white"
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
            'Save Changes'
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
