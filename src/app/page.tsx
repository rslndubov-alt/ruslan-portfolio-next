'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getResumeVideoUrls } from '@/lib/supabase';
import { X, Play } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const { t } = useLang();
  const [videos, setVideos] = useState<string[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    getResumeVideoUrls().then(v => setVideos(v));
  }, []);

  // Pad videos to always show 5 slots for the layout
  const displayVideos = [...videos];
  while (displayVideos.length < 5) {
    displayVideos.push(''); // placeholder
  }

  return (
    <>
      <div className="w-full px-8 pt-7">
        {/* HERO SECTION */}
        <section id="about" className="flex flex-wrap md:flex-nowrap items-start justify-between gap-7">
          <div className="w-full md:w-[240px] shrink-0">
            <h1 className="font-serif text-[clamp(3.2rem,6.5vw,5.5rem)] font-semibold italic leading-[0.95] tracking-[-0.5px] text-white">
              Ruslan<br />Dubov
            </h1>
          </div>
          <div className="flex-1 pt-2 order-3 md:order-none min-w-full md:min-w-0">
            <div className="text-[0.88rem] text-white/40 leading-[1.85] font-light">
              <p dangerouslySetInnerHTML={{ __html: t('bio1') || 'My name is <strong>Ruslan Dubov</strong> &mdash; a content creator at the intersection of <strong>AI, visual art, and mindful living</strong>. I create videos, AI artworks, and music that tell stories without unnecessary words.' }} />
              <p className="mt-2.5" dangerouslySetInnerHTML={{ __html: t('bio2') || 'I work with: <strong>ChatGPT, Midjourney, Claude, Suno, Google AI</strong> &mdash; turning ideas into a finished product faster than ever.' }} />
              
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {['AI Content', 'Video Production', 'AI Art', 'Music AI', 'Adaptogens', 'Storytelling'].map(tag => (
                  <span key={tag} className="px-3.5 py-1 bg-white/[0.04] border border-white/10 rounded-full text-[0.72rem] text-white/30 tracking-[0.2px]">
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

        {/* WORK SECTION - New Video Player Carousel */}
        <section id="work" className="mt-12 md:mt-16">
          {videos.length > 0 ? (
            <div className="w-full">
              {videos[activeVideoIndex].match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video
                  key={videos[activeVideoIndex]}
                  src={videos[activeVideoIndex]}
                  controls
                  playsInline
                  className="w-full aspect-video rounded-2xl bg-black border border-white/10 block"
                />
              ) : (
                <img
                  key={videos[activeVideoIndex]}
                  src={videos[activeVideoIndex]}
                  alt="Artwork"
                  className="w-full aspect-video rounded-2xl bg-black border border-white/10 block object-contain"
                />
              )}
              {videos.length > 1 && (
                <div className="flex gap-2.5 mt-2.5 overflow-x-auto pb-1 scrollbar-hide">
                  {videos.map((url, i) => (
                    <button 
                      key={url + i} 
                      onClick={() => setActiveVideoIndex(i)} 
                      className={`shrink-0 w-24 aspect-video rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer p-0 bg-transparent relative ${i === activeVideoIndex ? 'border-white/60 opacity-100 scale-[1.02]' : 'border-white/10 opacity-45 hover:opacity-75'}`}
                    >
                      {url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                        <video src={url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                      ) : (
                        <img src={url} alt="Thumb" className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
             <div className="w-full aspect-video bg-[#141414] rounded-2xl border border-white/10 flex flex-col items-center justify-center text-white/30 text-sm">
                <Play className="w-8 h-8 mb-3 opacity-20" />
                Upload videos to Supabase "resume" bucket
             </div>
          )}
        </section>

        {/* TOOLS SECTION */}
        <section id="tools" className="mt-12 text-center pb-12">
          <h2 className="font-serif text-[1.6rem] italic font-semibold text-white/45 mb-6 tracking-[0.5px]">
            Skills & Tools
          </h2>
          <div className="flex justify-center gap-3.5 flex-wrap">
            {[
              { name: 'Midjourney', svg: <><path d="M5.5 4.5L12 17.5L18.5 4.5H16L12 12.5L8 4.5H5.5Z" fill="white" opacity=".9"/><path d="M3 19.5H21L19 16H5L3 19.5Z" fill="white" opacity=".5"/></> },
              { name: 'ChatGPT', svg: <path d="M22.28 9.82a5.98 5.98 0 00-.52-4.91 6.05 6.05 0 00-6.51-2.9A6.07 6.07 0 004.98 4.18a5.98 5.98 0 00-3.99 2.9 6.05 6.05 0 00.74 7.1 5.98 5.98 0 00.51 4.9 6.05 6.05 0 006.52 2.9A5.98 5.98 0 0013.26 24a6.06 6.06 0 005.77-4.21 5.99 5.99 0 003.99-2.9 6.06 6.06 0 00-.74-7.07zM13.26 22.5a4.48 4.48 0 01-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 00.39-.68V11.3l2.02 1.17a.07.07 0 01.04.05v5.58a4.5 4.5 0 01-4.49 4.4zm-9.66-4.13a4.47 4.47 0 01-.53-3.01l.14.08 4.78 2.76a.77.77 0 00.78 0l5.84-3.37v2.33a.08.08 0 01-.03.06L9.74 19.95a4.5 4.5 0 01-6.14-1.58zM2.34 7.9a4.48 4.48 0 012.37-1.97v5.67a.77.77 0 00.39.68l5.81 3.35-2.02 1.17a.08.08 0 01-.07 0L3.56 13.9A4.5 4.5 0 012.34 7.9zm16.6 3.86l-5.84-3.38 2.02-1.17a.08.08 0 01.07 0l4.83 2.79a4.49 4.49 0 01-.68 8.1V12.4a.79.79 0 00-.4-.64zm2.01-3.02l-.14-.09-4.77-2.78a.78.78 0 00-.79 0L9.41 9.24V6.9a.07.07 0 01.03-.06l4.83-2.79a4.5 4.5 0 016.68 4.66zM8.31 12.86l-2.02-1.16a.08.08 0 01-.04-.06V6.07a4.5 4.5 0 017.38-3.45l-.14.08-4.78 2.76a.8.8 0 00-.4.68v6.72zm1.1-2.37l2.6-1.5 2.61 1.5v3l-2.6 1.5-2.61-1.5v-3z" fill="white" opacity=".9"/> },
              { name: 'Claude', svg: <><path d="M13.5 3L6 21h2.5l1.5-4h6l1.5 4H20L12.5 3h-1zm-2.8 12l2.3-6.2 2.3 6.2H10.7z" fill="white" opacity=".9"/></> },
              { name: 'Suno', svg: <><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" fill="white" opacity=".9"/></> },
              { name: 'Google AI', svg: <><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white" opacity=".85"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" opacity=".6"/><path d="M5.84 14.09A6.01 6.01 0 015.49 12c0-.72.13-1.43.35-2.09V7.07H2.18A10 10 0 001 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" fill="white" opacity=".35"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" opacity=".25"/></> },
              { name: 'Photoshop', svg: <><rect x="2" y="2" width="20" height="20" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/><text x="12" y="15.5" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="white">Ps</text></> },
              { name: 'CapCut', svg: <><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="white" opacity=".9"/></> },
              { name: 'Illustrator', svg: <><rect x="2" y="2" width="20" height="20" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/><text x="12" y="15.5" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="white">Ai</text></> },
            ].map(tool => (
              <div key={tool.name} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 bg-[#161616] border border-white/10 rounded-[18px] flex items-center justify-center transition-all duration-200 group-hover:-translate-y-1 group-hover:border-white/20">
                  <svg viewBox="0 0 24 24" className="w-[30px] h-[30px]">{tool.svg}</svg>
                </div>
                <span className="text-[0.72rem] font-light text-white/40 tracking-[0.2px]">{tool.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
