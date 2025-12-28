import Image from 'next/image';

export const MediaPreview = ({
  file,
  previewUrl,
  thumbnail,
  onResize,
  onChange,
  currentAspect,
}: any) => {
  const getFileType = () => {
    if (file?.type) return file.type;
    if (!previewUrl) return '';

    const cleanUrl = previewUrl.split('?')[0].toLowerCase();
    const extension = cleanUrl.split('.').pop();

    if (['mp4', 'webm', 'ogg', 'mov'].includes(extension!) || previewUrl.includes('/videos/'))
      return 'video/mp4';
    if (
      ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension!) ||
      previewUrl.includes('/images/')
    )
      return 'image/jpeg';
    if (['pdf'].includes(extension!) || previewUrl.includes('/pdfs/')) return 'application/pdf';
    if (['mp3', 'wav', 'mpeg'].includes(extension!) || previewUrl.includes('/audios/'))
      return 'audio/mpeg';

    return '';
  };

  const type = getFileType();
  const isVideo = type.startsWith('video/');
  const isImage = type.startsWith('image/');
  const isAudio = type.startsWith('audio/');
  const isPDF = type.includes('pdf');

  return (
    <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-zinc-950">
      <div
        style={{ aspectRatio: currentAspect || '16/9' }}
        className="relative h-full w-full transition-all duration-500"
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

      {/* Action Buttons */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 transition-all group-hover:opacity-100">
        {isImage && (
          <button
            onClick={onResize}
            className="rounded-2xl bg-white p-3 text-black shadow-xl transition-all hover:scale-110 active:scale-95"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        )}
        <button
          onClick={onChange}
          className="rounded-2xl bg-white p-3 text-black shadow-xl transition-all hover:scale-110 active:scale-95"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
