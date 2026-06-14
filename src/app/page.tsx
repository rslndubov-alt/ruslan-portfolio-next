'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getResumeVideoUrls } from '@/lib/supabase';
import Hero from '@/components/Hero';
import LogoSVG from '@/components/LogoSVG';
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
    <div style={{ paddingTop: '28px' }}>
      <Hero />


      {/* ── VIDEO PLAYER + CAROUSEL (bucket: resume) ── */}
      <section style={{ marginTop: '32px' }}>
        {videos.length > 0 ? (
          <div>
            <video
              key={videos[activeIdx]}
              src={videos[activeIdx]}
              controls
              controlsList="nodownload"
              onContextMenu={e => e.preventDefault()}
              playsInline
              style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', display: 'block' }}
            />
            <div style={{ marginTop: '8px', paddingLeft: '2px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'rgba(255,255,255,0.65)' }}>{getName(videos[activeIdx])}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.28)' }}>AI · Ruslan Dubov</div>
            </div>

            {videos.length > 1 && (
              <div className="scrollbar-hide" style={{ display: 'flex', gap: '10px', marginTop: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {videos.map((url, i) => (
                  <button
                    key={url + i}
                    onClick={() => setActiveIdx(i)}
                    style={{
                      flexShrink: 0, width: '112px', aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden',
                      border: i === activeIdx ? '2px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.08)',
                      opacity: i === activeIdx ? 1 : 0.5,
                      cursor: 'pointer', padding: 0, background: 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <video src={url} muted playsInline preload="metadata" controlsList="nodownload" onContextMenu={e => e.preventDefault()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ width: '100%', aspectRatio: '16/9', background: '#141414', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
            <Play style={{ width: '32px', height: '32px', marginBottom: '12px', opacity: 0.2 }} />
            Upload videos to Supabase &quot;resume&quot; bucket
          </div>
        )}
      </section>

      {/* ── LOGO ── */}
      <section style={{ marginTop: '48px', textAlign: 'center', paddingBottom: '48px' }}>
        <LogoSVG />
      </section>
    </div>
  );
}
