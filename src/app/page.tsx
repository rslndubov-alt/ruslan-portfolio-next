'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { PatternText } from '@/components/ui/pattern-text';
import { getResumeVideoUrls } from '@/lib/supabase';

export default function AboutPage() {
  const { t } = useLang();
  const [videos, setVideos] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    getResumeVideoUrls().then(setVideos);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* ── Heading ─────────────────────────────────── */}
      <div className="mb-1">
        <PatternText
          text={t('about_title')}
          className="text-5xl md:text-7xl font-semibold italic leading-none"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        />
      </div>
      <p className="text-sm text-white/30 font-light mb-8 mt-2">{t('about_sub')}</p>

      {/* ── Resume video player ──────────────────────── */}
      {videos.length > 0 && (
        <div className="mb-8">
          <video
            key={videos[activeVideo]}
            src={videos[activeVideo]}
            controls
            playsInline
            className="w-full aspect-video rounded-2xl bg-black border border-white/[0.07] object-cover"
          />

          {/* Thumbnail strip */}
          {videos.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
              {videos.map((url, i) => (
                <button
                  key={url + i}
                  onClick={() => setActiveVideo(i)}
                  className={`relative flex-shrink-0 w-20 aspect-video rounded-lg overflow-hidden border transition-all ${
                    i === activeVideo
                      ? 'border-white/60 opacity-100'
                      : 'border-white/10 opacity-40 hover:opacity-70'
                  }`}
                >
                  <video src={url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-white text-[10px]">▶</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Bio + Tools ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bio */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <p className="text-white/60 text-sm leading-relaxed font-light">
            Content creator at the intersection of{' '}
            <strong className="text-white/80">AI, visual art, and mindful living</strong>.
            I create videos, AI artworks, and music that tell stories without unnecessary words.
          </p>
          <p className="text-white/40 text-sm leading-relaxed font-light mt-3">
            Working with:{' '}
            <strong className="text-white/60">ChatGPT, Midjourney, Claude, Suno, Google AI</strong>
          </p>
          <div className="flex flex-wrap gap-1.5 mt-5">
            {['AI Content', 'Video', 'AI Art', 'Music AI', 'Adaptogens'].map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-white/[0.05] border border-white/[0.07] rounded-full text-[11px] text-white/35"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h2
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            className="text-xl font-semibold italic text-white/60 mb-4"
          >
            Skills & Tools
          </h2>
          <div className="grid grid-cols-4 gap-2">
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
              <div key={tool.name} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-sm text-white/55">
                  {tool.icon}
                </div>
                <span className="text-[9px] text-white/25 text-center leading-tight">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
