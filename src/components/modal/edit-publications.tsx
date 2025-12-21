'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  X,
  FileText,
  Loader2,
  Pencil,
  ChevronDown,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUpdatePublicationMutation } from '../../../services/allApi';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export function EditPublicationModal({ publication }: { publication: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [updatePublication, { isLoading }] = useUpdatePublicationMutation();

  const [formData, setFormData] = useState({
    title: publication.title,
    author: publication.author,
    publicationDate: publication.publicationDate,
    status: publication.status ? 'Published' : 'Unpublished',
    description: publication.description,
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pubFile, setPubFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(publication.coverImage);

  const getExistingFileName = (url: string) => {
    if (!url) return 'No file attached';
    const parts = url.split('/');
    return parts[parts.length - 1].split('_').pop();
  };

  const handleUpdate = async () => {
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('author', formData.author);
    payload.append('publicationDate', formData.publicationDate);
    payload.append('description', formData.description);
    payload.append('status', String(formData.status === 'Published'));

    if (coverImage) payload.append('coverImage', coverImage);
    if (pubFile) payload.append('file', pubFile);

    try {
      await updatePublication({ id: publication._id, data: payload }).unwrap();
      toast.success('Publication updated successfully!');
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-xl bg-neutral-900 p-2.5 text-white transition-all hover:bg-black"
      >
        <Pencil size={16} />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in zoom-in flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-50 px-10 py-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900">
                  Update Publication
                </h2>
                <p className="text-xs font-medium text-gray-400">
                  Refine your content and media assets
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-gray-50 p-2 text-gray-400 transition-all hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-10 overflow-y-auto px-10 py-8">
              {/* Media Section: Cover and PDF Side by Side */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left: Cover Image Upload */}
                <div className="space-y-3">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Cover Preview
                  </label>
                  <div className="group relative h-48 w-full overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-sm transition-all hover:shadow-md">
                    <Image src={preview} alt="cover" fill className="object-cover" />
                    <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-3xl bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <ImageIcon size={24} className="mb-2 text-white" />
                      <span className="text-xs font-bold tracking-tighter text-white uppercase">
                        Change Cover
                      </span>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCoverImage(file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Right: PDF Upload & Name Display */}
                <div className="space-y-3">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Attached Document
                  </label>
                  <div className="group flex h-48 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition-all hover:border-blue-300">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded bg-blue-50 text-blue-600 shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white">
                      <FileText size={28} />
                    </div>
                    <div className="mb-4 w-full px-4 text-center">
                      <p className="truncate text-xs font-bold text-gray-800">
                        {pubFile ? pubFile.name : getExistingFileName(publication.file)}
                      </p>
                      <p className="mt-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        {pubFile ? 'Newly Selected' : 'Current Resource'}
                      </p>
                    </div>
                    <label className="cursor-pointer rounded-xl border border-gray-100 bg-white px-6 py-2 text-[10px] font-black tracking-wider text-gray-900 uppercase shadow-sm transition-all hover:bg-gray-100">
                      Upload New PDF
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={(e) => setPubFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <hr className="border-gray-50" />

              {/* Form Section */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                      Title
                    </label>
                    <input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full rounded bg-gray-50 px-5 py-4 text-sm font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                      Author
                    </label>
                    <input
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full rounded bg-gray-50 px-5 py-4 text-sm font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                      Publication Date
                    </label>
                    <input
                      disabled
                      value={formData.publicationDate}
                      onChange={(e) =>
                        setFormData({ ...formData, publicationDate: e.target.value })
                      }
                      className="w-full rounded bg-gray-50 px-5 py-4 text-sm font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                      Status
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setStatusOpen(!statusOpen)}
                        className="flex w-full items-center justify-between rounded bg-gray-50 px-5 py-4 text-sm font-bold"
                      >
                        <span className="flex items-center gap-2">
                          {formData.status === 'Published' ? (
                            <CheckCircle2 size={16} className="text-green-500" />
                          ) : (
                            <AlertCircle size={16} className="text-amber-500" />
                          )}
                          {formData.status}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`${statusOpen ? 'rotate-180' : ''} transition-transform`}
                        />
                      </button>
                      {statusOpen && (
                        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded bg-white shadow-2xl ring-1 ring-black/5">
                          {['Published', 'Unpublished'].map((s) => (
                            <button
                              key={s}
                              className="w-full px-5 py-4 text-left text-sm font-bold transition-all hover:bg-black hover:text-white"
                              onClick={() => {
                                setFormData({ ...formData, status: s as any });
                                setStatusOpen(false);
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-black tracking-widest text-gray-400 uppercase">
                    Detailed Description
                  </label>
                  <div className="overflow-hidden rounded bg-gray-50 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-black">
                    <JoditEditor
                      value={formData.description}
                      onBlur={(val) => setFormData({ ...formData, description: val })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 border-t border-gray-50 bg-gray-50/30 px-10 py-6">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded px-8 py-3.5 text-sm font-bold text-gray-400 transition-all hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex items-center gap-2 rounded bg-black px-12 py-3.5 text-sm font-bold text-white shadow-xl transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Save Updates'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
