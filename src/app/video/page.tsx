'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getVideoUrls } from '@/lib/supabase';
import Image from 'next/image';
import { Play } from 'lucide-react';

export default function VideoPage() {
  const { t } = useLang();
  const [videos, setVideos] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    getVideoUrls().then(setVideos);
  }, []);

  const getName = (url: string) => {
    try {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1])
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]/g, ' ');
    } catch { return ''; }
  };

  return (
    <div className="w-full px-8 pt-7">
      {/* ── HERO ── */}
      <section className="flex flex-wrap md:flex-nowrap items-start justify-between gap-7">
        <div className="w-full md:w-[240px] shrink-0">
          <h1 className="font-serif text-[clamp(3.2rem,6.5vw,5.5rem)] font-semibold italic leading-[0.95] tracking-[-0.5px] text-white">
            Ruslan<br />Dubov
          </h1>
        </div>
        <div className="flex-1 pt-2 order-3 md:order-none min-w-full md:min-w-0">
          <div className="text-[0.88rem] text-white/40 leading-[1.85] font-light [&_strong]:text-white/[0.72] [&_strong]:font-medium">
            <p dangerouslySetInnerHTML={{ __html: t('bio1') }} />
            <p className="mt-2.5" dangerouslySetInnerHTML={{ __html: t('bio2') }} />
            <div className="flex flex-wrap gap-1.5 mt-3.5">
              {['AI Content', 'Video Production', 'AI Art', 'Music AI', 'Adaptogens', 'Storytelling'].map(tag => (
                <span key={tag} className="px-3.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-[0.72rem] text-white/[0.32] tracking-[0.2px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="shrink-0 w-[110px] h-[110px] md:w-[155px] md:h-[155px] rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a] p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_40px_rgba(255,255,255,0.05)]">
          <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a]">
            <Image src="/photo.jpg" alt="Ruslan Dubov" width={155} height={155} className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </section>

      {/* ── VIDEO PLAYER + CAROUSEL ── */}
      <section className="mt-8 pb-12">
        <h2 className="font-serif text-[1.6rem] italic font-semibold text-white/45 mb-6 tracking-[0.5px] text-center">
          {t('video_title')}
        </h2>

        {videos.length > 0 ? (
          <div className="w-full">
            {/* Main player */}
            <video
              key={videos[activeIdx]}
              src={videos[activeIdx]}
              controls
              playsInline
              className="w-full aspect-video rounded-2xl bg-black border border-white/[0.08] block"
            />
            <div className="mt-2 px-1">
              <div className="text-[0.9rem] font-medium text-white/65">{getName(videos[activeIdx])}</div>
              <div className="text-[0.7rem] text-white/25">AI · Ruslan Dubov</div>
            </div>

            {/* Thumbnail carousel */}
            {videos.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {videos.map((url, i) => (
                  <button
                    key={url + i}
                    onClick={() => setActiveIdx(i)}
                    className={`shrink-0 w-28 aspect-video rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer p-0 bg-transparent relative group ${
                      i === activeIdx
                        ? 'border-white/60 opacity-100 ring-1 ring-white/30'
                        : 'border-white/[0.08] opacity-50 hover:opacity-80 hover:border-white/20'
                    }`}
                  >
                    <video src={url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-white/80" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full aspect-video bg-[#141414] rounded-2xl border border-white/[0.08] flex flex-col items-center justify-center text-white/30 text-sm">
            <Play className="w-8 h-8 mb-3 opacity-20" />
            Upload videos to Supabase &quot;videos&quot; bucket
          </div>
        )}
      </section>
    </div>
  );
}
