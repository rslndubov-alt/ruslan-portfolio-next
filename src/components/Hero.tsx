'use client';
import { useLang } from '@/lib/i18n';
import Image from 'next/image';

export default function Hero() {
  const { t } = useLang();

  return (
    <section style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '28px',
      flexWrap: 'wrap',
    }}>
      {/* Name */}
      <div style={{ flexShrink: 0, width: '240px' }}>
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
      <div style={{ flex: 1, paddingTop: '8px', minWidth: '0' }}>
        <div style={{
          fontSize: '0.88rem',
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.85,
          fontWeight: 300,
        }}>
          <p dangerouslySetInnerHTML={{ __html: t('bio1') }} />
          <p style={{ marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: t('bio2') }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
            {['AI Content', 'Video Production', 'AI Art', 'Music AI', 'Storytelling'].map(tag => (
              <span key={tag} style={{
                padding: '4px 13px',
                background: '#fff',
                border: 'none',
                borderRadius: '100px',
                fontSize: '0.72rem',
                color: '#111',
                fontWeight: 500,
                letterSpacing: '0.2px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar */}
      <div style={{
        flexShrink: 0,
        width: '155px',
        height: '155px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3a3a3a, #1a1a1a)',
        padding: '3px',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.12), 0 0 40px rgba(255,255,255,0.05)',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#1a1a1a',
        }}>
          <Image src="/photo.jpg" alt="Ruslan Dubov" width={155} height={155}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
        </div>
      </div>
    </section>
  );
}
