'use client';
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import Image from 'next/image';

const socials = [
  { platform: 'YouTube', handle: '@ruslandubov5532', href: 'https://www.youtube.com/@ruslandubov5532', icon: '▶' },
  { platform: 'TikTok', handle: '@ruslan.dubov', href: 'https://www.tiktok.com/@ruslan.dubov', icon: '♪' },
  { platform: 'Instagram', handle: '@ruslan.dubov', href: 'https://www.instagram.com/ruslan.dubov', icon: '◎' },
  { platform: 'Facebook', handle: 'rslndubov', href: 'https://www.facebook.com/rslndubov', icon: 'f' },
  { platform: 'Telegram', handle: '@Dubovruslan', href: 'https://t.me/Dubovruslan', icon: '✈' },
  { platform: 'Email', handle: 'rslndubov@gmail.com', href: 'mailto:rslndubov@gmail.com', icon: '✉' },
];

export default function ContactPage() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

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

      {/* ── CONTACT ── */}
      <section className="mt-8 pb-12">
        <h2 className="font-serif text-[1.6rem] italic font-semibold text-white/45 mb-6 tracking-[0.5px] text-center">
          {t('contact_title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Social cards */}
          <div>
            <p className="text-[10px] font-semibold tracking-[2px] text-white/[0.18] uppercase mb-3.5">Social Media</p>
            <div className="grid grid-cols-1 gap-2">
              {socials.map(s => (
                <a key={s.platform} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3.5 px-4 py-3.5 bg-[#141414] border border-white/[0.06] rounded-xl hover:border-white/20 hover:bg-white/[0.03] transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-sm text-white/50">{s.icon}</div>
                  <div>
                    <div className="text-[10px] font-semibold text-white/25 tracking-widest uppercase">{s.platform}</div>
                    <div className="text-sm font-medium text-white/65">{s.handle}</div>
                  </div>
                  <span className="ml-auto text-white/15 group-hover:text-white/50 transition-colors">→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Email form */}
          <div>
            <p className="text-[10px] font-semibold tracking-[2px] text-white/[0.18] uppercase mb-3.5">Send Message</p>
            <form onSubmit={handleSend} className="space-y-3">
              <input
                required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder={t('contact_name')}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/70 placeholder-white/20 outline-none focus:border-white/20"
              />
              <input
                required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder={t('contact_email')}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/70 placeholder-white/20 outline-none focus:border-white/20"
              />
              <textarea
                required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder={t('contact_msg')}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/70 placeholder-white/20 outline-none focus:border-white/20 resize-none"
              />
              <button
                type="submit" disabled={status === 'sending'}
                className="w-full py-3 rounded-xl bg-white/[0.08] border border-white/10 text-sm font-medium text-white/70 hover:bg-white/[0.14] hover:text-white transition-all disabled:opacity-40"
              >
                {status === 'sending' ? '...' : status === 'sent' ? t('contact_sent') : t('contact_send')}
              </button>
              {status === 'error' && <p className="text-red-400/70 text-xs text-center">{t('contact_error')}</p>}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
