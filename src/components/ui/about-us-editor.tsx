"use client";

import { useRef, useState, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const initialContent = `
<h2 style="font-weight: 600; font-size: 1rem; margin-bottom: 1rem;">1. Intro</h2>
<p style="line-height: 1.6; margin-bottom: 1rem;">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>

<h2 style="font-weight: 600; font-size: 1rem; margin-bottom: 1rem; margin-top: 2rem;">2. Details</h2>
<p style="line-height: 1.6; margin-bottom: 1rem;">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.There are many variations of passages of Lorem Ipsum available, but the majority.</p>
`;

export default function AboutUsEditor({ title }: { title: string }) {
  const editor = useRef(null);
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const config = useMemo(
    () =>
      ({
        readonly: false,
        placeholder: "",
        height: "calc(100vh - 220px)",
        toolbar: true,
        toolbarButtonSize: "small",
        buttons: [
          "bold",
          "italic",
          "underline",
          "|",
          "align",
          "|",
          "ul",
          "ol",
          "|",
          "link",
        ],
        uploader: {
          insertImageAsBase64URI: false,
        },
        removeButtons: ["brush", "file", "image", "video", "about"],
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
      } as any),
    []
  );

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Simulate API call - replace with your actual save logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // console.log("Saving content:", content);
      // Add your actual save API call here
      // await saveAboutUsContent(content);

      toast.success("Changes saved successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to dashboard after toast is shown
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Failed to save changes. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsSaving(false);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen font-poppins ">
      <div className="">
        <div className="mb-6">
          <h1 className="text-lg font-poppins font-semibold text-gray-900">
            {title}
          </h1>
        </div>

        <div className="rounded-lg  text-base font-poppins text-[#333333] border border-gray-200 ">
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={(newContent) => setContent(newContent)}
            // onChange={(newContent) => {}}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md bg-black px-6 py-2 font-poppins text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
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
      </div>
      <ToastContainer />
    </div>
  );
}
