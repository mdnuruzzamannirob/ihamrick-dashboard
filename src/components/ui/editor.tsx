'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { joditConfig } from '@/utils/joditConfig';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface Props {
  title: string;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  isFetching: boolean;
  isSaving: boolean;
}

export default function AboutUsEditor({
  title,
  initialContent,
  onSave,
  isFetching,
  isSaving,
}: Props) {
  const editorRef = useRef(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  if (isFetching) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-64 rounded bg-gray-200" />
        <div className="mx-auto h-10 w-32 rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="font-poppins min-h-screen">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">{title}</h1>

      <div className="rounded-lg border border-gray-200">
        <JoditEditor
          ref={editorRef}
          value={content}
          config={{ ...joditConfig, placeholder: '' }}
          onBlur={(newContent) => setContent(newContent)}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => onSave(content)}
          disabled={isSaving}
          className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white disabled:bg-gray-400"
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
