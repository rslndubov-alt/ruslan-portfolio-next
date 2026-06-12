'use client';
import { useLang, Lang } from '@/lib/i18n';

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  const langs: { code: Lang; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'uk', label: 'UA' },
    { code: 'ru', label: 'RU' },
  ];
  return (
    <div className="flex gap-1 bg-white/5 border border-white/[0.08] rounded-full p-1">
      {langs.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
            lang === code
              ? 'bg-white/[0.12] text-white'
              : 'text-white/35 hover:text-white/60'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
