'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { X, Loader2, Pencil, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUpdatePublicationMutation } from '../../../services/allApi';
import { joditConfig } from '@/utils/joditConfig';
import { SmartMediaUpload } from '../SmartMediaUpload';
import { fromZonedTime } from 'date-fns-tz';
import { dateFormatter } from '@/utils/dateFormatter';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export function EditPublicationModal({ publication, refetch }: { publication: any; refetch: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [updatePublication, { isLoading }] = useUpdatePublicationMutation();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publicationDate: '',
    status: 'Published',
    description: '',
    cover: null as File | Blob | null,
    file: null as File | Blob | null,
  });

  // For displaying existing or newly selected previews
  const [previews, setPreviews] = useState({ cover: '', file: '' });

  useEffect(() => {
    if (publication && isOpen) {
      setFormData({
        title: publication.title || '',
        author: publication.author || '',
        publicationDate: publication.publicationDate
          ? dateFormatter(publication.publicationDate, { unformatted: true }).split('T')[0]
          : '',
        status: publication.status ? 'Published' : 'Unpublished',
        description: publication.description || '',
        cover: null,
        file: null,
      });
      setPreviews({
        cover: publication.coverImage || '',
        file: publication.file || '',
      });
    }
  }, [publication, isOpen]);

  const handleUpdate = async () => {
    if (!formData.title) {
      toast.error('Title are required');
      return;
    }
    if (!formData.author) {
      toast.error('Author are required');
      return;
    }

    const payload = new FormData();

    const utcDate = formData?.publicationDate
      ? (() => {
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const now = new Date();
          const localDateTime = `${formData.publicationDate}T${now.toTimeString().slice(0, 8)}`;

          return fromZonedTime(localDateTime, timeZone).toISOString();
        })()
      : null;

    payload.append('title', formData.title);
    payload.append('author', formData.author);
    if (utcDate) payload.append('publicationDate', utcDate);
    payload.append('description', formData.description);
    payload.append('status', String(formData.status === 'Published'));

    // Append new files only if they were selected
    if (formData.cover) payload.append('coverImage', formData.cover);
    if (formData.file) {
      payload.append('file', formData.file);
      const fileName = (formData.file as File).name || 'document.pdf';
      payload.append('fileType', fileName.split('.').pop() || 'pdf');
    }

    try {
      await updatePublication({ id: publication._id, data: payload }).unwrap();
      refetch();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in zoom-in z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-50 px-8 py-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Update Publication
                </h2>
                <p className="mt-1 text-xs font-medium text-gray-400">
                  Modify content or replace existing files.
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Cover Image (Optional)
                  </label>
                  <SmartMediaUpload
                    label="Change Cover Photo"
                    allowedFormats={['image/*']}
                    className="aspect-video"
                    onFileChange={(file, preview) => {
                      setFormData((p) => ({ ...p, cover: file }));
                      setPreviews((p) => ({ ...p, cover: preview }));
                    }}
                    initialUrl={previews.cover}
                  />
                </div>

                {/* --- SMART MEDIA UPLOADER FOR PDF FILE --- */}
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Publication File (PDF)
                  </label>
                  <SmartMediaUpload
                    label={formData.file ? (formData.file as File).name : 'UPDATE PDF FILE'}
                    allowedFormats={['application/pdf']}
                    className="aspect-video rounded-3xl"
                    onFileChange={(file, preview) => {
                      setFormData((p) => ({ ...p, file: file }));
                      setPreviews((p) => ({ ...p, file: preview }));
                    }}
                    initialUrl={previews.file}
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Title
                  </label>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-12 w-full rounded bg-gray-50 px-5 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Author
                  </label>
                  <input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="h-12 w-full rounded bg-gray-50 px-5 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-black"
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
                    value={formData.publicationDate}
                    onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                    className="h-12 w-full rounded bg-gray-50 px-5 text-sm font-medium outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Status
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setStatusOpen(!statusOpen)}
                      className="flex h-12 w-full items-center justify-between rounded bg-gray-50 px-5 text-sm font-bold"
                    >
                      <span className="flex items-center gap-2">
                        {formData.status === 'Published' ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <AlertCircle size={16} className="text-amber-500" />
                        )}
                        {formData.status}
                      </span>
                      <ChevronDown size={16} className={statusOpen ? 'rotate-180' : ''} />
                    </button>
                    {statusOpen && (
                      <div className="absolute z-30 mt-2 w-full overflow-hidden rounded bg-white shadow-2xl ring-1 ring-black/5">
                        {['Published', 'Unpublished'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="w-full px-5 py-3 text-left text-sm font-bold hover:bg-black hover:text-white"
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
                <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  Description
                </label>
                <div className="overflow-hidden rounded bg-gray-50 focus-within:ring-2 focus-within:ring-black">
                  <JoditEditor
                    value={formData.description}
                    config={joditConfig}
                    onBlur={(val) => setFormData({ ...formData, description: val })}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 border-t border-gray-50 bg-gray-50/30 px-8 py-6">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded px-6 py-2 text-sm font-bold text-gray-400 hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex items-center gap-2 rounded bg-black px-10 py-3 text-sm font-bold text-white shadow-xl disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
