'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'en' | 'uk' | 'ru';

export const translations = {
  en: {
    nav_about: 'About', nav_arts: 'Arts', nav_video: 'Video', nav_music: 'Music', nav_contact: 'Contact',
    about_title: 'Ruslan Dubov', about_sub: 'AI Content Creator · Visual Artist · Adaptogens',
    arts_title: 'AI Arts & Visual Research',
    arts_desc: 'Deep exploration of latent space and diffusion networks (Midjourney) to create hyper-realistic visual concepts. Ultimate control over cinematic lighting, composition, and generative aesthetics through precision prompt engineering. Ensuring character consistency, complex stylization, and next-gen visual storytelling. I experiment with style blending, multi-weight parameters, and parametric prompt architecture to achieve studio-grade rendering quality. From photorealism to surreal abstractions, each piece is the result of fine AI calibration, where mathematical algorithms transform into unique digital art that meets the highest commercial standards.',
    arts_featured: 'Featured', arts_empty: 'Upload images to Supabase "arts" bucket.',
    arts_search_placeholder: 'Search artworks...',
    video_title: 'AI Video Production',
    video_desc: 'Next-gen video production powered by artificial intelligence. A seamless pipeline from LLM-driven scriptwriting to AI cinematography and dynamic frame generation. Focused on temporal consistency, immersive storytelling, and seamless VFX integration to deliver truly cinematic wow-effects. Using cutting-edge neural networks, I create complex animation transitions, control camera dynamics, and integrate hyper-realistic VFX without quality loss. It is not just generation—it is full virtual environment directing, where every frame is pixel-perfectly calibrated, and computer vision helps realize massive cinematic ideas that traditional video production could not achieve in such tight timeframes.',
    music_title: 'AI Music & Audio Generation',
    music_desc: 'Neuro-acoustic sound design and algorithmic track generation (Suno AI). Crafting complex audio architectures through meta-tagging and rhythm control. From heavy beats to emotional soundtracks—achieving perfect synergy between audio and visual narratives with studio-grade sound synthesis. I meticulously engineer the structure of compositions: from intros and hooks to epic drops and vocal generation. Proper prompt engineering in music allows not only setting the exact BPM or voice timbre but also designing a unique psychoacoustic profile for the track. The result is a full-fledged commercial audio product, ready for integration into advertising, cinema, or digital projects of any scale.',
    contact_title: 'Contact', contact_sub: 'Get in touch · Collaborate · Follow',
    contact_name: 'Your name', contact_email: 'Your email', contact_msg: 'Message',
    contact_send: 'Send message', contact_sent: 'Message sent!', contact_error: 'Error sending. Try again.',
    agent_placeholder: 'Ask me anything about Ruslan...',
    agent_title: 'AI Assistant',
    footer: '© 2026 · Ruslan Dubov · AI. Art. Adaptogens.',
    badge_featured: 'Featured',
    bio1: "My name is <strong>Ruslan Dubov</strong>. I am an AI creator, prompt engineer, and neural network researcher working at the intersection of technology, visual art, and mindful living. I don't just generate content; I explore the limits of AI capabilities, creating videos, artworks, and music that tell stories without unnecessary words.",
    bio2: "My core stack: <strong>ChatGPT, Midjourney, Claude, Suno, Google AI</strong>. With a deep understanding of LLM architecture and diffusion models, I develop complex, structured prompts, turning abstract ideas into finished commercial products faster and more accurately than ever before.",
    contact_bio1: "Based in Dnipro, Ukraine. 47 years old. I work fully remotely with projects and clients worldwide.",
    contact_bio2: "I guarantee integrity and strict adherence to deadlines. Available for both long-term collaborations and one-time projects. All details, including pricing and workflow, are discussed in personal communication.",
  },
  uk: {
    nav_about: 'Про мене', nav_arts: 'Арти', nav_video: 'Відео', nav_music: 'Музика', nav_contact: 'Контакти',
    about_title: 'Руслан Дубов', about_sub: 'AI Контент-Крієйтор · Візуальний Митець · Адаптогени',
    arts_title: 'AI Arts & Visual Research',
    arts_desc: 'Глибоке дослідження латентного простору та дифузійних нейромереж (Midjourney) для створення гіперреалістичних візуальних концептів. Ультимативний контроль над кінематографічним світлом, композицією та генеративною естетикою через ювелірний промпт-інжиніринг. Максимальна консистентність персонажів та візуальний сторітелінг нового покоління. Я експериментую з блендингом стилів, мульти-ваговими параметрами та параметричною архітектурою промптів, щоб досягати студійної якості рендерингу. Від фотореалізму до сюрреалістичних абстракцій — кожна робота є результатом тонкого калібрування AI, де математичні алгоритми перетворюються на унікальне цифрове мистецтво, що відповідає найвищим комерційним стандартам.',
    arts_featured: 'Головне', arts_empty: 'Завантажте зображення в Supabase "arts" bucket.',
    arts_search_placeholder: 'Пошук артів...',
    video_title: 'AI Video Production',
    video_desc: 'Next-gen відеопродакшн на базі штучного інтелекту. Безшовний пайплайн від розробки сценарних концептів у LLM до AI-режисури та динамічної генерації кадрів. Фокус на кінематографічності, темпоральній стабільності (temporal consistency) та іммерсивному сторітелінгу для створення wow-ефекту. Використовуючи передові нейромережі, я створюю складні анімаційні переходи, контролюю динаміку камери та інтегрую гіперреалістичні VFX без втрати якості. Це не просто генерація — це повна режисура віртуального середовища, де кожен фрейм вивірений до пікселя, а машинний зір допомагає втілювати масштабні кінематографічні ідеї, недоступні традиційному відеопродакшену в такі стислі терміни.',
    music_title: 'AI Music & Audio Generation',
    music_desc: 'Нейроакустичний саунд-дизайн та алгоритмічна генерація треків (Suno AI). Створення складної аудіо-архітектури через мета-тегування та контроль ритміки. Від потужних бітів до емоційних саундтреків — повна синергія музики та візуального наративу зі студійним рівнем звучання. Я детально опрацьовую структуру композицій: від інтро та хуків до епічних дропів і вокальної генерації. Грамотне використання prompt-інжинірингу в музиці дозволяє не тільки задати точний BPM або тембр голосу, але й спроєктувати унікальний психоакустичний профіль треку. Результат — це повноцінний комерційний аудіопродукт, готовий до інтеграції в рекламу, кіно або цифрові проєкти будь-якого масштабу.',
    contact_title: 'Контакти', contact_sub: "Зв'язатися · Колаборація · Підписатися",
    contact_name: "Ваше ім'я", contact_email: 'Ваш email', contact_msg: 'Повідомлення',
    contact_send: 'Надіслати', contact_sent: 'Надіслано!', contact_error: 'Помилка. Спробуйте ще.',
    agent_placeholder: 'Запитайте про Руслана...',
    agent_title: 'AI Асистент',
    footer: '© 2026 · Руслан Дубов · AI. Мистецтво. Адаптогени.',
    badge_featured: 'Головне',
    bio1: "Мене звати <strong>Руслан Дубов</strong>. Я — AI-креатор, промпт-інженер та дослідник нейромереж, який працює на перетині технологій, візуального мистецтва та усвідомленого підходу до життя. Я не просто генерую контент, я досліджую межі можливостей ШІ, створюючи відео, арты та музику, які розповідають історії без зайвих слів.",
    bio2: "Мій основний стек: <strong>ChatGPT, Midjourney, Claude, Suno, Google AI</strong>. Завдяки глибокому розумінню архітектури LLM та дифузійних моделей, я розробляю складні структуровані промпти, перетворюючи абстрактні ідеї на готовий комерційний продукт швидше і точніше, ніж будь-коли.",
    contact_bio1: "Живу в Україні, місто Дніпро. Мені 47 років. Працюю повністю віддалено з проєктами та клієнтами по всьому світу.",
    contact_bio2: "Гарантую порядність та суворе дотримання термінів. Готовий до співпраці як на постійній основі, так і під разові проєкти. Всі деталі обговорюються в особистому спілкуванні.",
  },
  ru: {
    nav_about: 'Обо мне', nav_arts: 'Арты', nav_video: 'Видео', nav_music: 'Музыка', nav_contact: 'Контакты',
    about_title: 'Руслан Дубов', about_sub: 'AI Контент-Криейтор · Визуальный Художник · Адаптогены',
    arts_title: 'AI Arts & Visual Research',
    arts_desc: 'Глубокое исследование латентного пространства и диффузионных нейросетей (Midjourney) для создания гиперреалистичных визуальных концептов. Ультимативный контроль над кинематографичным светом, композицией и генеративной эстетикой через ювелирный промпт-инжиниринг. Максимальная консистентность персонажей, сложная стилизация и визуальный сторителлинг нового поколения. Я экспериментирую с блендингом стилей, мульти-весовыми параметрами и параметрической архитектурой промптов, чтобы добиваться студийного качества рендеринга. От фотореализма до сюрреалистичных абстракций — каждая работа представляет собой результат тонкой калибровки AI, где математические алгоритмы превращаются в уникальное цифровое искусство, отвечающее высочайшим коммерческим стандартам.',
    arts_featured: 'Главное', arts_empty: 'Загрузите изображения в Supabase "arts" bucket.',
    arts_search_placeholder: 'Поиск артов...',
    video_title: 'AI Video Production',
    video_desc: 'Next-gen видеопродакшн на базе искусственного интеллекта. Бесшовный пайплайн от разработки сценарных концептов в LLM до AI-режиссуры и динамичной генерации кадров. Фокус на кинематографичности, темпоральной стабильности (temporal consistency) и иммерсивном сторителлинге для создания wow-эффекта. Используя передовые нейросети, я создаю сложные анимационные переходы, контролирую динамику камеры и интегрирую гиперреалистичные VFX без потери качества. Это не просто генерация — это полная режиссура виртуальной среды, где каждый фрейм выверен до пикселя, а машинное зрение помогает воплощать масштабные кинематографичные идеи, недоступные традиционному видеопродакшену в такие сжатые сроки.',
    music_title: 'AI Music & Audio Generation',
    music_desc: 'Нейроакустический саунд-дизайн и алгоритмическая генерация треков (Suno AI). Создание сложной аудио-архитектуры через мета-тегирование и контроль ритмики. От мощных битов до эмоциональных саундтреков — полная синергия музыки и визуального нарратива, превращающая абстрактные запросы в студийное звучание. Я детально прорабатываю структуру композиций: от интро и хуков до эпичных дропов и вокальной генерации. Грамотное использование prompt-инжиниринга в музыке позволяет не только задать точный BPM или тембр голоса, но и спроектировать уникальный психоакустический профиль трека. Результат — это полноценный коммерческий аудиопродукт, готовый к интеграции в рекламу, кино или цифровые проекты любого масштаба.',
    contact_title: 'Контакты', contact_sub: 'Связаться · Коллаборация · Подписаться',
    contact_name: 'Ваше имя', contact_email: 'Ваш email', contact_msg: 'Сообщение',
    contact_send: 'Отправить', contact_sent: 'Отправлено!', contact_error: 'Ошибка. Попробуйте снова.',
    agent_placeholder: 'Спросите о Руслане...',
    agent_title: 'AI Ассистент',
    footer: '© 2026 · Руслан Дубов · AI. Искусство. Адаптогены.',
    badge_featured: 'Главное',
    bio1: 'Меня зовут <strong>Руслан Дубов</strong>. Я — AI-креатор, промпт-инженер и исследователь нейросетей, работающий на стыке технологий, визуального искусства и осознанного подхода к жизни. Я не просто генерирую контент, я исследую пределы возможностей ИИ, создавая видео, арты и музыку, которые рассказывают истории без лишних слов.',
    bio2: 'Мой основной стек: <strong>ChatGPT, Midjourney, Claude, Suno, Google AI</strong>. Благодаря глубокому пониманию архитектуры LLM и диффузионных моделей, я разрабатываю сложные структурированные промпты, превращая абстрактные идеи в готовый коммерческий продукт быстрее и точнее, чем когда-либо.',
    contact_bio1: 'Живу в Украине, город Днепр. Мне 47 лет. Работаю полностью удаленно с проектами и клиентами по всему миру.',
    contact_bio2: 'Гарантирую порядочность и строгое соблюдение сроков. Готов к сотрудничеству как на постоянной основе, так и под разовые проекты. Все подробности обсуждаются в личном общении.',
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
