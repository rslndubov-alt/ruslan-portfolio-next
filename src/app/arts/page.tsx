'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getArtsUrls } from '@/lib/supabase';
import Hero from '@/components/Hero';
import ArtCarousel from '@/components/ArtCarousel';

export default function ArtsPage() {
  const { t } = useLang();
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    getArtsUrls().then(setImages);
  }, []);

  return (
    <div style={{ paddingTop: '28px' }}>
      <Hero />

      <section style={{ marginTop: '32px', paddingBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.6rem', fontStyle: 'italic', fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: '24px', letterSpacing: '0.5px', textAlign: 'center' }}>
          {t('arts_title')}
        </h2>
        <ArtCarousel images={images} />
      </section>
    </div>
  );
}
