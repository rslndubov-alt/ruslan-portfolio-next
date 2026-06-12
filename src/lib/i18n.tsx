'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'en' | 'uk' | 'ru';

export const translations = {
  en: {
    nav_about: 'About', nav_arts: 'Arts', nav_video: 'Video', nav_contact: 'Contact',
    about_title: 'Ruslan Dubov', about_sub: 'AI Content Creator · Visual Artist · Adaptogens',
    arts_title: 'Arts', arts_sub: 'AI-generated artworks · Midjourney · ChatGPT Image',
    arts_featured: 'Featured', arts_empty: 'Upload images to Supabase "arts" bucket.',
    arts_search_placeholder: 'Search artworks...',
    video_title: 'Video', video_sub: 'Content · YouTube · TikTok',
    contact_title: 'Contact', contact_sub: 'Get in touch · Collaborate · Follow',
    contact_name: 'Your name', contact_email: 'Your email', contact_msg: 'Message',
    contact_send: 'Send message', contact_sent: 'Message sent!', contact_error: 'Error sending. Try again.',
    agent_placeholder: 'Ask me anything about Ruslan...',
    agent_title: 'AI Assistant',
    footer: '© 2026 · Ruslan Dubov · AI. Art. Adaptogens.',
    badge_featured: 'Featured',
    bio1: 'My name is <strong>Ruslan Dubov</strong> &mdash; a content creator at the intersection of <strong>AI, visual art, and mindful living</strong>. I create videos, AI artworks, and music that tell stories without unnecessary words.',
    bio2: 'I work with: <strong>ChatGPT, Midjourney, Claude, Suno, Google AI</strong> &mdash; turning ideas into a finished product faster than ever.',
  },
  uk: {
    nav_about: 'Про мене', nav_arts: 'Арти', nav_video: 'Відео', nav_contact: 'Контакти',
    about_title: 'Руслан Дубов', about_sub: 'AI Контент-Крієйтор · Візуальний Митець · Адаптогени',
    arts_title: 'Арти', arts_sub: 'AI-арти · Midjourney · ChatGPT Image',
    arts_featured: 'Головне', arts_empty: 'Завантажте зображення в Supabase "arts" bucket.',
    arts_search_placeholder: 'Пошук артів...',
    video_title: 'Відео', video_sub: 'Контент · YouTube · TikTok',
    contact_title: 'Контакти', contact_sub: "Зв'язатися · Колаборація · Підписатися",
    contact_name: "Ваше ім'я", contact_email: 'Ваш email', contact_msg: 'Повідомлення',
    contact_send: 'Надіслати', contact_sent: 'Надіслано!', contact_error: 'Помилка. Спробуйте ще.',
    agent_placeholder: 'Запитайте про Руслана...',
    agent_title: 'AI Асистент',
    footer: '© 2026 · Руслан Дубов · AI. Мистецтво. Адаптогени.',
    badge_featured: 'Головне',
    bio1: 'Мене звати <strong>Руслан Дубов</strong> &mdash; контент-крієйтор на перетині <strong>AI, візуального мистецтва та усвідомленого способу життя</strong>. Створюю відео, AI-арти та музику.',
    bio2: 'Працюю з: <strong>ChatGPT, Midjourney, Claude, Suno, Google AI</strong> &mdash; перетворюю ідеї на готовий продукт.',
  },
  ru: {
    nav_about: 'Обо мне', nav_arts: 'Арты', nav_video: 'Видео', nav_contact: 'Контакты',
    about_title: 'Руслан Дубов', about_sub: 'AI Контент-Криейтор · Визуальный Художник · Адаптогены',
    arts_title: 'Арты', arts_sub: 'AI-арты · Midjourney · ChatGPT Image',
    arts_featured: 'Главное', arts_empty: 'Загрузите изображения в Supabase "arts" bucket.',
    arts_search_placeholder: 'Поиск артов...',
    video_title: 'Видео', video_sub: 'Контент · YouTube · TikTok',
    contact_title: 'Контакты', contact_sub: 'Связаться · Коллаборация · Подписаться',
    contact_name: 'Ваше имя', contact_email: 'Ваш email', contact_msg: 'Сообщение',
    contact_send: 'Отправить', contact_sent: 'Отправлено!', contact_error: 'Ошибка. Попробуйте снова.',
    agent_placeholder: 'Спросите о Руслане...',
    agent_title: 'AI Ассистент',
    footer: '© 2026 · Руслан Дубов · AI. Искусство. Адаптогены.',
    badge_featured: 'Главное',
    bio1: 'Меня зовут <strong>Руслан Дубов</strong> &mdash; контент-криейтор на пересечении <strong>AI, визуального искусства и осознанного образа жизни</strong>. Создаю видео, AI-арты и музыку.',
    bio2: 'Работаю с: <strong>ChatGPT, Midjourney, Claude, Suno, Google AI</strong> &mdash; превращая идеи в готовый продукт.',
  },
};

type TranslationKeys = keyof typeof translations.en;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKeys) => string;
}

const I18nContext = createContext<I18nCtx>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved && ['en', 'uk', 'ru'].includes(saved)) setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
    document.documentElement.lang = l;
  };
  const t = (key: TranslationKeys): string => translations[lang][key] ?? key;
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useLang = () => useContext(I18nContext);
