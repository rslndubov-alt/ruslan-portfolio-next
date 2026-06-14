'use client';
import { useLang, Lang } from '@/lib/i18n';

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  const langs: Lang[] = ['en', 'uk', 'ru'];
  const labels: Record<Lang, string> = { en: 'EN', uk: 'UA', ru: 'RU' };

  return (
    <div className="lang-switcher">
      {langs.map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`lang-btn ${lang === l ? 'active' : ''}`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
