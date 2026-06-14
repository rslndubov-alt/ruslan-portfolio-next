'use client';
import { useLang } from '@/lib/i18n';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Hero() {
  const { t } = useLang();
  const pathname = usePathname();

  let secondBlockKey = 'bio2';
  if (pathname === '/arts') secondBlockKey = 'arts_desc';
  else if (pathname === '/video') secondBlockKey = 'video_desc';
  else if (pathname === '/music') secondBlockKey = 'music_desc';

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
          <p style={{ marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: t(secondBlockKey as any) || t('bio2') }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '14px' }}>
            {['AI Content', 'Prompt Engineering', 'AI Research', 'Video Production', 'AI Art', 'Music AI'].map(tag => (
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
          <div style={{ marginTop: '16px' }}>
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
                color: 'rgba(255,255,255,0.5)',
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
