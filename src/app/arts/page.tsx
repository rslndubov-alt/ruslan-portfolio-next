'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getArtsAllCategories, getArtsByCategory, getArtsFolders } from '@/lib/supabase';
import Hero from '@/components/Hero';
import ArtCarousel from '@/components/ArtCarousel';

export default function ArtsPage() {
  const { t } = useLang();
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load available folders on mount
  useEffect(() => {
    getArtsFolders().then(folders => setCategories(folders));
  }, []);

  // Load images when category changes
  useEffect(() => {
    setLoading(true);
    if (activeCategory === 'all') {
      getArtsAllCategories().then(urls => { setImages(urls); setLoading(false); });
    } else {
      getArtsByCategory(activeCategory).then(urls => { setImages(urls); setLoading(false); });
    }
  }, [activeCategory]);

  // Capitalize first letter for display
  const label = (cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1);

  return (
    <div style={{ paddingTop: '28px' }}>
      <Hero />

      <section style={{ marginTop: '32px', paddingBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.6rem', fontStyle: 'italic', fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: '20px', letterSpacing: '0.5px', textAlign: 'center' }}>
          {t('arts_title')}
        </h2>

        {/* ── DYNAMIC FILTER BUTTONS ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {/* "All" button is always first */}
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '8px 20px',
              borderRadius: '100px',
              border: activeCategory === 'all' ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
              background: activeCategory === 'all' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
              color: activeCategory === 'all' ? '#fff' : 'rgba(255,255,255,0.4)',
              fontSize: '0.8rem',
              fontWeight: activeCategory === 'all' ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              letterSpacing: '0.3px',
            }}
          >
            All
          </button>

          {/* Dynamic category buttons from Supabase folders */}
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: '100px',
                border: activeCategory === cat ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
                background: activeCategory === cat ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                color: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: '0.8rem',
                fontWeight: activeCategory === cat ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                letterSpacing: '0.3px',
              }}
            >
              {label(cat)}
            </button>
          ))}
        </div>

        {/* ── CAROUSEL ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
            Loading...
          </div>
        ) : (
          <ArtCarousel images={images} />
        )}
      </section>
    </div>
  );
}
