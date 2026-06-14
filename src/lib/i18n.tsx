'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'en' | 'uk' | 'ru';

export const translations = {
  en: {
    nav_about: 'About', nav_arts: 'Arts', nav_video: 'Video', nav_music: 'Music', nav_contact: 'Contact',
    about_title: 'Ruslan Dubov', about_sub: 'AI Content Creator · Visual Artist · Adaptogens',
    arts_title: 'AI Arts & Visual Research',
    arts_desc: 'Exploration of diffusion models (Midjourney) to create highly detailed visual concepts. This section features works demonstrating strict control over style, composition, and lighting through advanced prompt engineering (weight parameters, stylization, character consistency).',
    arts_featured: 'Featured', arts_empty: 'Upload images to Supabase "arts" bucket.',
    arts_search_placeholder: 'Search artworks...',
    video_title: 'AI Video Production',
    video_desc: 'Full-cycle video production using artificial intelligence. From developing scripts and storyboards with ChatGPT and Claude to generating dynamic video sequences. Focus on storytelling and seamless integration of AI tools for cinematic results.',
    music_title: 'AI Music & Audio Generation',
    music_desc: 'Generation of original musical compositions using Suno AI. Writing structured text prompts (meta-tags, genre specifications, rhythm) to create music in POP and RAP genres that perfectly complements the visual narrative and conveys the desired emotion.',
    contact_title: 'Contact', contact_sub: 'Get in touch · Collaborate · Follow',
    contact_name: 'Your name', contact_email: 'Your email', contact_msg: 'Message',
    contact_send: 'Send message', contact_sent: 'Message sent!', contact_error: 'Error sending. Try again.',
    agent_placeholder: 'Ask me anything about Ruslan...',
    agent_title: 'AI Assistant',
    footer: '© 2026 · Ruslan Dubov · AI. Art. Adaptogens.',
    badge_featured: 'Featured',
    bio1: "My name is <strong>Ruslan Dubov</strong>. I am an AI creator, prompt engineer, and neural network researcher working at the intersection of technology, visual art, and mindful living. I don't just generate content; I explore the limits of AI capabilities, creating videos, artworks, and music that tell stories without unnecessary words.",
    bio2: "My core stack: <strong>ChatGPT, Midjourney, Claude, Suno, Google AI</strong>. With a deep understanding of LLM architecture and diffusion models, I develop complex, structured prompts, turning abstract ideas into finished commercial products faster and more accurately than ever before.",
  },
  uk: {
    nav_about: 'Про мене', nav_arts: 'Арти', nav_video: 'Відео', nav_music: 'Музика', nav_contact: 'Контакти',
    about_title: 'Руслан Дубов', about_sub: 'AI Контент-Крієйтор · Візуальний Митець · Адаптогени',
    arts_title: 'AI Arts & Visual Research',
    arts_desc: 'Дослідження дифузійних моделей (Midjourney) для створення високодеталізованих візуальних концептів. У цьому розділі представлені роботи, що демонструють суворий контроль над стилем, композицією та освітленням за допомогою просунутого промпт-інжинірингу (параметри ваги, стилізація, консистентність персонажів).',
    arts_featured: 'Головне', arts_empty: 'Завантажте зображення в Supabase "arts" bucket.',
    arts_search_placeholder: 'Пошук артів...',
    video_title: 'AI Video Production',
    video_desc: 'Повний цикл створення відео з використанням штучного інтелекту. Від розробки сценаріїв та розкадровок за допомогою ChatGPT та Claude до генерації динамічного відеоряду. Фокус на сторітелінгу та безшовній інтеграції AI-інструментів для кінематографічного результату.',
    music_title: 'AI Music & Audio Generation',
    music_desc: 'Генерація оригінальних музичних композицій з використанням Suno AI. Написання структурованих текстових запитів (meta-tags, жанрові специфікації, ритміка) для створення музики у жанрах POP та RAP, яка ідеально доповнює візуальний наратив і передає потрібну емоцію.',
    contact_title: 'Контакти', contact_sub: "Зв'язатися · Колаборація · Підписатися",
    contact_name: "Ваше ім'я", contact_email: 'Ваш email', contact_msg: 'Повідомлення',
    contact_send: 'Надіслати', contact_sent: 'Надіслано!', contact_error: 'Помилка. Спробуйте ще.',
    agent_placeholder: 'Запитайте про Руслана...',
    agent_title: 'AI Асистент',
    footer: '© 2026 · Руслан Дубов · AI. Мистецтво. Адаптогени.',
    badge_featured: 'Головне',
    bio1: "Мене звати <strong>Руслан Дубов</strong>. Я — AI-креатор, промпт-інженер та дослідник нейромереж, який працює на перетині технологій, візуального мистецтва та усвідомленого підходу до життя. Я не просто генерую контент, я досліджую межі можливостей ШІ, створюючи відео, арты та музику, які розповідають історії без зайвих слів.",
    bio2: "Мій основний стек: <strong>ChatGPT, Midjourney, Claude, Suno, Google AI</strong>. Завдяки глибокому розумінню архітектури LLM та дифузійних моделей, я розробляю складні структуровані промпти, перетворюючи абстрактні ідеї на готовий комерційний продукт швидше і точніше, ніж будь-коли.",
  },
  ru: {
    nav_about: 'Обо мне', nav_arts: 'Арты', nav_video: 'Видео', nav_music: 'Музыка', nav_contact: 'Контакты',
    about_title: 'Руслан Дубов', about_sub: 'AI Контент-Криейтор · Визуальный Художник · Адаптогены',
    arts_title: 'AI Arts & Visual Research',
    arts_desc: 'Исследование диффузионных моделей (Midjourney) для создания высокодетализированных визуальных концептов. В этом разделе представлены работы, демонстрирующие строгий контроль над стилем, композицией и освещением с помощью продвинутого промпт-инжиниринга (параметры весов, стилизация, консистентность персонажей).',
    arts_featured: 'Главное', arts_empty: 'Загрузите изображения в Supabase "arts" bucket.',
    arts_search_placeholder: 'Поиск артов...',
    video_title: 'AI Video Production',
    video_desc: 'Полный цикл создания видео с использованием искусственного интеллекта. От разработки сценариев и раскадровок с помощью ChatGPT и Claude до генерации динамичного видеоряда. Фокус на сторителлинге и бесшовной интеграции AI-инструментов для кинематографичного результата.',
    music_title: 'AI Music & Audio Generation',
    music_desc: 'Генерация оригинальных музыкальных композиций с использованием Suno AI. Написание структурированных текстовых запросов (meta-tags, жанровые спецификации, ритмика) для создания музыки в жанрах POP и RAP, которая идеально дополняет визуальный нарратив и передает нужную эмоцию.',
    contact_title: 'Контакты', contact_sub: 'Связаться · Коллаборация · Подписаться',
    contact_name: 'Ваше имя', contact_email: 'Ваш email', contact_msg: 'Сообщение',
    contact_send: 'Отправить', contact_sent: 'Отправлено!', contact_error: 'Ошибка. Попробуйте снова.',
    agent_placeholder: 'Спросите о Руслане...',
    agent_title: 'AI Ассистент',
    footer: '© 2026 · Руслан Дубов · AI. Искусство. Адаптогены.',
    badge_featured: 'Главное',
    bio1: 'Меня зовут <strong>Руслан Дубов</strong>. Я — AI-креатор, промпт-инженер и исследователь нейросетей, работающий на стыке технологий, визуального искусства и осознанного подхода к жизни. Я не просто генерирую контент, я исследую пределы возможностей ИИ, создавая видео, арты и музыку, которые рассказывают истории без лишних слов.',
    bio2: 'Мой основной стек: <strong>ChatGPT, Midjourney, Claude, Suno, Google AI</strong>. Благодаря глубокому пониманию архитектуры LLM и диффузионных моделей, я разрабатываю сложные структурированные промпты, превращая абстрактные идеи в готовый коммерческий продукт быстрее и точнее, чем когда-либо.',
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
