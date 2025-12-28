'use client';

import { Edit3, RotateCcw } from 'lucide-react';
import Image from 'next/image';

export const MediaPreview = ({
  file,
  previewUrl,
  thumbnail,
  onResize,
  onChange,
  currentAspect = 16 / 9,
}: any) => {
  const getFileType = () => {
    if (file?.type) return file.type;
    if (!previewUrl) return '';

    const cleanUrl = previewUrl.split('?')[0].toLowerCase();
    const extension = cleanUrl.split('.').pop();

    if (['mp4', 'webm', 'mov'].includes(extension!) || previewUrl.includes('/videos/'))
      return 'video/mp4';
    if (['jpg', 'jpeg', 'png', 'webp'].includes(extension!) || previewUrl.includes('/images/'))
      return 'image/jpeg';
    if (['pdf'].includes(extension!) || previewUrl.includes('/pdfs/')) return 'application/pdf';
    if (['mp3', 'wav'].includes(extension!) || previewUrl.includes('/audios/')) return 'audio/mpeg';

    return '';
  };

  const type = getFileType();
  const isImage = type.startsWith('image/');
  const isVideo = type.startsWith('video/');
  const isAudio = type.startsWith('audio/');
  const isPDF = type.includes('pdf');

  const canResize = isImage && file !== null;

  return (
    <div className="group relative size-full overflow-hidden rounded-3xl">
      <div
        style={{ aspectRatio: currentAspect }}
        className="relative h-full w-full overflow-hidden transition-all duration-500"
      >
        {isImage && (
          <Image fill src={previewUrl} alt="preview" className="h-full w-full object-cover" />
        )}

        {isVideo && (
          <video
            src={previewUrl}
            poster={thumbnail}
            controls
            className="h-full w-full bg-black object-contain"
          />
        )}

        {isAudio && (
          <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-100 p-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/10">
              <svg className="h-10 w-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.045-3 2.333S3.343 18.667 5 18.667s3-1.045 3-2.334V5.48l9-1.8V14.114A4.369 4.369 0 0016 14c-1.657 0-3 1.045-3 2.333s1.343 2.334 3 2.334s3-1.045 3-2.334V3z"></path>
              </svg>
            </div>
            <audio src={previewUrl} controls className="w-full" />
          </div>
        )}

        {isPDF && (
          <div className="flex h-full w-full flex-col items-center justify-center bg-white p-6">
            <div className="mb-4 flex h-20 w-16 items-center justify-center rounded-lg border-2 border-red-100 bg-red-50">
              <span className="text-xs font-bold text-red-500">PDF</span>
            </div>
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-zinc-900 px-6 py-2 text-[11px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-black"
            >
              Preview Document
            </a>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 flex translate-y-2 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {canResize && (
          <button
            type="button"
            onClick={onResize}
            className="rounded-2xl bg-white/95 p-3 text-zinc-900 shadow-xl backdrop-blur transition-all hover:bg-white active:scale-90"
            title="Resize New Upload"
          >
            <Edit3 size={18} strokeWidth={2.5} />
          </button>
        )}
        <button
          type="button"
          onClick={onChange}
          className="rounded-2xl bg-white/95 p-3 text-zinc-900 shadow-xl backdrop-blur transition-all hover:bg-white active:scale-90"
          title="Change File"
        >
          <RotateCcw size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
