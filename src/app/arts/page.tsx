'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getArtsUrls } from '@/lib/supabase';
import Image from 'next/image';
import ArtCarousel from '@/components/ArtCarousel';

export default function ArtsPage() {
  const { t } = useLang();
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    getArtsUrls().then(setImages);
  }, []);

  return (
    <div className="w-full px-8 pt-7">
      {/* ── HERO ── */}
      <section className="flex flex-wrap md:flex-nowrap items-start justify-between gap-7">
        <div className="w-full md:w-[240px] shrink-0">
          <h1 className="font-serif text-[clamp(3.2rem,6.5vw,5.5rem)] font-semibold italic leading-[0.95] tracking-[-0.5px] text-white">
            Ruslan<br />Dubov
          </h1>
        </div>
        <div className="flex-1 pt-2 order-3 md:order-none min-w-full md:min-w-0">
          <div className="text-[0.88rem] text-white/40 leading-[1.85] font-light [&_strong]:text-white/[0.72] [&_strong]:font-medium">
            <p dangerouslySetInnerHTML={{ __html: t('bio1') }} />
            <p className="mt-2.5" dangerouslySetInnerHTML={{ __html: t('bio2') }} />
            <div className="flex flex-wrap gap-1.5 mt-3.5">
              {['AI Content', 'Video Production', 'AI Art', 'Music AI', 'Adaptogens', 'Storytelling'].map(tag => (
                <span key={tag} className="px-3.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-[0.72rem] text-white/[0.32] tracking-[0.2px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="shrink-0 w-[110px] h-[110px] md:w-[155px] md:h-[155px] rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a] p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_40px_rgba(255,255,255,0.05)]">
          <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a]">
            <Image src="/photo.jpg" alt="Ruslan Dubov" width={155} height={155} className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </section>

      {/* ── ARTS CAROUSEL ── */}
      <section className="mt-8 pb-12">
        <h2 className="font-serif text-[1.6rem] italic font-semibold text-white/45 mb-6 tracking-[0.5px] text-center">
          {t('arts_title')}
        </h2>
        <ArtCarousel images={images} />
      </section>
    </div>
  );
}
