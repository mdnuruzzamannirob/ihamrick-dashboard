'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { ChevronDown, X, Upload, File } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { useCreatePublicationMutation } from '../../../services/allApi';

interface PublicationFormState {
  title: string;
  author: string;
  publicationDate: string;
  status: 'Published' | 'Unpublished' | '';
  description: string;
  cover: File | null;
  file: File | null;
}

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export function PublicationModal() {
  const [formData, setFormData] = useState<PublicationFormState>({
    title: '',
    author: '',
    publicationDate: '',
    status: 'Published',
    description: '',
    cover: null,
    file: null,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createPublication, { isLoading }] = useCreatePublicationMutation();

  /* ---------------- handlers ---------------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const editorConfig = {
    readonly: false,
    height: 150,
    toolbar: true,
    buttons: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      '|',
      'ul',
      'ol',
      '|',
      'outdent',
      'indent',
      '|',
      'link',
    ],
  };

  /* ---------------- submit ---------------- */

  const handleSave = async () => {
    if (
      !formData.title ||
      !formData.author ||
      !formData.status ||
      !formData.cover ||
      !formData.file
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('author', formData.author);
    payload.append(
      'publicationDate',
      formData.publicationDate
        ? new Date(formData.publicationDate).toISOString()
        : new Date().toISOString(),
    );
    payload.append('status', String(formData.status === 'Published'));
    payload.append('description', formData.description);
    payload.append('coverImage', formData.cover);
    payload.append('file', formData.file);
    payload.append('fileType', formData.file.name.split('.').pop() || '');

    try {
      await createPublication(payload).unwrap();
      toast.success('Publication created successfully');
      setIsOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create publication');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      publicationDate: '',
      status: '',
      description: '',
      cover: null,
      file: null,
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-base text-white"
      >
        <span>+</span> Add
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add Publication</h2>
              <p className="mt-1 text-sm text-gray-500">Fill in the details below</p>
            </div>

            <div className="space-y-5">
              {/* Title + Author */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter title"
                    className="h-10 w-full rounded-lg border px-3 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Author</label>
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter author"
                    className="h-10 w-full rounded-lg border px-3 text-sm"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Publication Date</label>
                <input
                  type="date"
                  name="publicationDate"
                  value={formData.publicationDate}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border px-3 text-sm"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusOpen(!statusOpen)}
                    className="flex h-10 w-full items-center justify-between rounded-lg border px-3 text-sm"
                  >
                    {formData.status || 'Select status'}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {statusOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow">
                      {['Published', 'Unpublished'].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setFormData((p) => ({ ...p, status: s as any }));
                            setStatusOpen(false);
                          }}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-black hover:text-white"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Uploads */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Upload Cover */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Upload Cover</label>
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="cursor-pointer rounded-lg border-2 border-dashed p-4 text-center"
                  >
                    {formData.cover ? (
                      <p className="truncate text-xs">{formData.cover.name}</p>
                    ) : (
                      <>
                        <Upload className="mx-auto mb-2 text-gray-400" />
                        <p className="text-xs text-gray-500">
                          Drop image or <span className="font-medium">browse</span>
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        cover: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>

                {/* Upload File */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Upload File</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer rounded-lg border-2 border-dashed p-4 text-center"
                  >
                    {formData.file ? (
                      <p className="truncate text-xs">{formData.file.name}</p>
                    ) : (
                      <>
                        <File className="mx-auto mb-2 text-gray-400" />
                        <p className="text-xs text-gray-500">
                          Drop file or <span className="font-medium">browse</span>
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        file: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <div className="overflow-hidden rounded-lg border">
                  <JoditEditor
                    value={formData.description}
                    config={editorConfig}
                    onBlur={(v) => setFormData((p) => ({ ...p, description: v }))}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-5 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="rounded-lg bg-black px-6 py-2 text-sm text-white"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
