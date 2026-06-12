'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { PatternText } from '@/components/ui/pattern-text';
import { getResumeVideoUrls } from '@/lib/supabase';

export default function AboutPage() {
  const { t } = useLang();
  const [videos, setVideos] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState<number>(0);

  useEffect(() => {
    getResumeVideoUrls().then(urls => {
      setVideos(urls);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-8 py-9">
      {/* ── Hero heading ─────────────────────────────── */}
      <div className="mb-3 overflow-hidden">
        <PatternText
          text={t('about_title')}
          className="!text-[3.5rem] md:!text-[5rem] !font-semibold italic leading-none"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        />
      </div>
      <p className="text-sm text-white/30 font-light mb-10">{t('about_sub')}</p>

      {/* ── Resume video player ──────────────────────── */}
      {videos.length > 0 && (
        <div className="mb-10">
          {/* Main player */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/[0.07] mb-3">
            <video
              key={videos[activeVideo]}
              src={videos[activeVideo]}
              controls
              autoPlay={false}
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail strip */}
          {videos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {videos.map((url, i) => (
                <button
                  key={url}
                  onClick={() => setActiveVideo(i)}
                  className={`relative flex-shrink-0 w-24 aspect-video rounded-xl overflow-hidden border transition-all duration-200 ${
                    i === activeVideo
                      ? 'border-white/50 scale-[1.04]'
                      : 'border-white/[0.08] opacity-50 hover:opacity-80 hover:border-white/25'
                  }`}
                >
                  <video src={url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-[10px] text-white">▶</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Bio + Tools ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7">
          <p className="text-white/60 text-sm leading-relaxed font-light">
            Content creator at the intersection of{' '}
            <strong className="text-white/80">AI, visual art, and mindful living</strong>.
            I create videos, AI artworks, and music that tell stories without unnecessary words.
          </p>
          <p className="text-white/40 text-sm leading-relaxed font-light mt-4">
            Working with: <strong className="text-white/60">ChatGPT, Midjourney, Claude, Suno, Google AI</strong>
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['AI Content', 'Video Production', 'AI Art', 'Music AI', 'Adaptogens', 'Storytelling'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/[0.06] border border-white/[0.08] rounded-full text-xs text-white/40">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7">
          <h2
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            className="text-2xl font-semibold italic text-white/70 mb-4"
          >
            Skills & Tools
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: 'Midjourney', icon: '⛵' },
              { name: 'ChatGPT', icon: '✦' },
              { name: 'Claude', icon: '◆' },
              { name: 'Suno', icon: '♪' },
              { name: 'Google AI', icon: 'G' },
              { name: 'Photoshop', icon: 'Ps' },
              { name: 'CapCut', icon: '▶' },
              { name: 'Illustrator', icon: 'Ai' },
            ].map(tool => (
              <div key={tool.name} className="flex flex-col items-center gap-1.5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-base text-white/60">
                  {tool.icon}
                </div>
                <span className="text-[10px] text-white/30">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
