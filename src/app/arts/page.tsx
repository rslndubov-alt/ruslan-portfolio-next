'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getArtsUrls } from '@/lib/supabase';
import ArtCarousel from '@/components/ArtCarousel';
import { PatternText } from '@/components/ui/pattern-text';

export default function ArtsPage() {
  const { t } = useLang();
  const [images, setImages] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArtsUrls().then(urls => { setImages(urls); setLoading(false); });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-8 py-9">
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
        {t('arts_title')}
      </h1>
      <p className="text-sm text-white/30 font-light mb-6">{t('arts_sub')}</p>

      {/* Search */}
      <div className="relative mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('arts_search_placeholder')}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/70 placeholder-white/20 outline-none focus:border-white/20 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs">✕</button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin"/>
        </div>
      ) : (
        <ArtCarousel images={images} searchQuery={search} />
      )}
    </div>
  );
}

