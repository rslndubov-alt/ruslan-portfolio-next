'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getVideoByCategory, getVideoFolders } from '@/lib/supabase';
import Hero from '@/components/Hero';
import { Play } from 'lucide-react';

export default function VideoPage() {
  const { t } = useLang();
  const [videos, setVideos] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideoFolders().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    setActiveIdx(0);
    getVideoByCategory(activeCategory).then(urls => { setVideos(urls); setLoading(false); });
  }, [activeCategory]);

  const getName = (url: string) => {
    try {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1])
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]/g, ' ');
    } catch { return ''; }
  };

  const label = (cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1);

  return (
    <div style={{ paddingTop: '28px' }}>
      <Hero />

      <section style={{ marginTop: '32px', paddingBottom: '48px' }}>
        <h2 style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#fff', marginBottom: '16px', letterSpacing: '0.5px', textAlign: 'center' }}>
          {t('video_title')}
        </h2>

        {/* ── DYNAMIC FILTER BUTTONS ── */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '8px 20px', borderRadius: '100px',
                border: activeCategory === 'all' ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
                background: activeCategory === 'all' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                color: activeCategory === 'all' ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: '0.8rem', fontWeight: activeCategory === 'all' ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', letterSpacing: '0.3px',
              }}
            >All</button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 20px', borderRadius: '100px',
                  border: activeCategory === cat ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  background: activeCategory === cat ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                  color: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontSize: '0.8rem', fontWeight: activeCategory === cat ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', letterSpacing: '0.3px',
                }}
              >{label(cat)}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>Loading...</div>
        ) : videos.length > 0 ? (
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
            Upload videos to Supabase &quot;videos&quot; bucket
          </div>
        )}
      </section>
    </div>
  );
}
