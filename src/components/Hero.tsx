'use client';
import { useLang } from '@/lib/i18n';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAvatarUrl } from '@/lib/supabase';

export default function Hero() {
  const { t } = useLang();
  const pathname = usePathname();

  let firstBlockKey = 'bio1';
  let secondBlockKey = 'bio2';

  if (pathname === '/contact') {
    firstBlockKey = 'contact_bio1';
    secondBlockKey = 'contact_bio2';
  } else if (pathname === '/arts') {
    secondBlockKey = 'arts_desc';
  } else if (pathname === '/video') {
    secondBlockKey = 'video_desc';
  } else if (pathname === '/music') {
    secondBlockKey = 'music_desc';
  }

  const [avatarUrl, setAvatarUrl] = useState('/photo.jpg');

  useEffect(() => {
    getAvatarUrl().then(url => {
      if (url) setAvatarUrl(url);
    });
  }, []);

  return (
    <section className="hero-container">
      {/* Name */}
      <div className="hero-name">
        <h1 style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)',
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: '-0.5px',
          color: '#fff',
        }}>
          Ruslan<br />Dubov
        </h1>
      </div>

      {/* Bio */}
      <div className="hero-bio">
        <div style={{
          fontSize: '0.88rem',
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.85,
          fontWeight: 300,
        }}>
          <p dangerouslySetInnerHTML={{ __html: t(firstBlockKey as any) || t('bio1') }} />
          <p style={{ marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: t(secondBlockKey as any) || t('bio2') }} />
          
          {pathname !== '/contact' && (
            <>
              <div className="hero-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '14px' }}>
                <div style={{ width: '100%', marginBottom: '4px' }}>
                  <span style={{
                    display: 'block',
                    width: '100%',
                    padding: '5px 12px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    color: '#fff',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textAlign: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    Google AI
                  </span>
                </div>
                {['AI Content', 'Prompt Engineering', 'AI Research', 'Video Production', 'AI Art', 'Music AI', 'ChatGPT', 'Midjourney', 'Claude', 'Suno AI'].map(tag => (
                  <span key={tag} style={{
                    padding: '3px 10px',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '100px',
                    fontSize: '0.68rem',
                    color: 'rgba(255,255,255,0.55)',
                    fontWeight: 500,
                    letterSpacing: '0.2px',
                    whiteSpace: 'nowrap',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Column (Avatar + Resume) */}
      <div className="hero-right-col">
        <div className="hero-avatar">
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#1a1a1a',
          }}>
            <img src={avatarUrl} alt="Ruslan Dubov" width={155} height={155}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
          </div>
        </div>

        <a
          href="/Ruslan_Dubov_Resume.pdf"
          download
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '7px 18px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '100px',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.6)',
            fontWeight: 500,
            letterSpacing: '0.3px',
            textDecoration: 'none',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
        >
          ↓ Download Resume
        </a>
      </div>
    </section>
  );
}
