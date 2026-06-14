'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getResumeVideoUrls } from '@/lib/supabase';
import Image from 'next/image';
import { Play } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLang();
  const [videos, setVideos] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    getResumeVideoUrls().then(setVideos);
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

      {/* ── VIDEO PLAYER + CAROUSEL (bucket: resume) ── */}
      <section className="mt-8">
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
            Upload videos to Supabase &quot;resume&quot; bucket
          </div>
        )}
      </section>

      {/* ── TOOLS ── */}
      <section className="mt-12 text-center pb-12">
        <h2 className="font-serif text-[1.6rem] italic font-semibold text-white/45 mb-6 tracking-[0.5px]">
          Skills &amp; Tools
        </h2>
        <div className="flex justify-center gap-3.5 flex-wrap">
          {[
            { name: 'Midjourney', d: 'M5.5 4.5L12 17.5L18.5 4.5H16L12 12.5L8 4.5H5.5Z' },
            { name: 'ChatGPT', d: 'M22.28 9.82a5.98 5.98 0 00-.52-4.91 6.05 6.05 0 00-6.51-2.9A6.07 6.07 0 004.98 4.18a5.98 5.98 0 00-3.99 2.9 6.05 6.05 0 00.74 7.1 5.98 5.98 0 00.51 4.9 6.05 6.05 0 006.52 2.9A5.98 5.98 0 0013.26 24a6.06 6.06 0 005.77-4.21 5.99 5.99 0 003.99-2.9 6.06 6.06 0 00-.74-7.07z' },
            { name: 'Claude', d: 'M13.5 3L6 21h2.5l1.5-4h6l1.5 4H20L12.5 3h-1zm-2.8 12l2.3-6.2 2.3 6.2H10.7z' },
            { name: 'Suno', d: 'M12 3v10.55A4 4 0 1014 17V7h4V3h-6z' },
            { name: 'Google AI', d: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' },
            { name: 'Photoshop', d: '' },
            { name: 'CapCut', d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z' },
            { name: 'Illustrator', d: '' },
          ].map(tool => (
            <div key={tool.name} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 bg-[#161616] border border-white/[0.08] rounded-[18px] flex items-center justify-center transition-all duration-200 group-hover:-translate-y-[3px] group-hover:border-white/20">
                {tool.d ? (
                  <svg viewBox="0 0 24 24" className="w-[30px] h-[30px]"><path d={tool.d} fill="white" opacity=".9"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-[30px] h-[30px]">
                    <rect x="2" y="2" width="20" height="20" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                    <text x="12" y="15.5" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="white">
                      {tool.name === 'Photoshop' ? 'Ps' : 'Ai'}
                    </text>
                  </svg>
                )}
              </div>
              <span className="text-[0.72rem] font-normal text-white/40 tracking-[0.2px]">{tool.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
