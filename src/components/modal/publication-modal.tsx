'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { ChevronDown, X, FileText, ImageIcon, Loader2, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { useCreatePublicationMutation, useGetPublicationsQuery } from '../../../services/allApi';
import Image from 'next/image';
import { joditConfig } from '@/utils/joditConfig';

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
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createPublication, { isLoading }] = useCreatePublicationMutation();
  const { refetch } = useGetPublicationsQuery({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

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
      refetch();
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
      status: 'Published',
      description: '',
      cover: null,
      file: null,
    });
    setCoverPreview(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all hover:bg-neutral-800 active:scale-95"
      >
        <Plus size={18} /> Add Publication
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in zoom-in z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-50 px-8 py-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">New Publication</h2>
                <p className="mt-1 text-xs font-medium text-gray-400">
                  Fill in the details to publish medical knowledge
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-gray-50 p-2.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 space-y-8 overflow-y-auto px-8 py-8">
              {/* Media Section */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Cover Upload */}
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Cover Image
                  </label>
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="group relative flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-black hover:bg-gray-100"
                  >
                    {coverPreview ? (
                      <Image src={coverPreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="mb-3 rounded bg-white p-3 text-gray-400 shadow-sm transition-all group-hover:bg-black group-hover:text-white">
                          <ImageIcon size={24} />
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase">
                          Select Cover Photo
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">JPG, PNG up to 5MB</p>
                      </div>
                    )}
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData((p) => ({ ...p, cover: file }));
                          setCoverPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* PDF Upload */}
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    PDF Document
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-black hover:bg-gray-100"
                  >
                    <div className="mb-3 rounded bg-white p-3 text-blue-600 shadow-sm transition-all group-hover:bg-black group-hover:text-white">
                      <FileText size={24} />
                    </div>
                    <div className="px-6 text-center">
                      <p className="truncate text-xs font-bold text-gray-700">
                        {formData.file ? formData.file.name : 'CHOOSE PDF FILE'}
                      </p>
                      <p className="mt-1 text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
                        {formData.file ? 'File Selected' : 'Click to browse your computer'}
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      hidden
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, file: e.target.files?.[0] || null }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Publication Title
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter descriptive title"
                    className="h-12 w-full rounded bg-gray-50 px-5 text-sm font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Author Name
                  </label>
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Hamrick"
                    className="h-12 w-full rounded bg-gray-50 px-5 text-sm font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Date
                  </label>
                  <input
                    type="date"
                    name="publicationDate"
                    value={formData.publicationDate}
                    onChange={handleChange}
                    className="h-12 w-full rounded bg-gray-50 px-5 text-sm font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Visibility Status
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setStatusOpen(!statusOpen)}
                      className="flex h-12 w-full items-center justify-between rounded bg-gray-50 px-5 text-sm font-bold outline-none"
                    >
                      {formData.status || 'Select status'}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${statusOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {statusOpen && (
                      <div className="absolute z-20 mt-2 w-full overflow-hidden rounded bg-white shadow-2xl ring-1 ring-black/5">
                        {['Published', 'Unpublished'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setFormData((p) => ({ ...p, status: s as any }));
                              setStatusOpen(false);
                            }}
                            className="block w-full px-5 py-3.5 text-left text-sm font-bold transition-all hover:bg-black hover:text-white"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  Content Description
                </label>
                <div className="overflow-hidden rounded bg-gray-50 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-black">
                  <JoditEditor
                    value={formData.description}
                    config={joditConfig}
                    onBlur={(v) => setFormData((p) => ({ ...p, description: v }))}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-50 bg-gray-50/30 px-8 py-6">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded px-6 py-3 text-sm font-bold text-gray-400 transition-all hover:text-black"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 rounded bg-black px-10 py-3 text-sm font-bold text-white shadow-xl shadow-black/20 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Publication'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
