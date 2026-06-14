'use client';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { getMusicUrls } from '@/lib/supabase';
import Hero from '@/components/Hero';

export default function MusicPage() {
  const { t } = useLang();
  const [tracks, setTracks] = useState<string[]>([]);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  useEffect(() => {
    getMusicUrls().then(setTracks);
  }, []);

  const getName = (url: string) => {
    try {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1])
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]/g, ' ');
    } catch { return 'Track'; }
  };

  const handlePlay = (idx: number) => {
    // Pause all other tracks
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== idx) {
        audio.pause();
      }
    });
    setPlayingIdx(idx);
  };

  return (
    <div style={{ paddingTop: '28px' }}>
      <Hero />

      <section style={{ marginTop: '32px', paddingBottom: '48px' }}>
        <h2 style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#fff', marginBottom: '28px', letterSpacing: '0.5px', textAlign: 'center' }}>
          {((t as (key: string) => string)('music_title')) || 'Music'}
        </h2>

        {tracks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tracks.map((url, i) => (
              <div
                key={url + i}
                style={{
                  padding: '20px',
                  background: playingIdx === i ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                  border: playingIdx === i ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: playingIdx === i ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>
                      {getName(url)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>
                      AI · Suno · Ruslan Dubov
                    </div>
                  </div>
                </div>
                <audio
                  ref={el => { audioRefs.current[i] = el; }}
                  src={url}
                  controls
                  controlsList="nodownload"
                  onContextMenu={e => e.preventDefault()}
                  onPlay={() => handlePlay(i)}
                  onPause={() => { if (playingIdx === i) setPlayingIdx(null); }}
                  style={{ width: '100%', height: '36px', borderRadius: '8px' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '60px 0', textAlign: 'center',
            color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem',
          }}>
            🎵 Upload music to Supabase &quot;music&quot; bucket
          </div>
        )}
      </section>
    </div>
  );
}
