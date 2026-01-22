'use client';

import { dateFormatter } from '@/utils/dateFormatter';
import { formatFileSize } from '@/utils/formatFileSize';
import { Eye, X, Calendar, File, BarChart3 } from 'lucide-react';
import { useState, useMemo } from 'react';
import TiptapViewer from '../editor/TiptapViewer';

export function VideoViewModal({ video }: { video: any }) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [playError, setPlayError] = useState(false);

  if (!video) return null;

  const videoSource = video.signedUrl || video.videoUrl;

  // ===================== EXTENDED VIDEO LOGIC =====================
  const videoFileExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.mkv', '.avi', '.m4v'];

  const isDirectVideoFile = useMemo(() => {
    if (!videoSource) return false;
    return videoFileExtensions.some((ext) => videoSource.toLowerCase().split('?')[0].endsWith(ext));
  }, [videoSource]);

  const resolvedVideo = useMemo(() => {
    if (!videoSource) return null;

    // YouTube
    if (/youtu\.be|youtube\.com/.test(videoSource)) {
      const id = videoSource.split('v=')[1]?.split('&')[0] || videoSource.split('youtu.be/')[1];
      return id ? { type: 'iframe', src: `https://www.youtube.com/embed/${id}` } : null;
    }

    // Vimeo
    if (/vimeo\.com/.test(videoSource)) {
      const id = videoSource.split('/').pop();
      return { type: 'iframe', src: `https://player.vimeo.com/video/${id}` };
    }

    // Dailymotion
    if (/dailymotion\.com/.test(videoSource)) {
      const id = videoSource.split('/video/')[1];
      return id ? { type: 'iframe', src: `https://www.dailymotion.com/embed/video/${id}` } : null;
    }

    // Facebook
    if (/facebook\.com/.test(videoSource)) {
      return {
        type: 'iframe',
        src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoSource)}`,
      };
    }

    // Streamable
    if (/streamable\.com/.test(videoSource)) {
      const id = videoSource.split('/').pop();
      return { type: 'iframe', src: `https://streamable.com/e/${id}` };
    }

    // Loom
    if (/loom\.com/.test(videoSource)) {
      const id = videoSource.split('/share/')[1];
      return { type: 'iframe', src: `https://www.loom.com/embed/${id}` };
    }

    // // JumpShare
    // if (/jumpshare\.com/.test(videoSource)) {
    //   return { type: 'iframe', src: `${videoSource}?embed=1` };
    // }

    // Google Drive
    if (/drive\.google\.com/.test(videoSource)) {
      const match = videoSource.match(/\/d\/(.*?)\//);
      if (match)
        return { type: 'iframe', src: `https://drive.google.com/file/d/${match[1]}/preview` };
    }

    // Dropbox
    if (/dropbox\.com/.test(videoSource)) {
      return { type: 'iframe', src: videoSource.replace('?dl=0', '?raw=1') };
    }

    // Direct video file
    if (isDirectVideoFile) return { type: 'video', src: videoSource };

    // Unknown non-file
    return { type: 'external', src: videoSource };
  }, [videoSource, isDirectVideoFile]);
  // ===============================================================

  return (
    <>
      <button
        onClick={() => setViewModalOpen(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white hover:bg-neutral-700"
      >
        <Eye className="h-4 w-4" />
      </button>

      {viewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setViewModalOpen(false)} />

          <div
            onClick={(e) => e.stopPropagation()}
            className="font-poppins relative z-10 max-h-[95vh] w-full max-w-7xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
          >
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Video Details</h2>
              <p className="text-sm text-gray-500">View detailed video information and preview</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${video.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {video.status}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Upload Date</p>
                    <p className="text-sm font-medium">{dateFormatter(video.uploadDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="text-sm font-medium">{video.views || 0} views</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                  <File className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">File Size</p>
                    <p className="text-sm font-medium">{formatFileSize(video.fileSize)}</p>
                  </div>
                </div>
              </div>

              {/* VIDEO PLAYER */}
              <div className="overflow-hidden rounded-lg border bg-black shadow-inner">
                {resolvedVideo?.type === 'iframe' && (
                  <iframe
                    src={resolvedVideo.src}
                    className="aspect-video w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                )}
                {resolvedVideo?.type === 'video' && !playError && (
                  <video
                    key={resolvedVideo.src}
                    controls
                    poster={video.thumbnailUrl}
                    className="aspect-video w-full object-contain"
                    crossOrigin="anonymous"
                    onError={() => setPlayError(true)}
                  >
                    <source src={resolvedVideo.src} />
                  </video>
                )}
                {resolvedVideo?.type === 'external' && (
                  <div className="flex h-64 flex-col items-center justify-center gap-2 text-white">
                    <p>This video cannot be previewed inside the app.</p>
                    <a
                      href={resolvedVideo.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Open externally
                    </a>
                  </div>
                )}
              </div>

              {/* Description & Transcription */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">Description</h3>
                  <div className="min-h-[100px] rounded-2xl border border-gray-200 bg-white">
                    <TiptapViewer content={video.description || 'No description provided.'} />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">Transcription</h3>
                  <div className="min-h-[100px] rounded-2xl border border-gray-200 bg-white">
                    <TiptapViewer content={video.transcription || 'No transcription available.'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
