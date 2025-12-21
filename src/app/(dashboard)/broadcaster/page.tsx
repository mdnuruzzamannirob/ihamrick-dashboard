'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Square,
  Radio,
  ArrowLeft,
  Activity,
  Hash,
  Database,
  Globe,
  Users,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useEndPodcastMutation } from '../../../../services/allApi';

const defaultServer = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://10.10.20.73:5005';

export default function BroadcasterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const [endPodcast, { isLoading: isEnding }] = useEndPodcastMutation();

  const [podcastId, setPodcastId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [serverUrl, setServerUrl] = useState(defaultServer);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [listenerCount, setListenerCount] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);

  useEffect(() => {
    const pid = searchParams.get('podcastId');
    const sid = searchParams.get('sessionId');
    if (pid) setPodcastId(pid);
    if (sid) setSessionId(sid);
  }, [searchParams]);

  const startBroadcast = async () => {
    try {
      const socket = io(`${serverUrl}/podcast`, {
        transports: ['websocket'],
        reconnection: true,
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        setIsConnected(true);
        socket.emit('join-podcast', { podcastId, role: 'broadcaster' });
      });

      socket.on('disconnect', () => setIsConnected(false));
      socket.on('listener-update', (data: { count: number }) => setListenerCount(data.count || 0));

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
        if (event.data.size > 0 && socket.connected) {
          const buffer = await event.data.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

          socket.emit('broadcast-audio', {
            podcastId,
            sessionId,
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
      toast.success('Broadcast is Live!');
    } catch (err: any) {
      toast.error(err.message || 'Could not start broadcast. Check mic permissions.');
      stopBroadcast();
    }
  };

  const stopBroadcast = async () => {
    try {
      mediaRecorderRef.current?.stop();
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());
      socketRef.current?.disconnect();

      mediaRecorderRef.current = null;
      audioStreamRef.current = null;
      socketRef.current = null;

      setIsBroadcasting(false);
      setChunkCount(0);

      if (podcastId && isBroadcasting) {
        await endPodcast(podcastId).unwrap();
        toast.success('Session Ended');
        router.push('/manage-podcasts');
      }
    } catch {
      toast.error('Error ending session');
    }
  };

  useEffect(() => {
    return () => {
      if (isBroadcasting) stopBroadcast();
    };
  }, []);

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
                      onClick={startBroadcast}
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

          {/* Sidebar */}
          <div className="space-y-8 lg:col-span-4">
            {/* Listener Analytics */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-10 text-white shadow-2xl shadow-indigo-100">
              <div className="relative z-10">
                <div className="mb-2 flex items-center gap-2">
                  <Users size={20} className="text-indigo-200" />
                  <span className="text-xs font-black tracking-[0.2em] text-indigo-200 uppercase">
                    Live Listeners
                  </span>
                </div>
                <h2 className="text-7xl font-black tabular-nums">{listenerCount}</h2>
                <div className="mt-6 flex w-fit items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/30 px-3 py-1 text-xs font-bold">
                  <Activity size={14} className="animate-pulse" /> Audio Streaming
                </div>
              </div>
              <Users size={180} className="absolute -right-6 -bottom-6 opacity-10" />
            </div>
            {/* Technical Metadata Card */}

            <div className="rounded-[2.5rem] border border-slate-50 bg-white p-8 shadow-xl shadow-slate-200">
              <h3 className="mb-8 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase">
                <Database size={16} /> Broadcast Metadata
              </h3>

              <div className="space-y-8">
                {/* Full Podcast ID */}
                <div>
                  <label className="mb-3 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                    <Hash size={12} /> Podcast ID
                  </label>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 font-mono text-sm leading-relaxed font-bold break-all text-slate-700 shadow-sm">
                    {podcastId || 'NOT_CONNECTED'}
                  </div>
                </div>

                {/* Full Session ID */}
                <div>
                  <label className="mb-3 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                    <Activity size={12} /> Session ID
                  </label>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 font-mono text-sm leading-relaxed font-bold break-all text-slate-700 shadow-sm">
                    {sessionId || 'AWAITING_LIVE_SESSION'}
                  </div>
                </div>

                {/* Server URL */}
                <div>
                  <label className="mb-3 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                    <Globe size={12} /> Target Server
                  </label>
                  <input
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600 transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    disabled={isBroadcasting}
                  />
                </div>

                {/* Stats Summary */}
                <div className="border-t border-slate-50 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Data Transmitted
                    </span>
                    <span className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-black text-indigo-600">
                      {chunkCount} Chunks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
