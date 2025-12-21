'use client';

import { Eye, X, Calendar, FileText, Layout, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export function PodcastsViewModal({ podcast }: { podcast: any }) {
  const [viewModalOpen, setViewModalOpen] = useState(false);

  if (!podcast) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <button
        onClick={() => setViewModalOpen(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
        title="View Details"
      >
        <Eye size={16} />
      </button>

      {viewModalOpen && (
        <div
          onClick={() => setViewModalOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in fade-in slide-in-from-bottom-4 relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-300"
          >
            {/* Close Button */}
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-gray-500 shadow-sm transition-all hover:text-black"
            >
              <X size={20} />
            </button>

            <div className="flex-1 overflow-y-auto">
              {/* Header Image Section */}
              <div className="relative h-64 w-full bg-neutral-900">
                <Image
                  src={podcast.coverImageUrl || podcast.coverImage || '/placeholder-podcast.jpg'}
                  alt={podcast.title}
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute right-8 bottom-6 left-8">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                    {podcast.status ? (
                      <CheckCircle size={12} className="text-emerald-400" />
                    ) : (
                      <XCircle size={12} className="text-amber-400" />
                    )}
                    {podcast.status ? 'Published' : 'Draft'}
                  </div>
                  <h1 className="text-3xl font-extrabold text-white">{podcast.title}</h1>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                {/* Info Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        Release Date
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatDate(podcast.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <Layout className="text-gray-400" size={20} />
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        Category
                      </p>
                      <p className="text-sm font-semibold text-gray-800">Podcast Session</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <FileText className="text-gray-400" size={20} />
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        Type
                      </p>
                      <p className="text-sm font-semibold text-gray-800">Audio/Visual Content</p>
                    </div>
                  </div>
                </div>

                {/* Rich Text Areas */}
                <div className="space-y-8">
                  <section>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
                      About this Podcast
                    </h3>
                    <div
                      className="prose prose-sm max-w-none rounded-2xl border border-gray-100 bg-gray-50 p-6 leading-relaxed text-gray-600 italic"
                      dangerouslySetInnerHTML={{
                        __html: podcast.description || 'No description provided.',
                      }}
                    />
                  </section>

                  <section>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
                      Transcription
                    </h3>
                    <div
                      className="prose prose-sm max-w-none rounded-2xl border border-gray-100 bg-gray-50 p-6 leading-relaxed text-gray-600 italic"
                      dangerouslySetInnerHTML={{
                        __html:
                          podcast.transcription || 'Transcription not available for this episode.',
                      }}
                    />
                  </section>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-8 py-4">
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg bg-black px-6 py-2 text-xs font-bold text-white transition-all hover:bg-zinc-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
