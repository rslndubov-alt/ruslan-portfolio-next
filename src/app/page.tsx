'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getResumeVideoUrls } from '@/lib/supabase';

export default function AboutPage() {
  const { t } = useLang();
  const [videos, setVideos] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    getResumeVideoUrls().then(setVideos);
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 32px 60px' }}>

      {/* Heading */}
      <h1 style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: 'clamp(3rem, 6vw, 5rem)',
        fontWeight: 600,
        fontStyle: 'italic',
        lineHeight: 1,
        color: '#fff',
        marginBottom: 8,
      }}>
        {t('about_title')}
      </h1>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 36, fontWeight: 300 }}>
        {t('about_sub')}
      </p>

      {/* Video player */}
      {videos.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <video
            key={videos[activeVideo]}
            src={videos[activeVideo]}
            controls
            playsInline
            style={{ width: '100%', aspectRatio: '16/9', borderRadius: 16, background: '#000', border: '1px solid rgba(255,255,255,0.07)', display: 'block' }}
          />
          {videos.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {videos.map((url, i) => (
                <button key={url + i} onClick={() => setActiveVideo(i)} style={{
                  flexShrink: 0, width: 80, aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden',
                  border: `1px solid ${i === activeVideo ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.1)'}`,
                  opacity: i === activeVideo ? 1 : 0.45, cursor: 'pointer', padding: 0, background: 'none',
                  position: 'relative',
                }}>
                  <video src={url} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bio + Tools */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, fontWeight: 300 }}>
            Content creator at the intersection of{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>AI, visual art, and mindful living</strong>.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, lineHeight: 1.7, fontWeight: 300, marginTop: 12 }}>
            Working with: <strong style={{ color: 'rgba(255,255,255,0.55)' }}>ChatGPT, Midjourney, Claude, Suno, Google AI</strong>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
            {['AI Content', 'Video', 'AI Art', 'Music AI', 'Adaptogens'].map(tag => (
              <span key={tag} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, fontWeight: 600, fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
            Skills & Tools
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
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
              <div key={tool.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                  {tool.icon}
                </div>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
