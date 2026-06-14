'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getResumeVideoUrls } from '@/lib/supabase';
import Hero from '@/components/Hero';
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

      {/* ── DOWNLOAD RESUME ── */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <a
          href="/Ruslan_Dubov_Resume.txt"
          download
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 24px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px',
            fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)',
            cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none',
          }}
        >
          ↓ Download Resume
        </a>
      </div>

      {/* ── VIDEO PLAYER + CAROUSEL (bucket: resume) ── */}
      <section style={{ marginTop: '32px' }}>
        {videos.length > 0 ? (
          <div>
            <video
              key={videos[activeIdx]}
              src={videos[activeIdx]}
              controls
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
                    <video src={url} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

      {/* ── TOOLS ── */}
      <section style={{ marginTop: '48px', textAlign: 'center', paddingBottom: '48px' }}>
        <h2 style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#fff', marginBottom: '24px', letterSpacing: '0.5px' }}>
          Skills &amp; Tools
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {[
            { name: 'Midjourney', d: 'M5.5 4.5L12 17.5L18.5 4.5H16L12 12.5L8 4.5H5.5Z' },
            { name: 'ChatGPT', d: 'M22.28 9.82a5.98 5.98 0 00-.52-4.91 6.05 6.05 0 00-6.51-2.9A6.07 6.07 0 004.98 4.18a5.98 5.98 0 00-3.99 2.9 6.05 6.05 0 00.74 7.1 5.98 5.98 0 00.51 4.9 6.05 6.05 0 006.52 2.9A5.98 5.98 0 0013.26 24a6.06 6.06 0 005.77-4.21 5.99 5.99 0 003.99-2.9 6.06 6.06 0 00-.74-7.07z' },
            { name: 'Claude', d: 'M13.5 3L6 21h2.5l1.5-4h6l1.5 4H20L12.5 3h-1zm-2.8 12l2.3-6.2 2.3 6.2H10.7z' },
            { name: 'Suno', d: 'M12 3v10.55A4 4 0 1014 17V7h4V3h-6z' },
            { name: 'Google AI', d: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' },
            { name: 'CapCut', d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z' },
          ].map(tool => (
            <div key={tool.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '64px', height: '64px', background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" style={{ width: '30px', height: '30px' }}><path d={tool.d} fill="white" opacity=".9"/></svg>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2px' }}>{tool.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
