'use client';
import Hero from '@/components/Hero';
import { useLang } from '@/lib/i18n';

const tracks = [
  { name: 'Subharmonic Stillness', file: '/music/Subharmonic_Stillness.mp3' },
  { name: 'Vinyl Sorrow Jazz', file: '/music/Vinyl_Sorrow_Jazz.mp3' },
  { name: 'Vitamin D Holiday', file: '/music/Vitamin_D_Holiday.mp3' },
];

export default function MusicPage() {
  const { t } = useLang();

  return (
    <div style={{ paddingTop: '28px' }}>
      <Hero />

      <section style={{ marginTop: '32px', paddingBottom: '48px' }}>
        <h2
          style={{
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '2rem',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '28px',
            letterSpacing: '0.5px',
            textAlign: 'center',
          }}
        >
          {(t as (key: string) => string)('music_title') || 'Music'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tracks.map((track, i) => (
            <div
              key={track.file}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '20px',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {/* Track number */}
              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'rgba(255,255,255,0.22)',
                  fontWeight: 500,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase' as const,
                  marginBottom: '6px',
                }}
              >
                Track {String(i + 1).padStart(2, '0')}
              </div>

              {/* Track name */}
              <div
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.85)',
                  marginBottom: '14px',
                  letterSpacing: '0.2px',
                }}
              >
                {track.name}
              </div>

              {/* Audio player */}
              <audio
                controls
                preload="metadata"
                src={track.file}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '8px',
                  outline: 'none',
                }}
              />

              {/* Subtitle */}
              <div
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.28)',
                  marginTop: '10px',
                  letterSpacing: '0.3px',
                }}
              >
                AI · Suno
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
