'use client';
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { PatternText } from '@/components/ui/pattern-text';

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
    <div className="max-w-4xl mx-auto px-8 py-9">
      <div className="mb-2">
        <PatternText
          text={t('contact_title')}
          className="!text-[3.5rem] md:!text-[5rem] !font-semibold italic leading-none"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        />
      </div>
      <p className="text-sm text-white/30 font-light mb-8">{t('contact_sub')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Social cards */}
        <div>
          <p className="text-[10px] font-semibold tracking-[2px] text-white/18 uppercase mb-3.5">Social Media</p>
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
          <p className="text-[10px] font-semibold tracking-[2px] text-white/18 uppercase mb-3.5">Send Message</p>
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
              className="w-full py-3 rounded-xl bg-white/[0.08] border border-white/10 text-sm font-medium text-white/70 hover:bg-white/14 hover:text-white transition-all disabled:opacity-40"
            >
              {status === 'sending' ? '...' : status === 'sent' ? t('contact_sent') : t('contact_send')}
            </button>
            {status === 'error' && <p className="text-red-400/70 text-xs text-center">{t('contact_error')}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
