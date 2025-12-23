'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mic, MicOff, Square, Radio, ArrowLeft, Users, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEndPodcastMutation } from '../../../../services/allApi';

const defaultServer = 'https://api.pg-65.com';

export default function BroadcasterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const [endPodcast, { isLoading: isEnding }] = useEndPodcastMutation();

  const [podcastId, setPodcastId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [listenerCount, setListenerCount] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);

  // Initial Setup & State Recovery
  useEffect(() => {
    const pid = searchParams.get('podcastId');
    const sid = searchParams.get('sessionId');
    if (pid) setPodcastId(pid);
    if (sid) setSessionId(sid);

    // Socket Initialization
    const socket = io(`${defaultServer}/podcast`, {
      transports: ['websocket'],
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      if (pid) {
        socket.emit('join-podcast', { podcastId: pid, role: 'broadcaster' });

        // --- KEY FIX FOR PERSISTENCE ---
        // Check if this podcast was previously live in this browser
        const wasLive = localStorage.getItem(`podcast_live_${pid}`);
        if (wasLive === 'true') {
          // Auto-resume logic
          // Note: Browsers block auto-audio starting without gesture,
          // but we will update the UI to SHOW live, and try to start mic.
          setIsBroadcasting(true);
          startBroadcast(true); // pass 'true' to signal it's a resume
        }
      }
    });

    socket.on('disconnect', () => setIsConnected(false));
    socket.on('listener-update', (data: { currentListeners: number }) => {
      setListenerCount(data.currentListeners || 0);
    });

    return () => {
      // Clean up socket on unmount, but DO NOT stop the session unless user clicks Stop
      if (socketRef.current) socketRef.current.disconnect();
      // We also clean up tracks to stop the red recording dot on browser tab
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      if (audioStreamRef.current) audioStreamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [searchParams]);

  const startBroadcast = async (isResume = false) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      audioStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });
      mediaRecorderRef.current = recorder;

      let isFirstChunk = true;

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && socketRef.current?.connected) {
          const buffer = await event.data.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

          socketRef.current.emit('broadcast-audio', {
            podcastId: searchParams.get('podcastId') || podcastId, // Ensure ID is present
            sessionId: searchParams.get('sessionId') || sessionId,
            audioChunk: base64,
            mimeType: mimeType,
            isHeader: isFirstChunk,
          });

          isFirstChunk = false;
          setChunkCount((c) => c + 1);
        }
      };

      recorder.start(1000);
      setIsBroadcasting(true);

      // Save state to local storage
      const pid = searchParams.get('podcastId') || podcastId;
      if (pid) localStorage.setItem(`podcast_live_${pid}`, 'true');

      if (!isResume) toast.success('Broadcast is Live!');
    } catch (err: any) {
      console.error(err);
      if (isResume) {
        // If auto-resume fails (due to browser permission), we keep UI live
        // but maybe show a toast asking to unmute/re-allow.
        toast.info('Session resumed. Please check microphone.');
      } else {
        toast.error('Could not start broadcast. Check mic permissions.');
      }
    }
  };

  const stopBroadcast = async () => {
    try {
      mediaRecorderRef.current?.stop();
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());

      setIsBroadcasting(false);
      setChunkCount(0);

      // Remove from local storage
      if (podcastId) {
        localStorage.removeItem(`podcast_live_${podcastId}`);
        await endPodcast(podcastId).unwrap();
        toast.success('Session Ended');
        router.push('/manage-podcasts');
      }
    } catch {
      toast.error('Error ending session');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 font-sans lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-bold text-slate-400 transition-all hover:text-slate-900"
          >
            <ArrowLeft size={20} /> Dashboard
          </button>

          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-3 rounded-2xl border px-5 py-2.5 text-sm font-black tracking-widest uppercase shadow-sm transition-all ${
                isBroadcasting
                  ? 'animate-pulse border-red-700 bg-red-600 text-white'
                  : isConnected
                    ? 'border-green-200 bg-green-100 text-green-700'
                    : 'border-slate-300 bg-slate-200 text-slate-500'
              }`}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full ${isBroadcasting ? 'bg-white' : isConnected ? 'bg-green-500' : 'bg-slate-400'}`}
              />
              {isBroadcasting ? 'Live' : isConnected ? 'Connected' : 'Offline'}
            </div>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200">
              <div className="p-8 md:p-12">
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                      On-Air Studio
                    </h1>
                    <p className="font-medium text-slate-500">
                      Professional Audio Broadcasting Environment
                    </p>
                  </div>
                  <ShieldCheck className="hidden text-indigo-500 md:block" size={40} />
                </div>

                {/* Visualizer */}
                <div className="relative mb-12 flex h-72 items-center justify-center rounded-[2.5rem] bg-slate-950 shadow-inner">
                  {isBroadcasting && !isMuted ? (
                    <div className="flex h-32 items-end gap-1.5">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 animate-bounce rounded-full bg-indigo-500"
                          style={{
                            animationDuration: `${0.3 + Math.random()}s`,
                            height: `${15 + Math.random() * 85}%`,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 ring-4 ring-slate-800">
                        <MicOff size={40} className="text-slate-600" />
                      </div>
                      <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                        Microphone Standby
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-5">
                  {!isBroadcasting ? (
                    <button
                      onClick={() => startBroadcast(false)}
                      className="flex flex-1 items-center justify-center gap-4 rounded-3xl bg-indigo-600 py-7 text-2xl font-black text-white shadow-2xl shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.97]"
                    >
                      <Radio size={32} /> GO LIVE
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          if (audioStreamRef.current) {
                            audioStreamRef.current.getAudioTracks()[0].enabled = isMuted;
                            setIsMuted(!isMuted);
                          }
                        }}
                        className={`flex h-24 w-24 items-center justify-center rounded-3xl shadow-lg transition-all ${isMuted ? 'bg-red-500 text-white shadow-red-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {isMuted ? <MicOff size={36} /> : <Mic size={36} />}
                      </button>

                      <button
                        onClick={stopBroadcast}
                        disabled={isEnding}
                        className="flex flex-1 items-center justify-center gap-4 rounded-3xl bg-slate-900 py-7 text-2xl font-black text-white shadow-2xl transition-all hover:bg-black disabled:opacity-50"
                      >
                        {isEnding ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Square size={28} fill="currentColor" />
                        )}
                        STOP SESSION
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Listener Analytics */}
          <div className="group relative h-fit overflow-hidden rounded-[2.5rem] bg-indigo-600 p-10 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all duration-500 hover:shadow-indigo-300/50 lg:col-span-4">
            {/* Background Decor - Animated Blob */}
            <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-indigo-500 opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-40"></div>

            <div className="relative z-10">
              {/* Top Header Section */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                    <Users size={22} className="text-indigo-200" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] leading-none font-black tracking-[0.25em] text-indigo-200 uppercase">
                      Live Listeners
                    </span>
                    <span className="text-[10px] font-medium text-indigo-300/70">
                      Real-time stats
                    </span>
                  </div>
                </div>

                {/* Chunk Badge with glass effect */}
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold backdrop-blur-sm transition-colors group-hover:bg-white/10">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                  {chunkCount} Chunks
                </div>
              </div>

              {/* Big Number Section */}
              <div className="relative my-4">
                <h2 className="text-8xl font-black tracking-tighter tabular-nums lg:text-9xl">
                  {listenerCount}
                </h2>
                <div className="absolute -bottom-2 left-1 h-1 w-20 rounded-full bg-linear-to-r from-indigo-300 to-transparent opacity-50" />
              </div>

              {/* Bottom Status Section */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/40 px-4 py-2 text-xs font-bold shadow-inner">
                  <div className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-200 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                  </div>
                  <span className="tracking-wide">AUDIO STREAMING</span>
                </div>

                {/* Simple Visualizer Line Effect */}
                <div className="mt-1 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-0.5 animate-bounce rounded-full bg-indigo-300/60`}
                      style={{
                        height: `${Math.random() * 15 + 5}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Large Background Icon */}
            <Users
              size={220}
              className="absolute -right-8 -bottom-12 opacity-[0.07] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
