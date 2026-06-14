'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLang } from '@/lib/i18n';
import { getMusicByCategory, getMusicFolders, getArtsAllCategories } from '@/lib/supabase';
import { useMediaMeta } from '@/lib/useMediaMeta';
import Hero from '@/components/Hero';

export default function MusicPage() {
  const { lang, t } = useLang();
  const { getMeta } = useMediaMeta();
  const [tracks, setTracks] = useState<string[]>([]);
  const [arts, setArts] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  useEffect(() => {
    getMusicFolders().then(setCategories);
    getArtsAllCategories().then(setArts);
  }, []);

  useEffect(() => {
    setLoading(true);
    setPlayingIdx(null);
    getMusicByCategory(activeCategory).then(urls => { setTracks(urls); setLoading(false); });
  }, [activeCategory]);

  const trackArts = useMemo(() => {
    if (!arts.length) return [];
    // Shuffle arts with seeded distribution to give each track a unique art
    const shuffled = [...arts].sort((a, b) => a.localeCompare(b));
    const used = new Set<number>();
    return tracks.map((_, i) => {
      // Find next unused art, cycling through if needed
      let idx = (i * 13 + 5) % shuffled.length;
      while (used.has(idx) && used.size < shuffled.length) {
        idx = (idx + 1) % shuffled.length;
      }
      used.add(idx);
      if (used.size >= shuffled.length) used.clear();
      return shuffled[idx];
    });
  }, [tracks, arts]);

  const idleArt = useMemo(() => {
    if (!arts.length) return '';
    return arts[Math.floor(Math.random() * arts.length)];
  }, [arts]);

  const currentArt = playingIdx !== null && trackArts[playingIdx]
    ? trackArts[playingIdx] : idleArt;

  const getName = (url: string) => {
    try {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1])
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]/g, ' ');
    } catch { return 'Track'; }
  };

  const label = (cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1);

  const handlePlay = (idx: number) => {
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== idx) audio.pause();
    });
    setPlayingIdx(idx);
  };

  return (
    <div style={{ paddingTop: '28px' }}>
      <Hero />

      <section style={{ marginTop: '32px', paddingBottom: '48px' }}>
        <h2 style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#fff', marginBottom: '16px', letterSpacing: '0.5px', textAlign: 'center' }}>
          {((t as (key: string) => string)('music_title')) || 'Music'}
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

        {/* ── ART VISUALIZER ── */}
        {currentArt && (
          <div style={{
            width: '100%', height: '420px', marginBottom: '20px',
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.07)',
            background: '#000',
            position: 'relative',
          }}>
            <img
              key={currentArt}
              src={currentArt} alt="Now playing art"
              onContextMenu={e => e.preventDefault()}
              style={{
                maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                display: 'block', margin: '0 auto',
                opacity: playingIdx !== null ? 1 : 0.4,
                transition: 'opacity 0.8s ease',
                animation: playingIdx !== null ? 'kenburns 20s ease-in-out infinite alternate' : 'none',
                transformOrigin: 'center center',
              }}
            />
            {/* Dark gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.05) 70%, rgba(0,0,0,0.3) 100%)',
              pointerEvents: 'none',
            }} />
            {/* Track info overlay */}
            {playingIdx !== null && (
              <div style={{
                position: 'absolute', bottom: '16px', left: '16px', right: '16px',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              }}>
                <div>
                  {(() => {
                    const meta = getMeta(tracks[playingIdx], lang);
                    const title = meta?.title || getName(tracks[playingIdx]);
                    const desc = meta?.desc;
                    return (
                      <>
                        <div style={{
                          fontSize: '1.1rem', fontWeight: 600, color: '#fff',
                          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                          marginBottom: '4px',
                        }}>
                          {title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textShadow: '0 1px 4px rgba(0,0,0,0.5)', maxWidth: '90%', lineHeight: 1.3 }}>
                          {desc || 'AI · Suno · Ruslan Dubov'}
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                  borderRadius: '100px', padding: '5px 14px',
                  fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.5s ease infinite' }} />
                  Now Playing
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TRACK LIST ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>Loading...</div>
        ) : tracks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tracks.map((url, i) => (
              <div
                key={url + i}
                style={{
                  padding: '20px',
                  background: playingIdx === i ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                  border: playingIdx === i ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px', transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden',
                    flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
                  }}>
                    {trackArts[i] ? (
                      <img src={trackArts[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onContextMenu={e => e.preventDefault()} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: 'rgba(255,255,255,0.2)' }}>🎵</div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    {(() => {
                      const meta = getMeta(url, lang);
                      const title = meta?.title || getName(url);
                      const desc = meta?.desc;
                      return (
                        <>
                          <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>{title}</div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', lineHeight: 1.3 }}>
                            {desc || 'AI · Suno · Ruslan Dubov'}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <audio
                  ref={el => { audioRefs.current[i] = el; }}
                  src={url} controls controlsList="nodownload"
                  onContextMenu={e => e.preventDefault()}
                  onPlay={() => handlePlay(i)}
                  onPause={() => { if (playingIdx === i) setPlayingIdx(null); }}
                  style={{ width: '100%', height: '36px', borderRadius: '8px' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
            🎵 Upload music to Supabase &quot;music&quot; bucket
          </div>
        )}
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes kenburns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          33% {
            transform: scale(1.08) translate(-1%, 1%);
          }
          66% {
            transform: scale(1.12) translate(1%, -0.5%);
          }
          100% {
            transform: scale(1.15) translate(-0.5%, 0.5%);
          }
        }
      `}</style>
    </div>
  );
}
