'use client';

import {
  Eye,
  X,
  Clock,
  ShieldCheck,
  Info,
  Cast,
  Radio,
  StopCircle,
  Loader2,
  Mic2,
  Calendar,
  FileAudio,
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useStartPodcastMutation, useEndPodcastMutation } from '../../../services/allApi';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function PodcastsViewModal({ podcast, refetch }: { podcast: any; refetch: () => void }) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const router = useRouter();

  const [startPodcast, { isLoading: starting }] = useStartPodcastMutation();
  const [endPodcast, { isLoading: ending }] = useEndPodcastMutation();

  if (!podcast) return null;

  const isLive = podcast.status === 'live';
  const isScheduled = podcast.status === 'scheduled';
  const isEnded = podcast.status === 'ended';

  const handleStartLive = async () => {
    try {
      const res: any = await startPodcast(podcast._id).unwrap();
      toast.success('Starting Live Session...');
      const sessionId = res?.data?.podcast?.liveSessionId || podcast.liveSessionId;
      router.push(`/broadcaster?podcastId=${podcast._id}&sessionId=${sessionId}`);
    } catch {
      toast.error('Failed to start live session');
    }
  };

  const handleStopLive = async () => {
    try {
      await endPodcast(podcast._id).unwrap();
      refetch();
      toast.success('Broadcast ended successfully');
      setViewModalOpen(false);
    } catch {
      toast.error('Failed to stop broadcast');
    }
  };

  const handleEnterStudio = () => {
    if (!podcast.liveSessionId) {
      toast.error('Session ID missing');
      return;
    }
    router.push(`/broadcaster?podcastId=${podcast._id}&sessionId=${podcast.liveSessionId}`);
  };

  return (
    <>
      <button
        onClick={() => setViewModalOpen(true)}
        className="group relative flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white hover:shadow-lg"
      >
        <Eye size={18} />
      </button>

      {viewModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity">
          <div className="absolute inset-0" onClick={() => setViewModalOpen(false)} />

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-slate-900/5">
            {/* Header / Cover Image */}
            <div className="relative h-64 w-full shrink-0 bg-slate-900">
              <Image
                src={podcast.coverImage || '/placeholder.jpg'}
                alt={podcast.title}
                fill
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-black/30" />

              <button
                onClick={() => setViewModalOpen(false)}
                className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
              >
                <X size={20} />
              </button>

              <div className="absolute right-8 bottom-6 left-8">
                <div
                  className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase backdrop-blur-md ${
                    isLive
                      ? 'animate-pulse bg-red-600 text-white'
                      : isScheduled
                        ? 'bg-blue-600/90 text-white'
                        : 'bg-slate-800/80 text-slate-200'
                  }`}
                >
                  {isLive && <span className="h-2 w-2 rounded-full bg-white" />}
                  {podcast.status}
                </div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 lg:text-5xl">
                  {podcast.title}
                </h1>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Stats & Meta */}
                <div className="space-y-6 lg:col-span-1">
                  {/* Duration Card - Now Single and Highlighted */}
                  <div className="flex flex-col rounded-3xl border border-amber-100 bg-amber-50 p-6 transition-all hover:shadow-md">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
                      <Clock size={24} />
                    </div>
                    <p className="text-xs font-bold tracking-wider text-amber-600/60 uppercase">
                      Duration
                    </p>
                    <h2 className="text-3xl font-black tracking-tight text-amber-700">
                      {podcast.duration ? `${podcast.duration} mins` : 'N/A'}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-amber-600/80">Estimated Run Time</p>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                    <h3 className="mb-4 text-xs font-black tracking-widest text-slate-400 uppercase">
                      Information
                    </h3>
                    <div className="space-y-4">
                      <MetaRow
                        icon={<Calendar size={16} />}
                        label="Date"
                        value={formatDate(podcast.date)}
                      />
                      <MetaRow
                        icon={<FileAudio size={16} />}
                        label="Format"
                        value={podcast.audioFormat || 'MP3'}
                      />
                      <MetaRow
                        icon={<ShieldCheck size={16} />}
                        label="Admin"
                        value={podcast.admin?.email?.split('@')[0]}
                      />
                      <MetaRow
                        icon={
                          <div
                            className={`h-3 w-3 rounded-full ${podcast.isRecording ? 'bg-red-500' : 'bg-slate-300'}`}
                          />
                        }
                        label="Recording"
                        value={podcast.isRecording ? 'Enabled' : 'Disabled'}
                      />
                    </div>
                  </div>

                  {isEnded && podcast.recordedSignedUrl && (
                    <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6">
                      <h3 className="mb-2 text-xs text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                        Recording Available
                      </h3>
                      <audio
                        controls
                        className="mt-2 h-8 w-full"
                        src={podcast.recordedSignedUrl}
                      ></audio>
                    </div>
                  )}
                </div>

                {/* Right Column: Description & Transcription */}
                <div className="space-y-8 lg:col-span-2">
                  <ContentSection
                    title="Description"
                    content={podcast.description}
                    icon={<Info size={18} />}
                  />
                  {podcast.transcription && (
                    <ContentSection
                      title="Transcription"
                      content={podcast.transcription}
                      icon={<Mic2 size={18} />}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-100 bg-slate-50/80 p-6 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-800"
                >
                  Dismiss
                </button>

                <div className="flex items-center gap-3">
                  {isScheduled && (
                    <button
                      onClick={handleStartLive}
                      disabled={starting}
                      className="flex items-center gap-2 rounded-xl bg-black px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-slate-800 disabled:opacity-50"
                    >
                      {starting ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Cast size={18} />
                      )}
                      GO LIVE
                    </button>
                  )}

                  {isLive && (
                    <>
                      <button
                        onClick={handleEnterStudio}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700"
                      >
                        <Radio size={18} className="animate-pulse" />
                        ENTER STUDIO
                      </button>
                      <button
                        onClick={handleStopLive}
                        disabled={ending}
                        className="flex items-center gap-2 rounded-xl bg-red-100 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-200 disabled:opacity-50"
                      >
                        {ending ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <StopCircle size={18} />
                        )}
                        STOP LIVE
                      </button>
                    </>
                  )}

                  {isEnded && (
                    <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500">
                      <ShieldCheck size={14} /> Session Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- Reusable Sub-components ---

const MetaRow = ({ icon, label, value }: any) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </div>
    <span className="text-xs font-bold text-slate-900">{value}</span>
  </div>
);

const ContentSection = ({ title, content, icon }: any) => (
  <div className="group">
    <div className="mb-3 flex items-center gap-2 text-slate-400">
      {icon}
      <h3 className="text-xs font-black tracking-widest uppercase transition-colors group-hover:text-indigo-600">
        {title}
      </h3>
    </div>
    <div
      className="prose prose-sm max-w-none rounded-3xl border border-transparent bg-slate-50 p-6 leading-relaxed text-slate-600 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-sm"
      dangerouslySetInnerHTML={{
        __html: content || `<p class="italic opacity-50">No ${title.toLowerCase()} provided.</p>`,
      }}
    />
  </div>
);
