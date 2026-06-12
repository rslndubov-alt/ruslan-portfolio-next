'use client';
import { useLang } from '@/lib/i18n';
import { PatternText } from '@/components/ui/pattern-text';

export default function AboutPage() {
  const { t } = useLang();
  return (
    <div className="max-w-4xl mx-auto px-8 py-9">
      <div className="mb-3 overflow-hidden">
        <PatternText
          text={t('about_title')}
          className="!text-[3.5rem] md:!text-[5rem] !font-semibold italic leading-none"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        />
      </div>
      <p className="text-sm text-white/30 font-light mb-12">{t('about_sub')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7">
          <p className="text-white/60 text-sm leading-relaxed font-light">
            Content creator at the intersection of <strong className="text-white/80">AI, visual art, and mindful living</strong>.
            I create videos, AI artworks, and music that tell stories without unnecessary words.
          </p>
          <p className="text-white/40 text-sm leading-relaxed font-light mt-4">
            Working with: <strong className="text-white/60">ChatGPT, Midjourney, Claude, Suno, Google AI</strong>
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['AI Content', 'Video Production', 'AI Art', 'Music AI', 'Adaptogens', 'Storytelling'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/[0.06] border border-white/[0.08] rounded-full text-xs text-white/40">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7">
          <h2
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            className="text-2xl font-semibold italic text-white/70 mb-4"
          >
            Skills & Tools
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: 'Midjourney', icon: '⛵' },
              { name: 'ChatGPT', icon: '✦' },
              { name: 'Claude', icon: '◆' },
              { name: 'Suno', icon: '♪' },
              { name: 'Google AI', icon: 'G' },
              { name: 'Photoshop', icon: 'Ps' },
              { name: 'CapCut', icon: '▶' },
              { name: 'Illustrator', icon: 'Ai' },
            ].map(tool => (
              <div key={tool.name} className="flex flex-col items-center gap-1.5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-base text-white/60">
                  {tool.icon}
                </div>
                <span className="text-[10px] text-white/30">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
