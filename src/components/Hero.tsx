'use client';
import { useLang } from '@/lib/i18n';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAvatarUrl } from '@/lib/supabase';

export default function Hero() {
  const { t } = useLang();
  const pathname = usePathname();

  let firstBlockKey: string | null = 'bio1';
  let secondBlockKey: string | null = 'bio2';

  if (pathname === '/contact') {
    firstBlockKey = 'contact_bio1';
    secondBlockKey = 'contact_bio2';
  } else if (pathname === '/arts') {
    firstBlockKey = 'arts_desc';
    secondBlockKey = null;
  } else if (pathname === '/video') {
    firstBlockKey = 'video_desc';
    secondBlockKey = null;
  } else if (pathname === '/music') {
    firstBlockKey = 'music_desc';
    secondBlockKey = null;
  }

  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    getAvatarUrl().then(url => {
      if (url) setAvatarUrl(url);
    });
  }, []);

  return (
    <section className="hero-container">
      {/* Name */}
      <div className="hero-name" style={{ position: 'relative' }}>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes blurIn {
            0% { filter: blur(16px); opacity: 0; transform: scale(0.95) translateY(10px); }
            100% { filter: blur(0px); opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes shine {
            to { background-position: 200% center; }
          }
          .modern-text-effect {
            background: linear-gradient(
              110deg,
              #ffffff 30%,
              rgba(255, 255, 255, 0.4) 50%,
              #ffffff 70%
            );
            background-size: 200% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: 
              blurIn 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards,
              shine 6s linear infinite;
          }
          .shimmer-text-subtle {
            background: linear-gradient(
              110deg,
              rgba(255, 255, 255, 0.4) 30%,
              rgba(255, 255, 255, 0.9) 50%,
              rgba(255, 255, 255, 0.4) 70%
            );
            background-size: 200% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: shine 8s linear infinite;
          }
        `}} />
        <h1 className="modern-text-effect" style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)',
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: '-0.5px',
        }}>
          Ruslan<br />Dubov
        </h1>
      </div>

      {/* Bio */}
      <div className="hero-bio">
        <div className="shimmer-text-subtle" style={{
          fontSize: '0.88rem',
          lineHeight: 1.85,
          fontWeight: 300,
        }}>
          {firstBlockKey && <p dangerouslySetInnerHTML={{ __html: t(firstBlockKey as any) }} />}
          {secondBlockKey && <p style={{ marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: t(secondBlockKey as any) }} />}
          
          {pathname !== '/contact' && (
            <>
              <div className="hero-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '14px' }}>
                <div style={{ width: '92%', display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                  <span style={{
                    width: '60%', /* slightly stretched */
                    maxWidth: '220px',
                    padding: '6px 16px',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    color: '#fff',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    textAlign: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    GOOGLE AI
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
            {avatarUrl && <img src={avatarUrl} alt="Ruslan Dubov" width={155} height={155}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />}
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
