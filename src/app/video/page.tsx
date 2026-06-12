'use client';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { getVideoUrls } from '@/lib/supabase';
import { PatternText } from '@/components/ui/pattern-text';

export default function VideoPage() {
  const { t } = useLang();
  const [videos, setVideos] = useState<string[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideoUrls().then(urls => { setVideos(urls); setLoading(false); });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-8 py-9">
      <div className="mb-2">
        <PatternText
          text={t('video_title')}
          className="!text-[3.5rem] md:!text-[5rem] !font-semibold italic leading-none"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        />
      </div>
      <p className="text-sm text-white/30 font-light mb-8">{t('video_sub')}</p>

      {/* Modal player */}
      {playing && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6" onClick={() => setPlaying(null)}>
          <button className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20" onClick={() => setPlaying(null)}>✕</button>
          <video src={playing} controls autoPlay className="max-h-[85vh] max-w-[90vw] rounded-xl" onClick={e => e.stopPropagation()}/>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin"/>
        </div>
      ) : !videos.length ? (
        <p className="text-center py-20 text-white/20 text-sm">Upload videos to Supabase "videos" bucket.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((url, i) => (
            <VideoCard key={url} url={url} index={i} onPlay={() => setPlaying(url)} />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoCard({ url, index, onPlay }: { url: string; index: number; onPlay: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <div
      className="group relative bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden aspect-video cursor-pointer hover:border-white/20 transition-all"
      onClick={onPlay}
      onMouseEnter={() => ref.current?.play()}
      onMouseLeave={() => { ref.current?.pause(); if (ref.current) ref.current.currentTime = 0; }}
    >
      <video ref={ref} src={url} muted loop playsInline preload="metadata" className="w-full h-full object-cover"/>
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
        <div className="w-12 h-12 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white group-hover:bg-white/25 transition-all">
          <span className="ml-0.5">▶</span>
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70">
        <p className="text-xs text-white/50">Video {index + 1}</p>
      </div>
    </div>
  );
}
