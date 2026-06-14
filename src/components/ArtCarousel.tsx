'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '@/lib/i18n';

const CARDS_PER_VIEW = 3;
const AUTO_MS = 4500;

interface Props {
  images: string[];
  searchQuery?: string;
}

export default function ArtCarousel({ images, searchQuery = '' }: Props) {
  const { t } = useLang();
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [carouselStart, setCarouselStart] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lbSrc, setLbSrc] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const filtered = searchQuery
    ? images.filter((_, i) => String(i + 1).includes(searchQuery) || `art ${i + 1}`.toLowerCase().includes(searchQuery.toLowerCase()))
    : images;

  const total = filtered.length;

  const setFeatured = useCallback((idx: number) => {
    setFeaturedIdx(((idx % total) + total) % total);
  }, [total]);

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    setProgress(0);
    autoRef.current = setInterval(() => {
      setFeaturedIdx(prev => {
        const next = (prev + 1) % total;
        setCarouselStart(s => {
          const visible = s <= next && next < s + CARDS_PER_VIEW;
          return visible ? s : next;
        });
        return next;
      });
      setProgress(0);
    }, AUTO_MS);
  }, [total]);

  useEffect(() => {
    if (!total) return;
    resetAuto();
    const prog = setInterval(() => setProgress(p => Math.min(p + (100 / (AUTO_MS / 100)), 100)), 100);
    return () => { clearInterval(autoRef.current!); clearInterval(prog); };
  }, [total, resetAuto]);

  const slideNext = () => {
    if (isAnimating || total <= CARDS_PER_VIEW) return;
    setIsAnimating(true);
    setCarouselStart(s => (s + 1) % total);
    resetAuto();
    setTimeout(() => setIsAnimating(false), 520);
  };

  const slidePrev = () => {
    if (isAnimating || total <= CARDS_PER_VIEW) return;
    setIsAnimating(true);
    setCarouselStart(s => ((s - 1) + total) % total);
    resetAuto();
    setTimeout(() => setIsAnimating(false), 520);
  };

  if (!total) {
    return <p className="text-center py-20 text-white/20 text-sm">{t('arts_empty')}</p>;
  }

  const cardWidth = 100 / CARDS_PER_VIEW;
  const translateX = (carouselStart / total) * 100;

  return (
    <>
      {/* Lightbox */}
      {lbSrc && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
          onClick={() => setLbSrc(null)}
        >
          <button className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20" onClick={() => setLbSrc(null)}>✕</button>
          <img src={lbSrc} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl" onClick={e => e.stopPropagation()}/>
        </div>
      )}

      {/* Featured hero */}
      <div className="relative w-full mb-3 cursor-pointer" onClick={() => setLbSrc(filtered[featuredIdx])}>
        <div style={{ width: '100%', maxHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <img
            src={filtered[featuredIdx]}
            alt="Featured art"
            style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', display: 'block', transition: 'all 0.5s' }}
          />
        </div>
        <span className="absolute top-3.5 left-3.5 bg-black/55 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          {t('arts_featured')}
        </span>
        <span className="absolute bottom-3.5 right-3.5 bg-black/55 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-xs text-white/40">
          {featuredIdx + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-0.5 bg-white/[0.06] rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-white/25 rounded-full transition-none"
          style={{ width: `${progress}%`, transition: `width ${AUTO_MS}ms linear` }}
        />
      </div>

      {/* Carousel */}
      {total > 1 && (
        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <div
              ref={trackRef}
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${translateX}%)`, width: `${(total / CARDS_PER_VIEW) * 100}%` }}
            >
              {filtered.map((url, i) => (
                <div key={url + i} style={{ width: `${cardWidth / (total / CARDS_PER_VIEW)}%` }} className="px-1.5">
                  <div
                    className={`rounded-xl overflow-hidden aspect-[4/3] cursor-pointer border transition-all duration-200 ${
                      i === featuredIdx
                        ? 'border-white/40 scale-[1.02]'
                        : 'border-white/[0.06] hover:border-white/20'
                    }`}
                    onClick={() => { setFeatured(i); resetAuto(); }}
                  >
                    <img src={url} alt={`Art ${i + 1}`} loading="lazy" className="w-full h-full object-cover"/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center gap-2.5 mt-3">
            <button onClick={slidePrev} disabled={isAnimating} className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/10 text-white/50 hover:bg-white/14 hover:text-white transition-all disabled:opacity-30 flex items-center justify-center">←</button>
            <div className="flex gap-1.5">
              {Array.from({ length: Math.min(total, 8) }).map((_, i) => (
                <button key={i} onClick={() => { setCarouselStart(i); setFeatured(i); resetAuto(); }}
                  className={`rounded-full transition-all duration-200 ${ i === carouselStart ? 'w-4 h-1.5 bg-white/70' : 'w-1.5 h-1.5 bg-white/15 hover:bg-white/30' }`}/>
              ))}
            </div>
            <button onClick={slideNext} disabled={isAnimating} className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/10 text-white/50 hover:bg-white/14 hover:text-white transition-all disabled:opacity-30 flex items-center justify-center">→</button>
          </div>
        </div>
      )}
    </>
  );
}
